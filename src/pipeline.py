"""
Module: pipeline.py
End-to-end pipeline orchestrator for the Terrestrial-Lunar Planetary Analog Discovery Engine.
Integrates EDM ingestion, geomorphological feature extraction, ML topological matching,
scientific validation, visualization generation, and final CSV deliverable generation.
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.preprocessing import LunarDEMIngestor, EarthSRTMIngestor
from src.features import extract_topological_feature_vector
from src.matching import TopologicalMatcher, FEATURE_COLUMNS
from src.validation import TERRESTRIAL_ANALOG_REGISTRY, evaluate_scientific_viability

# Candidate permanent lunar base sites (Artemis Landing Candidates + Mare / Lava Tube nodes)
LUNAR_BASE_CANDIDATES = [
    {
        "site_name": "Mons Mouton (Leibnitz Beta)",
        "center_lat": -84.80,
        "center_lon": 31.70,
        "region_type": "Highland Plateau (Artemis III Candidate)",
        "mission_focus": "Elevated flat summit for high-power solar arrays and permanent base camp."
    },
    {
        "site_name": "Malapert Massif",
        "center_lat": -85.99,
        "center_lon": 357.07,
        "region_type": "High-Elevation Massif Ridge (Artemis III Candidate)",
        "mission_focus": "Continuous direct line-of-sight communication to Earth and permanent sunlight."
    },
    {
        "site_name": "Peak Near Shackleton",
        "center_lat": -88.90,
        "center_lon": 124.50,
        "region_type": "South Pole Impact Crater Rim (Artemis III Candidate)",
        "mission_focus": "Direct access to cryogenic permanently shadowed region (PSR) water ice."
    },
    {
        "site_name": "Connecting Ridge",
        "center_lat": -89.40,
        "center_lon": 222.00,
        "region_type": "Highland Col Ridge (Artemis III Candidate)",
        "mission_focus": "Strategic traverse corridor linking Shackleton and de Gerlache craters."
    },
    {
        "site_name": "Nobile Rim 1",
        "center_lat": -85.20,
        "center_lon": 37.80,
        "region_type": "Degraded Polar Impact Crater (Artemis / VIPER)",
        "mission_focus": "Rolling degraded terrain with accessible volatile-bearing micro-cold traps."
    },
    {
        "site_name": "Faustini Rim A",
        "center_lat": -87.30,
        "center_lon": 77.00,
        "region_type": "Steep Highland Ridge (Artemis III Candidate)",
        "mission_focus": "High-altitude vantage point overlooking deep Faustini cold traps."
    },
    {
        "site_name": "Mare Tranquillitatis Pit (MTP)",
        "center_lat": 8.33,
        "center_lon": 33.22,
        "region_type": "Equatorial Mare Basalt Plain & Lava Tube Pit",
        "mission_focus": "Sub-surface shelter entrance in confirmed conduit; pristine mare basalt."
    },
    {
        "site_name": "Marius Hills Skylight",
        "center_lat": 14.20,
        "center_lon": 303.20,
        "region_type": "Volcanic Dome Field & Lava Tube Skylight",
        "mission_focus": "Deep sub-surface lava tube shelter protected from radiation and thermal swings."
    }
]


class PlanetaryAnalogPipeline:
    def __init__(
        self,
        earth_hgt_path: str = "Data/Earth_Data/s01w047.hgt",
        moon_dem_path: str = "Data/Moon_Data/ldem_16_float.img",
        output_dir: str = "outputs"
    ):
        self.earth_hgt_path = earth_hgt_path
        self.moon_dem_path = moon_dem_path
        self.output_dir = output_dir
        self.figures_dir = os.path.join(output_dir, "figures")
        os.makedirs(self.figures_dir, exist_ok=True)
        
        self.lunar_ingestor = LunarDEMIngestor(moon_dem_path)
        self.earth_ingestor = EarthSRTMIngestor(earth_hgt_path)
        self.matcher = TopologicalMatcher()
        
        self.lunar_df = None
        self.earth_df = None
        self.matched_records = []

    def process_lunar_sites(self) -> pd.DataFrame:
        """Extracts topographic feature vectors for all candidate lunar base sites."""
        print("[1/5] Ingesting Lunar EDM and extracting candidate base features...")
        self.lunar_ingestor.load()
        
        lunar_records = []
        for site in LUNAR_BASE_CANDIDATES:
            lat = site["center_lat"]
            lon = site["center_lon"]
            extracted = self.lunar_ingestor.extract_patch(lat, lon, radius_km=15.0)
            
            features = extract_topological_feature_vector(
                extracted["patch"], extracted["dy_meters"], extracted["dx_meters"]
            )
            
            rec = {
                "site_name": site["site_name"],
                "center_lat": lat,
                "center_lon": lon,
                "region_type": site["region_type"],
                "mission_focus": site["mission_focus"],
                "bbox": extracted["bbox"],
                **features
            }
            lunar_records.append(rec)
            
        self.lunar_df = pd.DataFrame(lunar_records)
        print(f"      Processed {len(self.lunar_df)} lunar base sites.")
        return self.lunar_df

    def process_earth_analogs(self) -> pd.DataFrame:
        """Processes both local Earth DEM patches and global benchmark analog catalog."""
        print("[2/5] Ingesting Earth EDM and compiling global terrestrial analogs...")
        earth_records = []
        
        # 1. Process provided local SRTM tile (Pará coastal plain / land patches)
        try:
            self.earth_ingestor.load()
            local_patches = self.earth_ingestor.extract_patches(
                patch_dim_pixels=300, stride_pixels=150, min_land_fraction=0.6
            )
            for idx, p in enumerate(local_patches):
                feat = extract_topological_feature_vector(
                    p["patch"], p["dy_meters"], p["dx_meters"]
                )
                earth_records.append({
                    "site_name": f"Para_Coastal_Plain_Patch_{idx+1}",
                    "formal_name": f"Pará Amazonian Coastal Plain (Patch {idx+1})",
                    "country": "Brazil",
                    "center_lat": p["center_lat"],
                    "center_lon": p["center_lon"],
                    "bbox": p["bbox"],
                    "geological_facies": "Low-Relief Alluvial / Coastal Basaltic Plain",
                    "lithology": "Quaternary alluvial sediment, lateritic crust, sandstone",
                    "nasa_mission_context": "Direct local DEM ground-truth. Flat landscape mimicking lunar mare low relief.",
                    "scientific_viability": "Provides landing zone terrain analog for flat lunar mare surfaces.",
                    **feat
                })
        except Exception as e:
            print(f"      Warning loading local SRTM: {e}")

        # 2. Add global validated benchmark analogs
        for key, info in TERRESTRIAL_ANALOG_REGISTRY.items():
            earth_records.append({
                "site_name": key,
                **info
            })
            
        self.earth_df = pd.DataFrame(earth_records)
        print(f"      Compiled {len(self.earth_df)} terrestrial analog candidate regions.")
        return self.earth_df

    def run_matching(self) -> List[Dict[str, Any]]:
        """Fits ML models and matches each lunar site to best Earth analogs."""
        print("[3/5] Executing ML topological matching and similarity scoring...")
        self.matcher.fit(self.earth_df, self.lunar_df)
        
        self.matched_records = []
        for lunar_idx in range(len(self.lunar_df)):
            lunar_row = self.lunar_df.iloc[lunar_idx]
            # Retrieve top matches
            analogs = self.matcher.query_analog_for_lunar_site(lunar_idx, top_k=3)
            
            # Enrich best match
            best_match = analogs[0]
            earth_meta = self.earth_df[
                self.earth_df["center_lat"] == best_match["earth_lat"]
            ].iloc[0].to_dict()
            
            viability = evaluate_scientific_viability(
                earth_meta, best_match["lunar_site"]
            )
            
            combined = {
                **best_match,
                "formal_name": earth_meta.get("formal_name", best_match["earth_site"]),
                "country": earth_meta.get("country", "Unknown"),
                "geological_facies": earth_meta.get("geological_facies", "Geomorphological Analog"),
                "lithology": earth_meta.get("lithology", "Basalt / Impact Breccia"),
                "nasa_mission_context": earth_meta.get("nasa_mission_context", "NASA Planetary Analog Candidate"),
                "scientific_viability_desc": earth_meta.get("scientific_viability", "High-fidelity topological counterpart"),
                **viability
            }
            self.matched_records.append(combined)
            
        print(f"      Completed matching for {len(self.matched_records)} lunar base candidates.")
        return self.matched_records

    def generate_csv_deliverable(self) -> str:
        """Outputs the structured CSV file deliverable."""
        print("[4/5] Generating structured CSV deliverable...")
        csv_path = os.path.join(self.output_dir, "terrestrial_lunar_analogs.csv")
        
        # Prepare clean tabular format
        rows = []
        for rec in self.matched_records:
            bbox = rec.get("earth_bbox", [rec["earth_lat"]-0.05, rec["earth_lon"]-0.05, rec["earth_lat"]+0.05, rec["earth_lon"]+0.05])
            bbox_str = f"[{bbox[0]:.4f}, {bbox[1]:.4f}, {bbox[2]:.4f}, {bbox[3]:.4f}]"
            
            rows.append({
                "Lunar_Base_Site": rec["lunar_site"],
                "Lunar_Latitude": round(rec["lunar_lat"], 4),
                "Lunar_Longitude": round(rec["lunar_lon"], 4),
                "Earth_Analog_Site": rec["formal_name"],
                "Earth_Country": rec["country"],
                "Earth_Latitude": round(rec["earth_lat"], 4),
                "Earth_Longitude": round(rec["earth_lon"], 4),
                "Earth_Bounding_Box": bbox_str,
                "PTSI_Similarity_Score": round(rec["ptsi_score"] * 100.0, 2),  # as percentage
                "Cosine_Similarity": round(rec["cosine_similarity"], 4),
                "Mahalanobis_Distance": round(rec["mahalanobis_distance"], 3),
                "Earth_Mean_Slope_deg": round(rec["earth_mean_slope"], 2),
                "Lunar_Mean_Slope_deg": round(rec["lunar_mean_slope"], 2),
                "Earth_RMS_Roughness_m": round(rec["earth_rms_roughness"], 1),
                "Lunar_RMS_Roughness_m": round(rec["lunar_rms_roughness"], 1),
                "Earth_Local_Relief_m": round(rec["earth_local_relief"], 1),
                "Lunar_Local_Relief_m": round(rec["lunar_local_relief"], 1),
                "Geological_Facies": rec["geological_facies"],
                "Lithology_Bedrock": rec["lithology"],
                "Trafficability_Score": rec["trafficability_score"],
                "Landing_Safety_Rating": rec["landing_safety_rating"],
                "Habitat_Utility": rec["habitat_utility"],
                "NASA_Analog_Context": rec["nasa_mission_context"],
                "Scientific_Viability_Summary": rec["scientific_viability_desc"]
            })
            
        df_out = pd.DataFrame(rows)
        # Sort by PTSI similarity score descending
        df_out = df_out.sort_values(by="PTSI_Similarity_Score", ascending=False)
        df_out.to_csv(csv_path, index=False, encoding="utf-8")
        print(f"      Saved final CSV to: {csv_path}")
        return csv_path

    def generate_visualizations(self):
        """Generates publication-quality figures: PCA embedding, metric radar, similarity heatmap."""
        print("[5/5] Generating publication-grade visualizations...")
        
        # 1. PCA Latent Geomorphic Manifold Plot
        earth_pca, lunar_pca = self.matcher.transform_pca()
        var_ratio = self.matcher.pca.explained_variance_ratio_
        
        plt.figure(figsize=(10, 7), dpi=300)
        plt.scatter(
            earth_pca[:, 0], earth_pca[:, 1],
            c="#1f77b4", alpha=0.7, s=80, edgecolors="k", label="Earth Analogs & Tiles"
        )
        plt.scatter(
            lunar_pca[:, 0], lunar_pca[:, 1],
            c="#d62728", alpha=0.9, s=140, marker="^", edgecolors="k", label="Lunar Base Candidates"
        )
        
        # Label prominent lunar points
        for i, row in self.lunar_df.iterrows():
            plt.annotate(
                row["site_name"], (lunar_pca[i, 0], lunar_pca[i, 1]),
                fontsize=8, fontweight="bold", xytext=(5, 5), textcoords="offset points"
            )
            
        plt.title("Multi-Planetary Topographic Manifold (PCA Latent Space)", fontsize=13, fontweight="bold")
        plt.xlabel(f"Principal Component 1 ({var_ratio[0]*100:.1f}% Variance) - Energy & Relief Axis", fontsize=11)
        plt.ylabel(f"Principal Component 2 ({var_ratio[1]*100:.1f}% Variance) - Roughness & Slope Dispersion", fontsize=11)
        plt.grid(True, linestyle="--", alpha=0.5)
        plt.legend(loc="upper right", frameon=True)
        plt.tight_layout()
        pca_path = os.path.join(self.figures_dir, "pca_morphometry_embedding.png")
        plt.savefig(pca_path)
        plt.close()

        # 2. Topographic Metrics Comparison (Slope, Roughness, Relief)
        match_df = pd.DataFrame(self.matched_records)
        n_pairs = len(match_df)
        x = np.arange(n_pairs)
        width = 0.35
        
        fig, axes = plt.subplots(3, 1, figsize=(12, 11), sharex=True, dpi=300)
        
        # Subplot 1: Slope
        axes[0].bar(x - width/2, match_df["earth_mean_slope"], width, label="Earth Analog", color="#2ca02c")
        axes[0].bar(x + width/2, match_df["lunar_mean_slope"], width, label="Lunar Site", color="#ff7f0e")
        axes[0].set_ylabel("Mean Slope (deg)", fontweight="bold")
        axes[0].set_title("Geomorphological Feature Correspondence: Earth Analogs vs Lunar Base Sites", fontsize=13, fontweight="bold")
        axes[0].legend(loc="upper left")
        axes[0].grid(True, linestyle=":", alpha=0.6)
        
        # Subplot 2: RMS Roughness (log scale)
        axes[1].bar(x - width/2, match_df["earth_rms_roughness"], width, label="Earth Analog", color="#2ca02c")
        axes[1].bar(x + width/2, match_df["lunar_rms_roughness"], width, label="Lunar Site", color="#ff7f0e")
        axes[1].set_yscale("log")
        axes[1].set_ylabel("RMS Roughness (m, log)", fontweight="bold")
        axes[1].grid(True, linestyle=":", alpha=0.6)
        
        # Subplot 3: Local Relief
        axes[2].bar(x - width/2, match_df["earth_local_relief"], width, label="Earth Analog", color="#2ca02c")
        axes[2].bar(x + width/2, match_df["lunar_local_relief"], width, label="Lunar Site", color="#ff7f0e")
        axes[2].set_ylabel("Local Relief (m)", fontweight="bold")
        axes[2].set_xticks(x)
        axes[2].set_xticklabels(
            [f"{r['lunar_site']}\n-> {r['formal_name'][:18]}..." for _, r in match_df.iterrows()],
            rotation=30, ha="right", fontsize=8
        )
        axes[2].grid(True, linestyle=":", alpha=0.6)
        
        plt.tight_layout()
        comparison_path = os.path.join(self.figures_dir, "slope_roughness_relief_comparison.png")
        plt.savefig(comparison_path)
        plt.close()

        # 3. Similarity Score Distribution Plot
        plt.figure(figsize=(9, 5), dpi=300)
        sorted_matches = sorted(self.matched_records, key=lambda r: r["ptsi_score"], reverse=True)
        names = [f"{m['lunar_site']}\n({m['formal_name'][:15]}...)" for m in sorted_matches]
        scores = [m["ptsi_score"] * 100.0 for m in sorted_matches]
        
        bars = plt.barh(range(len(names)), scores, color="#3b528b", edgecolor="black")
        plt.yticks(range(len(names)), names, fontsize=9)
        plt.xlabel("Planetary Topological Similarity Index (PTSI %)", fontsize=11, fontweight="bold")
        plt.title("Terrestrial-Lunar Topographic Match Fidelity (PTSI)", fontsize=12, fontweight="bold")
        plt.xlim(0, 100)
        plt.gca().invert_yaxis()
        
        # Add values on bars
        for bar in bars:
            w = bar.get_width()
            plt.text(w + 1.0, bar.get_y() + bar.get_height()/2.0, f"{w:.1f}%", va="center", fontsize=9, fontweight="bold")
            
        plt.grid(axis="x", linestyle="--", alpha=0.6)
        plt.tight_layout()
        ptsi_path = os.path.join(self.figures_dir, "ptsi_similarity_ranking.png")
        plt.savefig(ptsi_path)
        plt.close()
        
        print("      Visualizations successfully saved to outputs/figures/")

    def save_matching_report(self) -> str:
        """Saves a JSON report detailing performance metrics and algorithmic evaluation."""
        report_path = os.path.join(self.output_dir, "analog_matching_report.json")
        report = {
            "project": "NASA Space Apps Challenge 2026 - Terrestrial Lunar Analog Discovery Engine",
            "planetary_bodies": ["Earth", "Moon"],
            "total_lunar_sites_evaluated": len(self.lunar_df) if self.lunar_df is not None else 0,
            "total_earth_candidates_evaluated": len(self.earth_df) if self.earth_df is not None else 0,
            "mean_topological_similarity_ptsi": float(np.mean([m["ptsi_score"] for m in self.matched_records])) * 100.0,
            "pca_explained_variance_pc1": float(self.matcher.pca.explained_variance_ratio_[0]),
            "pca_explained_variance_pc2": float(self.matcher.pca.explained_variance_ratio_[1]),
            "matched_analog_pairs": self.matched_records
        }
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"      Saved JSON report to: {report_path}")
        return report_path

    def run(self):
        """Executes full pipeline."""
        print("=" * 70)
        print("Kicking off Planetary Terrestrial-Lunar Analog Discovery Pipeline")
        print("=" * 70)
        self.process_lunar_sites()
        self.process_earth_analogs()
        self.run_matching()
        csv_file = self.generate_csv_deliverable()
        self.generate_visualizations()
        json_report = self.save_matching_report()
        print("=" * 70)
        print("Pipeline execution completed successfully.")
        print(f"Deliverable CSV: {csv_file}")
        print(f"Report JSON:     {json_report}")
        print("=" * 70)
