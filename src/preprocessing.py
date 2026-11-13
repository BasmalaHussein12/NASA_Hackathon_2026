"""
Module: preprocessing.py
Handles multi-planetary Elevation Data Model (EDM/DEM) ingestion, cleaning,
void infill, artifact filtering, and coordinate/scale normalization.
High-performance implementation with patch-level localized filtering.
"""

import os
import numpy as np
from scipy import ndimage
from typing import Tuple, Dict, Any, Optional

# Physical planetary reference radii (SI meters)
RADIUS_EARTH_METERS = 6378137.0
RADIUS_MOON_METERS = 1737400.0


def calculate_metric_cell_size(lat_deg: float, ppd: float, planet: str = "moon") -> Tuple[float, float]:
    """
    Computes metric grid spacing (dy, dx) in meters at a given latitude.
    Takes into account meridional convergence of longitude lines.
    """
    radius = RADIUS_EARTH_METERS if planet.lower() == "earth" else RADIUS_MOON_METERS
    dy = (np.pi * radius) / (180.0 * ppd)
    
    lat_rad = np.radians(lat_deg)
    dx = dy * np.cos(lat_rad)
    
    min_cell_size = 1.0 if planet.lower() == "earth" else 20.0
    dx = max(dx, min_cell_size)
    return float(dy), float(dx)


