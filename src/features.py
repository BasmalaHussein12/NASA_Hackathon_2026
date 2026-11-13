"""
Module: features.py
Extracts comprehensive geomorphological and topological feature vectors
from planetary Elevation Data Models (EDM).

Features:
  1. Slope Metrics (Horn gradient): Mean, Median, Std, P90, Steep fraction (>15 deg)
  2. Surface Roughness: Detrended planar RMS height (Rq), Vector Ruggedness Measure (VRM), TRI
  3. Local Relief: Elevation range (Delta z), Hypsometric Integral (HI), Skewness, Kurtosis
  4. Subsurface & Cave / Lava Tube Metrics:
     - Negative TPI (Topographic Position Index for depression bowls / pits)
     - Pit Collapse Depth (Delta z_pit below regional baseline)
     - Rim Scarp Curvature (sharp rim-to-floor drop)
     - Cavity Shielding Potential (0-100% score for radiation/micrometeorite shelter)
  5. Solar Illumination Proxy:
     - Mean slope-aspect solar exposure factor (cos of incidence angle)
"""

import numpy as np
from scipy import ndimage, stats
from typing import Dict, Any, Tuple


def compute_gradient_horn(
    dem: np.ndarray, dy: float, dx: float
) -> Tuple[np.ndarray, np.ndarray]:
    """Computes horizontal and vertical spatial elevation derivatives using Horn's kernel."""
    kernel_x = np.array([[-1, 0, 1],
                         [-2, 0, 2],
                         [-1, 0, 1]], dtype=np.float32) / (8.0 * dx)
                         
    kernel_y = np.array([[-1, -2, -1],
                         [ 0,  0,  0],
                         [ 1,  2,  1]], dtype=np.float32) / (8.0 * dy)
                         
    p = ndimage.convolve(dem, kernel_x, mode='reflect')  # dz/dx
    q = ndimage.convolve(dem, kernel_y, mode='reflect')  # dz/dy
    return p, q


def compute_slope_map(
    dem: np.ndarray, dy: float, dx: float
) -> np.ndarray:
    """Computes grid of terrain slope in decimal degrees."""
    p, q = compute_gradient_horn(dem, dy, dx)
    gradient_magnitude = np.sqrt(p**2 + q**2)
    slope_deg = np.degrees(np.arctan(gradient_magnitude))
    return slope_deg


def compute_vector_ruggedness_measure(
    dem: np.ndarray, dy: float, dx: float, window_size: int = 5
) -> float:
    """
    Computes Vector Ruggedness Measure (VRM).
    Measures 3D unit normal vector dispersion decoupled from regional slope.
    """
    p, q = compute_gradient_horn(dem, dy, dx)
    norm = np.sqrt(p**2 + q**2 + 1.0)
    
    nx = -p / norm
    ny = -q / norm
    nz = 1.0 / norm
    
    footprint = np.ones((window_size, window_size), dtype=np.float32)
    sum_nx = ndimage.convolve(nx, footprint, mode='reflect')
    sum_ny = ndimage.convolve(ny, footprint, mode='reflect')
    sum_nz = ndimage.convolve(nz, footprint, mode='reflect')
    
    resultant_length = np.sqrt(sum_nx**2 + sum_ny**2 + sum_nz**2)
    vrm_map = 1.0 - (resultant_length / (window_size * window_size))
    vrm_map = np.clip(vrm_map, 0.0, 1.0)
    return float(np.mean(vrm_map))


def compute_detrended_rms_roughness(dem: np.ndarray) -> float:
    """Computes RMS surface roughness (Rq) after removing planar regional tilt."""
    ny, nx = dem.shape
    y_coords, x_coords = np.mgrid[0:ny, 0:nx]
    
    x_flat = x_coords.flatten()
    y_flat = y_coords.flatten()
    z_flat = dem.flatten()
    
    A = np.column_stack([x_flat, y_flat, np.ones_like(x_flat)])
    plane_params, _, _, _ = np.linalg.lstsq(A, z_flat, rcond=None)
    fitted_plane = (plane_params[0] * x_coords + 
                    plane_params[1] * y_coords + 
                    plane_params[2])
                    
    residuals = dem - fitted_plane
    rms = np.sqrt(np.mean(residuals**2))
    return float(rms)


