"""
Module: features.py
Extracts comprehensive geomorphological and topological feature vectors
from planetary Elevation Data Models (EDM).
Features: Slope (Horn gradient), Surface Roughness (RMS height, VRM, TRI),
Local Relief (elevation range, TPI, Hypsometric Integral, Skewness).
"""

import numpy as np
from scipy import ndimage, stats
from typing import Dict, Any, Tuple


def compute_gradient_horn(
    dem: np.ndarray, dy: float, dx: float
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Computes horizontal and vertical spatial elevation derivatives using
    Horn's 8-neighbor weighted convolution kernel.
    """
    # Kernels for dz/dx and dz/dy
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
    """
    Computes grid of terrain slope in decimal degrees.
    """
    p, q = compute_gradient_horn(dem, dy, dx)
    gradient_magnitude = np.sqrt(p**2 + q**2)
    slope_deg = np.degrees(np.arctan(gradient_magnitude))
    return slope_deg


def compute_vector_ruggedness_measure(
    dem: np.ndarray, dy: float, dx: float, window_size: int = 5
) -> float:
    """
    Computes the Vector Ruggedness Measure (VRM, Sappington et al., 2007).
    Measures dispersion of unit normal vectors in 3D space.
    Invariant to planar slope, isolating pure surface roughness.
    Range: [0.0 (perfectly planar) to 1.0 (maximally rugged)].
    """
    p, q = compute_gradient_horn(dem, dy, dx)
    norm = np.sqrt(p**2 + q**2 + 1.0)
    
    # 3D unit normal vectors: (-p/norm, -q/norm, 1/norm)
    nx = -p / norm
    ny = -q / norm
    nz = 1.0 / norm
    
    # Sum components within local window
    footprint = np.ones((window_size, window_size), dtype=np.float32)
    sum_nx = ndimage.convolve(nx, footprint, mode='reflect')
    sum_ny = ndimage.convolve(ny, footprint, mode='reflect')
    sum_nz = ndimage.convolve(nz, footprint, mode='reflect')
    
    resultant_length = np.sqrt(sum_nx**2 + sum_ny**2 + sum_nz**2)
    vrm_map = 1.0 - (resultant_length / (window_size * window_size))
    vrm_map = np.clip(vrm_map, 0.0, 1.0)
    return float(np.mean(vrm_map))


def compute_detrended_rms_roughness(dem: np.ndarray) -> float:
    """
    Computes Root-Mean-Square (RMS) surface roughness (Rq) after removing
    the first-order 2D planar regional tilt.
    """
    ny, nx = dem.shape
    y_coords, x_coords = np.mgrid[0:ny, 0:nx]
    
    # Design matrix for planar fit: z = a*x + b*y + c
    x_flat = x_coords.flatten()
    y_flat = y_coords.flatten()
    z_flat = dem.flatten()
    
    A = np.column_stack([x_flat, y_flat, np.ones_like(x_flat)])
    # Least-squares fit
    plane_params, _, _, _ = np.linalg.lstsq(A, z_flat, rcond=None)
    fitted_plane = (plane_params[0] * x_coords + 
                    plane_params[1] * y_coords + 
                    plane_params[2])
                    
    residuals = dem - fitted_plane
    rms = np.sqrt(np.mean(residuals**2))
    return float(rms)


def compute_terrain_ruggedness_index(dem: np.ndarray) -> float:
    """
    Computes Riley's Terrain Ruggedness Index (TRI) - mean elevation difference to neighbors.
    """
    # 3x3 neighborhood elevation differences
    diff_sum = np.zeros_like(dem)
    count = 0
    for dy in [-1, 0, 1]:
        for dx in [-1, 0, 1]:
            if dy == 0 and dx == 0:
                continue
            shifted = np.roll(np.roll(dem, dy, axis=0), dx, axis=1)
            diff_sum += (dem - shifted)**2
            count += 1
            
    tri_map = np.sqrt(diff_sum / count)
    return float(np.mean(tri_map))


def extract_topological_feature_vector(
    dem_patch: np.ndarray, dy: float, dx: float
) -> Dict[str, float]:
    """
    Extracts high-dimensional geomorphological feature vector for a DEM patch.
    
    Returns dictionary with:
      - Slope metrics: mean_slope, median_slope, std_slope, p90_slope, fraction_steep (>15 deg)
      - Roughness metrics: rms_roughness_m, vrm, tri_m
      - Relief metrics: local_relief_m, hypsometric_integral, elevation_skewness
      - Statistical moments: elev_mean_m, elev_std_m
    """
    # Ensure float32 array
    patch = dem_patch.astype(np.float32)
    
    # 1. Slope metrics
    slope_map = compute_slope_map(patch, dy, dx)
    mean_slope = float(np.mean(slope_map))
    median_slope = float(np.median(slope_map))
    std_slope = float(np.std(slope_map))
    p90_slope = float(np.percentile(slope_map, 90))
    fraction_steep = float(np.mean(slope_map > 15.0))  # Rover traverse constraint
    
    # 2. Roughness metrics
    rms_roughness = compute_detrended_rms_roughness(patch)
    vrm = compute_vector_ruggedness_measure(patch, dy, dx)
    tri = compute_terrain_ruggedness_index(patch)
    
    # 3. Local Relief metrics
    z_min = float(np.min(patch))
    z_max = float(np.max(patch))
    local_relief = max(0.1, z_max - z_min)
    
    # Hypsometric Integral: (mean - min) / (max - min)
    z_mean = float(np.mean(patch))
    z_std = float(np.std(patch))
    hi = (z_mean - z_min) / local_relief
    
    # Hypsometric skewness
    skew = float(stats.skew(patch.flatten()))
    
    return {
        "mean_slope_deg": mean_slope,
        "median_slope_deg": median_slope,
        "std_slope_deg": std_slope,
        "p90_slope_deg": p90_slope,
        "fraction_steep": fraction_steep,
        "rms_roughness_m": rms_roughness,
        "vrm": vrm,
        "tri_m": tri,
        "local_relief_m": local_relief,
        "hypsometric_integral": hi,
        "elevation_skewness": skew,
        "elev_mean_m": z_mean,
        "elev_std_m": z_std
    }