class LunarDEMIngestor:
    """
    Ingests and normalizes Lunar Orbiter Laser Altimeter (LOLA) global DEMs.
    Standard product: LDEM_16 (5760 x 2880 pixels, 16 ppd, float32, km units).
    """
    def __init__(self, file_path: str, ppd: int = 16):
        self.file_path = file_path
        self.ppd = ppd
        self.n_lat = 180 * ppd  # 2880
        self.n_lon = 360 * ppd  # 5760
        self.dem_meters = None

    def load(self) -> np.ndarray:
        """Loads LOLA DEM from disk and converts from kilometers to SI meters."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Lunar DEM file not found at {self.file_path}")
        
        # Read float32 little endian
        raw = np.fromfile(self.file_path, dtype="<f4")
        if raw.size != (self.n_lat * self.n_lon):
            raise ValueError(
                f"Unexpected file size: {raw.size} elements, expected {self.n_lat * self.n_lon}"
            )
        
        # Reshape and convert km to meters relative to 1737.4 km reference sphere
        grid_meters = raw.reshape((self.n_lat, self.n_lon)) * 1000.0
        
        # Clean any non-finite entries
        invalid_mask = ~np.isfinite(grid_meters)
        if np.any(invalid_mask):
            grid_meters[invalid_mask] = 0.0
            
        self.dem_meters = grid_meters
        return self.dem_meters

    def extract_patch(
        self, lat: float, lon: float, radius_km: float = 15.0, smooth_sigma: float = 0.5
    ) -> Dict[str, Any]:
        """
        Extracts a localized sub-grid centered at (lat, lon) with radius_km.
        Handles coordinate wrapping at 0/360 degrees longitude.
        Applies patch-level Gaussian filtering for sub-pixel laser speckle suppression.
        """
        if self.dem_meters is None:
            self.load()
            
        r_center = int(round((90.0 - lat) * self.ppd))
        r_center = max(0, min(self.n_lat - 1, r_center))
        
        lon_normalized = lon % 360.0
        c_center = int(round(lon_normalized * self.ppd)) % self.n_lon
        
        dy, dx = calculate_metric_cell_size(lat, self.ppd, planet="moon")
        
        # Window size in pixels
        half_r = max(4, int(round((radius_km * 1000.0) / dy)))
        half_c = max(4, int(round((radius_km * 1000.0) / dx)))
        
        r_min = max(0, r_center - half_r)
        r_max = min(self.n_lat, r_center + half_r + 1)
        
        # Handle longitudinal wrapping across 0/360
        c_indices = [(c_center + dc) % self.n_lon for dc in range(-half_c, half_c + 1)]
        
        patch = self.dem_meters[r_min:r_max, :][:, c_indices].copy()
        
        # Localized smoothing
        if smooth_sigma > 0 and patch.size > 9:
            patch = ndimage.gaussian_filter(patch, sigma=smooth_sigma)
        
        min_lat = 90.0 - (r_max / self.ppd)
        max_lat = 90.0 - (r_min / self.ppd)
        min_lon = (lon - (half_c / self.ppd)) % 360.0
        max_lon = (lon + (half_c / self.ppd)) % 360.0
        
        return {
            "patch": patch,
            "center_lat": lat,
            "center_lon": lon,
            "dy_meters": dy,
            "dx_meters": dx,
            "bbox": [min_lat, min_lon, max_lat, max_lon],
            "planet": "Moon"
        }


class EarthSRTMIngestor:
    """
    Ingests and preprocesses Earth Shuttle Radar Topography Mission (SRTM) DEMs.
    Standard product: 1-arc-second HGT (3601 x 3601 pixels, int16 big-endian).
    """
    def __init__(self, file_path: str, base_lat: float = -1.0, base_lon: float = -47.0):
        self.file_path = file_path
        self.base_lat = base_lat
        self.base_lon = base_lon
        self.dem_meters = None

    def load(self) -> np.ndarray:
        """Loads SRTM HGT directly as float32 array in meters."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Earth DEM file not found at {self.file_path}")
        
        raw = np.fromfile(self.file_path, dtype=">i2")
        if raw.size == 3601 * 3601:
            grid = raw.reshape((3601, 3601)).astype(np.float32)
        elif raw.size == 1201 * 1201:
            grid = raw.reshape((1201, 1201)).astype(np.float32)
        else:
            raise ValueError(f"Unexpected SRTM grid size: {raw.size}")
            
        self.dem_meters = grid
        return self.dem_meters

    def extract_patches(
        self, patch_dim_pixels: int = 300, stride_pixels: int = 150, min_land_fraction: float = 0.6, smooth_sigma: float = 0.5
    ) -> list:
        """
        Tessellates the Earth tile into localized sub-patches.
        Cleans voids locally per patch and applies artifact smoothing.
        Filters out open ocean (elevation <= 0).
        """
        if self.dem_meters is None:
            self.load()
            
        n_rows, n_cols = self.dem_meters.shape
        ppd = n_rows - 1  # 3600 for 1-arc-second
        
        patches = []
        for r in range(0, n_rows - patch_dim_pixels, stride_pixels):
            for c in range(0, n_cols - patch_dim_pixels, stride_pixels):
                sub = self.dem_meters[r:r+patch_dim_pixels, c:c+patch_dim_pixels].copy()
                
                # Check fraction of land vs open ocean
                land_ratio = np.mean(sub > 0.0)
                if land_ratio < min_land_fraction:
                    continue  # Skip open ocean
                
                # Handle any localized void values in the sub-patch
                void_mask = (sub <= -500) | (sub == -32768)
                if np.any(void_mask):
                    if np.all(void_mask):
                        continue
                    valid_mean = np.mean(sub[~void_mask])
                    sub[void_mask] = valid_mean
                
                # Apply localized smoothing
                if smooth_sigma > 0:
                    sub = ndimage.gaussian_filter(sub, sigma=smooth_sigma)
                
                lat_center = (self.base_lat + 1.0) - (r + patch_dim_pixels / 2.0) / ppd
                lon_center = self.base_lon + (c + patch_dim_pixels / 2.0) / ppd
                
                dy, dx = calculate_metric_cell_size(lat_center, ppd, planet="earth")
                
                min_lat = (self.base_lat + 1.0) - (r + patch_dim_pixels) / ppd
                max_lat = (self.base_lat + 1.0) - r / ppd
                min_lon = self.base_lon + c / ppd
                max_lon = self.base_lon + (c + patch_dim_pixels) / ppd
                
                patches.append({
                    "patch": sub,
                    "center_lat": float(lat_center),
                    "center_lon": float(lon_center),
                    "dy_meters": dy,
                    "dx_meters": dx,
                    "bbox": [float(min_lat), float(min_lon), float(max_lat), float(max_lon)],
                    "planet": "Earth",
                    "source": "SRTM_s01w047"
                })
                
        return patches