def compute_subsurface_cave_features(
    dem: np.ndarray, dy: float, dx: float
) -> Dict[str, float]:
    """
    Extracts morphometric indicators of collapsed lava tubes, pit craters, and cave skylights:
      - Negative TPI (Topographic Position Index): Depth of depression relative to 9x9 annulus
      - Pit Collapse Depth (m): Max negative drop below local planar baseline
      - Rim Scarp Curvature: Edge gradient highlighting vertical skylight rim walls
      - Cavity Shielding Potential (0-100%): Suitability for subterranean radiation/thermal shelter
    """
    # 1. Topographic Position Index (TPI) with 9x9 neighborhood
    kernel_size = 9
    footprint = np.ones((kernel_size, kernel_size), dtype=np.float32)
    footprint[kernel_size//2, kernel_size//2] = 0.0  # exclude center
    footprint /= (kernel_size * kernel_size - 1.0)
    
    local_mean = ndimage.convolve(dem, footprint, mode='reflect')
    tpi_grid = dem - local_mean
    
    # Negative TPI measures isolated pits / depressions
    min_tpi = float(np.min(tpi_grid))
    mean_negative_tpi = float(np.mean(tpi_grid[tpi_grid < 0])) if np.any(tpi_grid < 0) else 0.0
    
    # 2. Pit collapse depth (maximum localized drop)
    pit_depth = max(0.0, -min_tpi)
    
    # 3. Rim scarp curvature via Laplacian operator
    laplacian_kernel = np.array([[0, 1, 0],
                                 [1, -4, 1],
                                 [0, 1, 0]], dtype=np.float32) / (dy * dx)
    curvature = ndimage.convolve(dem, laplacian_kernel, mode='reflect')
    max_scarp_curvature = float(np.percentile(np.abs(curvature), 95))
    
    # 4. Cavity Shielding Potential (0 - 100%)
    # Higher score if pit depth >= 15m (blocks cosmic rays & micrometeorites) and rim is well-defined
    depth_score = min(1.0, pit_depth / 25.0)  # max score at 25m depth
    curvature_score = min(1.0, max_scarp_curvature * 100.0)
    shielding_potential = (0.65 * depth_score + 0.35 * curvature_score) * 100.0
    shielding_potential = float(np.clip(shielding_potential, 5.0, 98.0))
    
    return {
        "pit_depth_m": round(pit_depth, 1),
        "mean_negative_tpi_m": round(abs(mean_negative_tpi), 1),
        "rim_scarp_curvature": round(max_scarp_curvature, 4),
        "cavity_shielding_potential_pct": round(shielding_potential, 1)
    }


def compute_solar_exposure_proxy(dem: np.ndarray, dy: float, dx: float) -> float:
    """
    Computes a dimensionless solar exposure index [0.0 to 1.0].
    Estimates grazing illumination factor critical for Lunar South Pole
    Peaks of Eternal Light (high exposure) vs cold traps (low exposure).
    """
    p, q = compute_gradient_horn(dem, dy, dx)
    slope_rad = np.arctan(np.sqrt(p**2 + q**2))
    aspect_rad = np.arctan2(-p, q)
    
    # Low sun angle simulation (typical 3 deg above horizon at Lunar South Pole)
    sun_alt_rad = np.radians(3.0)
    sun_az_rad = np.radians(180.0)  # coming from South
    
    # Cosine of solar incidence angle
    cos_inc = (np.sin(sun_alt_rad) * np.cos(slope_rad) +
               np.cos(sun_alt_rad) * np.sin(slope_rad) * np.cos(sun_az_rad - aspect_rad))
               
    exposure_fraction = float(np.mean(np.clip(cos_inc, 0.0, 1.0)))
    return round(exposure_fraction, 3)


def extract_topological_feature_vector(
    dem_patch: np.ndarray, dy: float, dx: float
) -> Dict[str, float]:
    """
    Extracts the full multi-dimensional geomorphological, subsurface,
    and illumination feature vector for an elevation patch.
    """
    patch = dem_patch.astype(np.float32)
    
    # 1. Slope metrics
    slope_map = compute_slope_map(patch, dy, dx)
    mean_slope = float(np.mean(slope_map))
    median_slope = float(np.median(slope_map))
    std_slope = float(np.std(slope_map))
    p90_slope = float(np.percentile(slope_map, 90))
    fraction_steep = float(np.mean(slope_map > 15.0))
    
    # 2. Roughness metrics
    rms_roughness = compute_detrended_rms_roughness(patch)
    vrm = compute_vector_ruggedness_measure(patch, dy, dx)
    
    # 3. Local Relief & Hypsometry
    z_min = float(np.min(patch))
    z_max = float(np.max(patch))
    local_relief = max(0.1, z_max - z_min)
    z_mean = float(np.mean(patch))
    hi = (z_mean - z_min) / local_relief
    skew = float(stats.skew(patch.flatten()))
    kurt = float(stats.kurtosis(patch.flatten()))
    
    # 4. Subsurface Cave & Lava Tube Collapse Metrics
    subsurface = compute_subsurface_cave_features(patch, dy, dx)
    
    # 5. Solar Illumination / Aspect Exposure Proxy
    solar_exposure = compute_solar_exposure_proxy(patch, dy, dx)
    
    return {
        "mean_slope_deg": mean_slope,
        "median_slope_deg": median_slope,
        "std_slope_deg": std_slope,
        "p90_slope_deg": p90_slope,
        "fraction_steep": fraction_steep,
        "rms_roughness_m": rms_roughness,
        "vrm": vrm,
        "local_relief_m": local_relief,
        "hypsometric_integral": hi,
        "elevation_skewness": skew,
        "elevation_kurtosis": kurt,
        "elev_mean_m": z_mean,
        "solar_exposure_proxy": solar_exposure,
        **subsurface
    }
