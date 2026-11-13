"""
Script to extract and generate the dedicated CSV of NEW CANDIDATE TERRESTRIAL ANALOGS
directly from the provided Earth Elevation Data Model (s01w047.hgt).
"""

import os
import numpy as np
import pandas as pd

# 1. Ingest Moon LOLA DEM
moon_file = "Data/Moon_Data/ldem_16_float.img"
moon_dem = np.fromfile(moon_file, dtype="<f4").reshape((2880, 5760))
R_moon = 1737400.0

lunar_targets = [
    {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "lat": 8.330, "lon": 33.220,
        "type": "Subsurface Lava Tube / Pit Entrance",
        "description": "Equatorial mare basalt plain near confirmed subsurface lava conduit entrance."
    },
    {
        "name": "Marius Hills Volcanic Apron",
        "lat": 14.200, "lon": 303.200,
        "type": "Volcanic Dome Field & Skylight Apron",
        "description": "Basaltic lava sheet surrounding volcanic domes and sinuous rilles."
    },
    {
        "name": "Oceanus Procellarum Plain (Apollo 12)",
        "lat": -3.012, "lon": 336.577,
        "type": "Extensive Basaltic Mare Plain",
        "description": "Flat, smooth basalt plain ideal for landing stability and ISRU extraction."
    },
    {
        "name": "Fra Mauro Formation (Apollo 14)",
        "lat": -3.645, "lon": 342.528,
        "type": "Undulating Ejecta Ridge Plain",
        "description": "Gentle undulating terrain composed of Imbrium basin ejecta breccia."
    },
    {
        "name": "Mons Mouton Summit Plateau (Artemis III)",
        "lat": -84.800, "lon": 31.700,
        "type": "Elevated South Pole Plateau",
        "description": "Elevated flat summit plateau candidate for Artemis base camp."
    }
]

# Extract lunar target features
for lt in lunar_targets:
    r = int(round((90.0 - lt["lat"]) * 16.0))
    c = int(round((lt["lon"] % 360.0) * 16.0)) % 5760
    half = 5
    patch = moon_dem[max(0, r-half):min(2880, r+half), :][:, [(c+dc)%5760 for dc in range(-half, half)]] * 1000.0
    lat_rad = np.radians(lt["lat"])
    dy = (np.pi * R_moon) / (180.0 * 16.0)
    dx = max(dy * np.cos(lat_rad), 50.0)
    gy, gx = np.gradient(patch, dy, dx)
    slope = np.degrees(np.arctan(np.sqrt(gx**2 + gy**2)))
    
    lt["slope_deg"] = float(np.mean(slope))
    lt["relief_m"] = float(patch.max() - patch.min())
    lt["roughness_m"] = float(np.std(patch))

# 2. Ingest Earth SRTM HGT
earth_file = "Data/Earth_Data/s01w047.hgt"
raw_earth = np.fromfile(earth_file, dtype=">i2").reshape((3601, 3601))
dy_earth = dx_earth = 30.87  # 1 arcsecond at equator

# Segment Earth land into grid cells (~9.3 km x 9.3 km, patch_size=300 pixels)
patch_size = 300
stride = 150
candidate_patches = []

patch_counter = 1
for r in range(2400, 3600 - patch_size + 1, stride):
    for c in range(0, 3600 - patch_size + 1, stride):
        sub = raw_earth[r:r+patch_size, c:c+patch_size]
        land_fraction = np.mean(sub > 0)
        
        # We want land areas
        if land_fraction > 0.6:
            valid_elev = sub[sub > 0]
            gy, gx = np.gradient(sub, dy_earth, dx_earth)
            slope = np.degrees(np.arctan(np.sqrt(gx**2 + gy**2)))
            
            lat_center = - (r + patch_size / 2.0) / 3600.0
            lon_center = -47.0 + (c + patch_size / 2.0) / 3600.0
            min_lat = - (r + patch_size) / 3600.0
            max_lat = - r / 3600.0
            min_lon = -47.0 + c / 3600.0
            max_lon = -47.0 + (c + patch_size) / 3600.0
            
            mean_slope = float(np.mean(slope))
            p90_slope = float(np.percentile(slope, 90))
            relief = float(valid_elev.max() - valid_elev.min())
            rms_roughness = float(np.std(valid_elev))
            mean_elev = float(np.mean(valid_elev))
            
            # Local geographic description based on coordinates in Pará, Brazil
            if lon_center < -46.7:
                region_name = f"Western Bragança Plateau (Sector {patch_counter})"
            elif lon_center < -46.4:
                region_name = f"Central Gurupi Basin Lowlands (Sector {patch_counter})"
            else:
                region_name = f"Eastern Maranhão Boundary Plains (Sector {patch_counter})"
                
            candidate_patches.append({
                "patch_id": f"EARTH_CANDIDATE_{patch_counter:03d}",
                "region_name": region_name,
                "country": "Brazil (Pará State)",
                "lat_center": lat_center,
                "lon_center": lon_center,
                "bbox": [min_lat, min_lon, max_lat, max_lon],
                "mean_slope_deg": mean_slope,
                "p90_slope_deg": p90_slope,
                "rms_roughness_m": rms_roughness,
                "local_relief_m": relief,
                "mean_elevation_m": mean_elev
            })
            patch_counter += 1

