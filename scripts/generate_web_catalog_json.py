"""
Generate web_catalog.json directly from the master analogs dataset.
Enriches each entry with direct satellite tile URLs, badge metadata,
and target planetary options for the web team.
"""

import json
import pandas as pd

df = pd.read_csv("outputs/final_terrestrial_planetary_analogs_master.csv")

# Convert to clean web-ready JSON structure
sites = []
for _, row in df.iterrows():
    # Parse bbox
    bbox_str = row["Bounding_Box"].strip("[]")
    bbox = [float(x.strip()) for x in bbox_str.split(",")]
    
    site_obj = {
        "id": row["Candidate_ID"],
        "name": row["Region_Name"],
        "country": row["Country"],
        "category": row["Discovery_Category"],
        "is_new_discovery": "NEW CANDIDATE DISCOVERY" in row["Discovery_Category"],
        "is_egypt_discovery": "Egypt" in row["Discovery_Category"],
        "lat": float(row["Latitude"]),
        "lon": float(row["Longitude"]),
        "bbox": bbox,
        "matched_target": {
            "name": row["Matched_Planetary_Target"],
            "body": row["Target_Body"],
            "morphology_type": row["Target_Morphology_Type"]
        },
        "scores": {
            "total_match": float(row["Total_Match_Score_Pct"]),
            "slope_match": float(row["Slope_Match_Pct"]),
            "roughness_match": float(row["Roughness_Match_Pct"]),
            "relief_match": float(row["Relief_Match_Pct"]),
            "cave_match": float(row["Cave_Subsurface_Match_Pct"]),
            "solar_match": float(row["Solar_Exposure_Match_Pct"])
        },
        "topography": {
            "earth_mean_slope_deg": float(row["Earth_Mean_Slope_deg"]),
            "target_mean_slope_deg": float(row["Target_Mean_Slope_deg"]),
            "earth_rms_roughness_m": float(row["Earth_RMS_Roughness_m"]),
            "target_rms_roughness_m": float(row["Target_RMS_Roughness_m"]),
            "earth_local_relief_m": float(row["Earth_Local_Relief_m"]),
            "target_local_relief_m": float(row["Target_Local_Relief_m"]),
            "earth_elevation_m": float(row["Earth_Elevation_m"]),
            "pit_depth_m": float(row["Earth_Pit_Depth_m"]),
            "cavity_shielding_pct": float(row["Cavity_Shielding_Potential_Pct"]),
            "solar_exposure_proxy": float(row["Solar_Exposure_Proxy"])
        },
        "operational": {
            "trafficability_score": float(row["Rover_Trafficability_Score"]),
            "landing_safety_rating": row["Landing_Safety_Rating"],
            "subsurface_viability": row["Subsurface_Viability"],
            "geological_facies": row["Geological_Facies"],
            "lithology": row["Lithology_Bedrock"]
        },
        "scientific_justification": row["Scientific_Significance"],
        "environmental_caveats": row["Planetary_Environmental_Caveats"],
        "satellite_imagery": {
            "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
        }
    }
    sites.append(site_obj)

output_json = {
    "version": "1.0.0",
    "challenge": "NASA Space Apps Challenge 2026",
    "project": "Terrestrial-Lunar Topological Discovery Engine (TL-TDE)",
    "total_unique_sites": len(sites),
    "sites": sites
}

with open("outputs/web_catalog.json", "w", encoding="utf-8") as f:
    json.dump(output_json, f, indent=2, ensure_ascii=False)

print(f"Generated outputs/web_catalog.json with {len(sites)} rich candidate analog objects!")
