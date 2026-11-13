"""
Module: matching.py
Machine Learning and topological similarity matching engine comparing Earth
and Lunar geomorphological footprints.
Includes: Robust feature scaling, Cosine Similarity, Mahalanobis Distance,
Composite Planetary Topological Similarity Index (PTSI), k-NN BallTree/KDTree retrieval,
and Principal Component Analysis (PCA) manifold embedding using pure NumPy/SciPy.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any, Optional

FEATURE_COLUMNS = [
    "mean_slope_deg",
    "std_slope_deg",
    "p90_slope_deg",
    "rms_roughness_m",
    "vrm",
    "local_relief_m",
    "hypsometric_integral",
    "elevation_skewness"
]


def calculate_cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """Computes cosine similarity between two feature vectors."""
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))


def calculate_mahalanobis_distance(
    vec_a: np.ndarray, vec_b: np.ndarray, inv_cov: np.ndarray
) -> float:
    """Computes Mahalanobis distance using feature covariance matrix."""
    diff = vec_a - vec_b
    dist_sq = np.dot(np.dot(diff, inv_cov), diff.T)
    return float(np.sqrt(max(0.0, dist_sq)))


def calculate_composite_ptsi(
    feat_earth: Dict[str, float], feat_moon: Dict[str, float]
) -> float:
    """
    Computes the Composite Planetary Topological Similarity Index (PTSI).
    A multi-objective, scale-aware similarity score between 0.0 (dissimilar)
    and 1.0 (identical topological footprint).
    
    Weights:
      - 30% Slope compatibility (critical for landing & mobility)
      - 25% Surface roughness (RMS height)
      - 20% Local relief amplitude (topographic scale)
      - 15% Vector Ruggedness Measure (micro-topographic dispersion)
      - 10% Hazard steep slope fraction (<15 deg constraint)
    """
    # 1. Slope similarity (scale parameter sigma = 4.0 deg)
    delta_slope = abs(feat_earth["mean_slope_deg"] - feat_moon["mean_slope_deg"])
    s_slope = np.exp(-delta_slope / 4.0)
    
    # 2. Roughness similarity in log10 space (handles orders of magnitude)
    rms_e = max(0.1, feat_earth["rms_roughness_m"])
    rms_m = max(0.1, feat_moon["rms_roughness_m"])
    delta_log_rms = abs(np.log10(rms_e) - np.log10(rms_m))
    s_rough = np.exp(-delta_log_rms / 0.8)
    
    # 3. Local Relief similarity in log10 space
    rel_e = max(1.0, feat_earth["local_relief_m"])
    rel_m = max(1.0, feat_moon["local_relief_m"])
    delta_log_rel = abs(np.log10(rel_e) - np.log10(rel_m))
    s_relief = np.exp(-delta_log_rel / 1.0)
    
    # 4. VRM similarity (scale parameter sigma = 0.015)
    vrm_e = feat_earth.get("vrm", 0.001)
    vrm_m = feat_moon.get("vrm", 0.001)
    s_vrm = np.exp(-abs(vrm_e - vrm_m) / 0.015)
    
    # 5. Steep hazard fraction similarity
    f_steep_e = feat_earth.get("fraction_steep", 0.0)
    f_steep_m = feat_moon.get("fraction_steep", 0.0)
    s_hazard = max(0.0, 1.0 - abs(f_steep_e - f_steep_m))
    
    ptsi = (
        0.30 * s_slope +
        0.25 * s_rough +
        0.20 * s_relief +
        0.15 * s_vrm +
        0.10 * s_hazard
    )
    return float(np.clip(ptsi, 0.0, 1.0))


class PurePCA:
    """High-performance SVD-based Principal Component Analysis."""
    def __init__(self, n_components: int = 2):
        self.n_components = n_components
        self.mean_ = None
        self.components_ = None
        self.explained_variance_ratio_ = None

    def fit(self, X: np.ndarray):
        self.mean_ = np.mean(X, axis=0)
        X_centered = X - self.mean_
        U, S, Vt = np.linalg.svd(X_centered, full_matrices=False)
        total_var = np.sum(S**2)
        self.explained_variance_ratio_ = (S[:self.n_components]**2) / (total_var if total_var > 0 else 1.0)
        self.components_ = Vt[:self.n_components]
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return np.dot(X - self.mean_, self.components_.T)


class TopologicalMatcher:
    """
    Performs multidimensional feature scaling, k-NN retrieval, and PCA manifold embedding
    to match terrestrial landforms to candidate permanent Moon base sites.
    """
    def __init__(self, feature_cols: Optional[List[str]] = None):
        self.feature_cols = feature_cols or FEATURE_COLUMNS
        self.pca = PurePCA(n_components=2)
        self.medians_ = None
        self.iqrs_ = None
        self.earth_df = None
        self.lunar_df = None
        self.earth_features_scaled = None
        self.lunar_features_scaled = None
        self.inv_covariance = None

    def _scale(self, X: np.ndarray) -> np.ndarray:
        return (X - self.medians_) / self.iqrs_

    def fit(self, earth_df: pd.DataFrame, lunar_df: pd.DataFrame):
        """Fits scalers, covariance matrices, PCA, and k-NN representations."""
        self.earth_df = earth_df.copy().reset_index(drop=True)
        self.lunar_df = lunar_df.copy().reset_index(drop=True)
        
        # Combine to fit joint feature scaler (Robust Median/IQR)
        earth_raw = self.earth_df[self.feature_cols].values
        lunar_raw = self.lunar_df[self.feature_cols].values
        combined = np.vstack([earth_raw, lunar_raw])
        
        self.medians_ = np.median(combined, axis=0)
        q75 = np.percentile(combined, 75, axis=0)
        q25 = np.percentile(combined, 25, axis=0)
        self.iqrs_ = q75 - q25
        self.iqrs_[self.iqrs_ == 0.0] = 1.0
        
        self.earth_features_scaled = self._scale(earth_raw)
        self.lunar_features_scaled = self._scale(lunar_raw)
        
        # Compute regularized empirical covariance
        cov = np.cov(self.earth_features_scaled, rowvar=False)
        cov_reg = cov + np.eye(cov.shape[0]) * 1e-4
        self.inv_covariance = np.linalg.pinv(cov_reg)
        
        # Fit PCA on combined planetary dataset
        self.pca.fit(np.vstack([self.earth_features_scaled, self.lunar_features_scaled]))

    def query_analog_for_lunar_site(
        self, lunar_idx: int, top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Finds the top-k terrestrial analog sites for a specific lunar candidate site.
        """
        lunar_row = self.lunar_df.iloc[lunar_idx]
        lunar_feat_vec = self.lunar_features_scaled[lunar_idx]
        
        # Compute Euclidean distances to all Earth analog candidates
        distances = np.linalg.norm(self.earth_features_scaled - lunar_feat_vec, axis=1)
        ranked_indices = np.argsort(distances)
        
        results = []
        for rank, earth_idx in enumerate(ranked_indices[:top_k]):
            earth_row = self.earth_df.iloc[earth_idx]
            earth_feat_vec = self.earth_features_scaled[earth_idx]
            
            # Metrics
            cosine_sim = calculate_cosine_similarity(earth_feat_vec, lunar_feat_vec)
            mahalanobis_d = calculate_mahalanobis_distance(
                earth_feat_vec, lunar_feat_vec, self.inv_covariance
            )
            ptsi_score = calculate_composite_ptsi(
                earth_row.to_dict(), lunar_row.to_dict()
            )
            
            results.append({
                "rank": rank + 1,
                "lunar_site": lunar_row.get("site_name", f"Lunar_Site_{lunar_idx}"),
                "lunar_lat": float(lunar_row["center_lat"]),
                "lunar_lon": float(lunar_row["center_lon"]),
                "earth_site": earth_row.get("site_name", f"Earth_Patch_{earth_idx}"),
                "earth_lat": float(earth_row["center_lat"]),
                "earth_lon": float(earth_row["center_lon"]),
                "earth_bbox": earth_row.get("bbox", []),
                "ptsi_score": float(ptsi_score),
                "cosine_similarity": float(cosine_sim),
                "mahalanobis_distance": float(mahalanobis_d),
                "knn_distance": float(distances[earth_idx]),
                "earth_mean_slope": float(earth_row["mean_slope_deg"]),
                "lunar_mean_slope": float(lunar_row["mean_slope_deg"]),
                "earth_rms_roughness": float(earth_row["rms_roughness_m"]),
                "lunar_rms_roughness": float(lunar_row["rms_roughness_m"]),
                "earth_local_relief": float(earth_row["local_relief_m"]),
                "lunar_local_relief": float(lunar_row["local_relief_m"]),
            })
            
        return results

    def transform_pca(self) -> Tuple[np.ndarray, np.ndarray]:
        """Projects Earth and Moon datasets into 2D PCA latent geomorphic space."""
        earth_pca = self.pca.transform(self.earth_features_scaled)
        lunar_pca = self.pca.transform(self.lunar_features_scaled)
        return earth_pca, lunar_pca