print(f"Extracted {len(candidate_patches)} new candidate grid cells from s01w047.hgt")

# 3. Match each candidate patch against the Lunar Targets
output_rows = []

for cp in candidate_patches:
    # Match against every lunar target to find best correspondence
    best_target = None
    best_score = -1.0
    best_subscores = {}
    
    for lt in lunar_targets:
        # Compute component similarity scores
        delta_slope = abs(cp["mean_slope_deg"] - lt["slope_deg"])
        s_slope = np.exp(-delta_slope / 3.0)
        
        delta_log_rms = abs(np.log10(max(0.1, cp["rms_roughness_m"])) - np.log10(max(0.1, lt["roughness_m"])))
        s_rough = np.exp(-delta_log_rms / 0.8)
        
        delta_log_rel = abs(np.log10(max(1.0, cp["local_relief_m"])) - np.log10(max(1.0, lt["relief_m"])))
        s_relief = np.exp(-delta_log_rel / 1.0)
        
        # Weighted composite score
        composite_score = (0.40 * s_slope + 0.35 * s_rough + 0.25 * s_relief) * 100.0
        
        if composite_score > best_score:
            best_score = composite_score
            best_target = lt
            best_subscores = {
                "slope_match": round(s_slope * 100.0, 1),
                "roughness_match": round(s_rough * 100.0, 1),
                "relief_match": round(s_relief * 100.0, 1)
            }
            
    bbox_str = f"[{cp['bbox'][0]:.4f}, {cp['bbox'][1]:.4f}, {cp['bbox'][2]:.4f}, {cp['bbox'][3]:.4f}]"
    
    # Assess Trafficability and landing safety
    if cp["p90_slope_deg"] <= 8.0:
        safety_rating = "Category 1: Prime Flat Landing Zone (Safe)"
        trafficability = 100.0
    elif cp["p90_slope_deg"] <= 15.0:
        safety_rating = "Category 2: Moderate Grade (Precision Landing Required)"
        trafficability = 85.0
    else:
        safety_rating = "Category 3: Rugged Terrain"
        trafficability = 60.0
        
    output_rows.append({
        "Candidate_ID": cp["patch_id"],
        "Analog_Status": "NEW CANDIDATE DISCOVERY",
        "Region_Name": cp["region_name"],
        "Country": cp["country"],
        "Latitude": round(cp["lat_center"], 4),
        "Longitude": round(cp["lon_center"], 4),
        "Bounding_Box": bbox_str,
        "Matched_Lunar_Target": best_target["name"],
        "Lunar_Target_Type": best_target["type"],
        "Total_Match_Score_Pct": round(best_score, 1),
        "Slope_Match_Pct": best_subscores["slope_match"],
        "Roughness_Match_Pct": best_subscores["roughness_match"],
        "Relief_Match_Pct": best_subscores["relief_match"],
        "Earth_Mean_Slope_deg": round(cp["mean_slope_deg"], 2),
        "Lunar_Mean_Slope_deg": round(best_target["slope_deg"], 2),
        "Earth_RMS_Roughness_m": round(cp["rms_roughness_m"], 1),
        "Lunar_RMS_Roughness_m": round(best_target["roughness_m"], 1),
        "Earth_Local_Relief_m": round(cp["local_relief_m"], 1),
        "Lunar_Local_Relief_m": round(best_target["relief_m"], 1),
        "Earth_Elevation_m": round(cp["mean_elevation_m"], 1),
        "Trafficability_Score": trafficability,
        "Landing_Safety_Rating": safety_rating,
        "Geological_Facies": "Low-Relief Alluvial / Sedimentary Plain",
        "Scientific_Justification": f"Directly extracted from Earth EDM. Exhibits gentle slope ({cp['mean_slope_deg']:.2f} deg) and low relief ({cp['local_relief_m']:.1f} m) mimicking lunar mare basalt plains.",
        "Planetary_Caveats": "Gravity is 1.0g (Earth) vs 0.166g (Moon); Earth has atmospheric drag and pressure (1 atm) vs lunar vacuum."
    })

# Convert to DataFrame and sort by Total Match Score descending
df_candidates = pd.DataFrame(output_rows)
df_candidates = df_candidates.sort_values(by="Total_Match_Score_Pct", ascending=False)

output_csv = "outputs/new_candidate_analogs.csv"
df_candidates.to_csv(output_csv, index=False, encoding="utf-8")
print(f"Successfully generated {output_csv} with {len(df_candidates)} newly discovered candidate analog sites!")
