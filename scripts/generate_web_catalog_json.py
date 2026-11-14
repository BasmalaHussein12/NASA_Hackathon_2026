"""
Generate web_catalog.json directly from the master analogs dataset.
Enriches each entry with direct satellite tile URLs, badge metadata,
and target planetary options for the web team.
Synchronizes outputs/web_catalog.json, webapp/data.js, and webapp/react-src/data.js.
"""

import os
import sys
import json
import pandas as pd

# Add repo root to path
sys.path.insert(0, os.path.abspath("."))

from src.preprocessing import LunarDEMIngestor
from src.features import extract_topological_feature_vector

df = pd.read_csv("outputs/final_terrestrial_planetary_analogs_master.csv")

# 1. Ingest Lunar targets dynamically from LOLA DEM
lunar_ingestor = LunarDEMIngestor("Data/Moon_Data/ldem_16_float.img")
lunar_ingestor.load()

LUNAR_TARGET_DEFS = [
    {
        "id": "MOON_MTP",
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "lat": 8.330, "lon": 33.220, "radius_km": 10.0,
        "type": "Subsurface Lava Tube / Pit Skylight",
        "mission_focus": "Confirmed subsurface cave conduit entrance for radiation-shielded habitat."
    },
    {
        "id": "MOON_MARIUS",
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "lat": 14.200, "lon": 303.200, "radius_km": 10.0,
        "type": "Volcanic Dome Field & Lava Tube",
        "mission_focus": "Sinuous rille roof collapse skylight leading into intact lava tube."
    },
    {
        "id": "MOON_MOUTON",
        "name": "Mons Mouton Summit (Artemis III)",
        "body": "Moon",
        "lat": -84.800, "lon": 31.700, "radius_km": 15.0,
        "type": "Elevated Flat Highland Plateau",
        "mission_focus": "Large flat summit plateau candidate for Artemis base camp infrastructure."
    },
    {
        "id": "MOON_SHACKLETON",
        "name": "Peak Near Shackleton (Artemis III)",
        "body": "Moon",
        "lat": -88.900, "lon": 124.500, "radius_km": 15.0,
        "type": "Crater Rim Peak of Eternal Light",
        "mission_focus": "Near-permanent solar power illumination adjacent to deep cryogenic cold traps."
    },
    {
        "id": "MOON_CONNECTING",
        "name": "Connecting Ridge (Artemis III)",
        "body": "Moon",
        "lat": -89.400, "lon": 222.000, "radius_km": 15.0,
        "type": "Polar Highland Ridge & Col",
        "mission_focus": "Strategic traverse corridor connecting Shackleton and de Gerlache crater rims."
    },
    {
        "id": "MOON_MALAPERT",
        "name": "Malapert Massif (Artemis III)",
        "body": "Moon",
        "lat": -85.990, "lon": 357.070, "radius_km": 15.0,
        "type": "High-Elevation Massif Ridge",
        "mission_focus": "Continuous direct line-of-sight communication to Earth and permanent sunlight."
    },
    {
        "id": "MOON_FAUSTINI",
        "name": "Faustini Rim A (Artemis III)",
        "body": "Moon",
        "lat": -87.300, "lon": 77.000, "radius_km": 15.0,
        "type": "Steep Highland Impact Crater Rim",
        "mission_focus": "High-altitude vantage point overlooking deep Faustini cryogenic cold traps."
    },
    {
        "id": "MOON_NOBILE",
        "name": "Nobile Rim 1 (VIPER / Artemis)",
        "body": "Moon",
        "lat": -85.200, "lon": 37.800, "radius_km": 15.0,
        "type": "Degraded Polar Impact Crater",
        "mission_focus": "Rolling degraded terrain with accessible volatile-bearing micro-cold traps."
    }
]

planetary_targets = []
for target in LUNAR_TARGET_DEFS:
    p = lunar_ingestor.extract_patch(target["lat"], target["lon"], radius_km=target["radius_km"])
    feat = extract_topological_feature_vector(p["patch"], p["dy_meters"], p["dx_meters"])
    planetary_targets.append({
        "id": target["id"],
        "name": target["name"],
        "body": target["body"],
        "type": target["type"],
        "lat": target["lat"],
        "lon": target["lon"],
        "mission_focus": target["mission_focus"],
        "slope_deg": round(feat["mean_slope_deg"], 2),
        "relief_m": round(feat["local_relief_m"], 1),
        "roughness_m": round(feat["rms_roughness_m"], 1),
        "pit_depth_m": round(feat["pit_depth_m"], 1),
        "shielding_pct": round(feat["cavity_shielding_potential_pct"], 1),
        "solar_exp": round(feat["solar_exposure_proxy"], 2)
    })

# 2. Convert to clean web-ready JSON structure
sites = []
for _, row in df.iterrows():
    # Parse bbox
    bbox_str = str(row["Bounding_Box"]).strip("[]")
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
    "planetary_targets": planetary_targets,
    "sites": sites
}

# 1. Write outputs/web_catalog.json
with open("outputs/web_catalog.json", "w", encoding="utf-8") as f:
    json.dump(output_json, f, indent=2, ensure_ascii=False)
print(f"Generated outputs/web_catalog.json with {len(sites)} rich candidate analog objects!")

# 2. Write webapp/data.js
json_formatted = json.dumps(output_json, indent=2, ensure_ascii=False)
webapp_data_js = f"""/**
 * Pre-compiled, validated analog sites catalog for the Web Team.
 * Loaded synchronously to prevent CORS issues when opening index.html directly.
 * 100% computed from NASA LOLA (Moon) and SRTM (Earth) Elevation Data Models.
 */
const CATALOG_DATA = {json_formatted};

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = CATALOG_DATA;
}}
"""

with open("webapp/data.js", "w", encoding="utf-8") as f:
    f.write(webapp_data_js)
print("Updated webapp/data.js with fresh 100% DEM-derived catalog data!")

# 3. Write webapp/react-src/data.js
react_data_js = f"""/**
 * Pre-compiled, validated analog sites catalog for the Web Team.
 * Loaded synchronously to prevent CORS issues when opening index.html directly.
 * 100% computed from NASA LOLA (Moon) and SRTM (Earth) Elevation Data Models.
 */
export const CATALOG_DATA = {json_formatted};
"""

with open("webapp/react-src/data.js", "w", encoding="utf-8") as f:
    f.write(react_data_js)
print("Updated webapp/react-src/data.js with fresh 100% DEM-derived catalog data!")

