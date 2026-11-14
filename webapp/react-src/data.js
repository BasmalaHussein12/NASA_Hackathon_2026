/**
 * Pre-compiled, validated analog sites catalog for the Web Team.
 * Loaded synchronously to prevent CORS issues when opening index.html directly.
 * 100% computed from NASA LOLA (Moon) and SRTM (Earth) Elevation Data Models.
 */
export const CATALOG_DATA = {
  "version": "1.0.0",
  "challenge": "NASA Space Apps Challenge 2026",
  "project": "Terrestrial-Lunar Topological Discovery Engine (TL-TDE)",
  "total_unique_sites": 14,
  "planetary_targets": [
    {
      "id": "MOON_MTP",
      "name": "Mare Tranquillitatis Pit (MTP)",
      "body": "Moon",
      "type": "Subsurface Lava Tube / Pit Skylight",
      "lat": 8.33,
      "lon": 33.22,
      "mission_focus": "Confirmed subsurface cave conduit entrance for radiation-shielded habitat.",
      "slope_deg": 0.14,
      "relief_m": 67.1,
      "roughness_m": 7.3,
      "pit_depth_m": 21.4,
      "shielding_pct": 55.7,
      "solar_exp": 0.05
    },
    {
      "id": "MOON_MARIUS",
      "name": "Marius Hills Volcanic Dome & Skylight",
      "body": "Moon",
      "type": "Volcanic Dome Field & Lava Tube",
      "lat": 14.2,
      "lon": 303.2,
      "mission_focus": "Sinuous rille roof collapse skylight leading into intact lava tube.",
      "slope_deg": 0.74,
      "relief_m": 265.8,
      "roughness_m": 30.9,
      "pit_depth_m": 95.5,
      "shielding_pct": 65.1,
      "solar_exp": 0.06
    },
    {
      "id": "MOON_MOUTON",
      "name": "Mons Mouton Summit (Artemis III)",
      "body": "Moon",
      "type": "Elevated Flat Highland Plateau",
      "lat": -84.8,
      "lon": 31.7,
      "mission_focus": "Large flat summit plateau candidate for Artemis base camp infrastructure.",
      "slope_deg": 4.78,
      "relief_m": 1951.0,
      "roughness_m": 229.7,
      "pit_depth_m": 365.0,
      "shielding_pct": 66.8,
      "solar_exp": 0.07
    },
    {
      "id": "MOON_SHACKLETON",
      "name": "Peak Near Shackleton (Artemis III)",
      "body": "Moon",
      "type": "Crater Rim Peak of Eternal Light",
      "lat": -88.9,
      "lon": 124.5,
      "mission_focus": "Near-permanent solar power illumination adjacent to deep cryogenic cold traps.",
      "slope_deg": 8.47,
      "relief_m": 3074.2,
      "roughness_m": 511.7,
      "pit_depth_m": 988.5,
      "shielding_pct": 90.8,
      "solar_exp": 0.09
    },
    {
      "id": "MOON_CONNECTING",
      "name": "Connecting Ridge (Artemis III)",
      "body": "Moon",
      "type": "Polar Highland Ridge & Col",
      "lat": -89.4,
      "lon": 222.0,
      "mission_focus": "Strategic traverse corridor connecting Shackleton and de Gerlache crater rims.",
      "slope_deg": 11.66,
      "relief_m": 3704.3,
      "roughness_m": 635.2,
      "pit_depth_m": 819.0,
      "shielding_pct": 94.7,
      "solar_exp": 0.11
    },
    {
      "id": "MOON_MALAPERT",
      "name": "Malapert Massif (Artemis III)",
      "body": "Moon",
      "type": "High-Elevation Massif Ridge",
      "lat": -85.99,
      "lon": 357.07,
      "mission_focus": "Continuous direct line-of-sight communication to Earth and permanent sunlight.",
      "slope_deg": 12.67,
      "relief_m": 4973.8,
      "roughness_m": 1062.4,
      "pit_depth_m": 1154.2,
      "shielding_pct": 71.5,
      "solar_exp": 0.12
    },
    {
      "id": "MOON_FAUSTINI",
      "name": "Faustini Rim A (Artemis III)",
      "body": "Moon",
      "type": "Steep Highland Impact Crater Rim",
      "lat": -87.3,
      "lon": 77.0,
      "mission_focus": "High-altitude vantage point overlooking deep Faustini cryogenic cold traps.",
      "slope_deg": 8.13,
      "relief_m": 3501.1,
      "roughness_m": 656.7,
      "pit_depth_m": 827.6,
      "shielding_pct": 71.6,
      "solar_exp": 0.07
    },
    {
      "id": "MOON_NOBILE",
      "name": "Nobile Rim 1 (VIPER / Artemis)",
      "body": "Moon",
      "type": "Degraded Polar Impact Crater",
      "lat": -85.2,
      "lon": 37.8,
      "mission_focus": "Rolling degraded terrain with accessible volatile-bearing micro-cold traps.",
      "slope_deg": 13.1,
      "relief_m": 6319.7,
      "roughness_m": 982.9,
      "pit_depth_m": 1239.4,
      "shielding_pct": 68.5,
      "solar_exp": 0.04
    }
  ],
  "sites": [
    {
      "id": "EARTH_BENCHMARK_CA_01",
      "name": "Mistastin Lake Impact Crater (Kamestastin)",
      "country": "Canada (Labrador)",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": 55.883,
      "lon": -63.3,
      "bbox": [
        55.8558,
        -63.3481,
        55.91,
        -63.2517
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 81.9,
        "slope_match": 76.0,
        "roughness_match": 82.7,
        "relief_match": 96.4,
        "cave_match": 61.9,
        "solar_match": 98.8
      },
      "topography": {
        "earth_mean_slope_deg": 1.1,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 10.4,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 61.7,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 337.7,
        "pit_depth_m": 13.3,
        "cavity_shielding_pct": 46.1,
        "solar_exposure_proxy": 0.055
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Complex Impact Crater in Anorthositic Target",
        "lithology": "Anorthosite, granodiorite, impact melt sheet, suevite breccia"
      },
      "scientific_justification": "Earth's premier lunar highland analog. Formed directly in an anorthosite pluton identical to lunar ferroan anorthosite (FAN).",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_03",
      "name": "Western Bragança Coastal Plateau (Grid Block 3)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.875,
      "lon": -46.7917,
      "bbox": [
        -0.9167,
        -46.8333,
        -0.8333,
        -46.75
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 76.0,
        "slope_match": 63.3,
        "roughness_match": 80.5,
        "relief_match": 80.6,
        "cave_match": 72.3,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 1.74,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 4.9,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 40.8,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 6.7,
        "pit_depth_m": 19.0,
        "cavity_shielding_pct": 62.2,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_01",
      "name": "Western Bragança Coastal Plateau (Grid Block 1)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.875,
      "lon": -46.9583,
      "bbox": [
        -0.9167,
        -47.0,
        -0.8333,
        -46.9167
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 75.4,
        "slope_match": 58.3,
        "roughness_match": 85.6,
        "relief_match": 81.0,
        "cave_match": 69.4,
        "solar_match": 99.2
      },
      "topography": {
        "earth_mean_slope_deg": 2.03,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 5.5,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 41.3,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 8.1,
        "pit_depth_m": 13.1,
        "cavity_shielding_pct": 48.4,
        "solar_exposure_proxy": 0.054
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_BENCHMARK_AZ_01",
      "name": "Barringer Meteor Crater",
      "country": "United States (Arizona)",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": 35.027,
      "lon": -111.022,
      "bbox": [
        35.0042,
        -111.0494,
        35.0494,
        -110.9997
      ],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 75.0,
        "slope_match": 52.9,
        "roughness_match": 75.6,
        "relief_match": 84.2,
        "cave_match": 90.5,
        "solar_match": 97.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.97,
        "target_mean_slope_deg": 0.74,
        "earth_rms_roughness_m": 18.5,
        "target_rms_roughness_m": 30.9,
        "earth_local_relief_m": 179.0,
        "target_local_relief_m": 265.8,
        "earth_elevation_m": 1682.3,
        "pit_depth_m": 20.2,
        "cavity_shielding_pct": 67.1,
        "solar_exposure_proxy": 0.062
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Simple Bowl Impact Crater & Inverted Ejecta Flap",
        "lithology": "Shocked Coconino sandstone, Kaibab limestone, impact melt spherules"
      },
      "scientific_justification": "Benchmark simple impact morphometry on Earth (Gene Shoemaker Apollo training site). Replicates steep internal crater scarps of Shackleton and Faustini rims.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_EG_01",
      "name": "Bahariya Black Desert Volcanic Field (الصحراء السوداء)",
      "country": "Egypt (Giza / New Valley)",
      "category": "NEW CANDIDATE DISCOVERY (Egypt Western Desert)",
      "is_new_discovery": true,
      "is_egypt_discovery": true,
      "lat": 28.365,
      "lon": 28.845,
      "bbox": [
        28.3378,
        28.8144,
        28.3919,
        28.8758
      ],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 74.7,
        "slope_match": 57.9,
        "roughness_match": 90.6,
        "relief_match": 76.8,
        "cave_match": 62.5,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.65,
        "target_mean_slope_deg": 0.74,
        "earth_rms_roughness_m": 25.8,
        "target_rms_roughness_m": 30.9,
        "earth_local_relief_m": 144.6,
        "target_local_relief_m": 265.8,
        "earth_elevation_m": 127.9,
        "pit_depth_m": 15.3,
        "cavity_shielding_pct": 55.7,
        "solar_exposure_proxy": 0.055
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Conical Basalt Cinder Cones & Dolerite Apron",
        "lithology": "Doleritic basalt, ferruginous sandstone, volcanic tuff"
      },
      "scientific_justification": "Pristine hyper-arid volcanic cone field. Conical dolerite mounds rising from flat desert aprons replicate the Marius Hills volcanic dome field on the Moon and Cerberus Fossae cones on Mars.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_08",
      "name": "Western Bragança Coastal Plateau (Grid Block 8)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.9583,
      "lon": -46.7083,
      "bbox": [
        -1.0,
        -46.75,
        -0.9167,
        -46.6667
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 74.0,
        "slope_match": 56.1,
        "roughness_match": 84.0,
        "relief_match": 76.2,
        "cave_match": 73.3,
        "solar_match": 99.2
      },
      "topography": {
        "earth_mean_slope_deg": 2.16,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 5.3,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 35.9,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 8.5,
        "pit_depth_m": 13.7,
        "cavity_shielding_pct": 49.5,
        "solar_exposure_proxy": 0.054
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_05",
      "name": "Western Bragança Coastal Plateau (Grid Block 5)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.9583,
      "lon": -46.9583,
      "bbox": [
        -1.0,
        -47.0,
        -0.9167,
        -46.9167
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 73.4,
        "slope_match": 57.2,
        "roughness_match": 82.5,
        "relief_match": 75.6,
        "cave_match": 70.1,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.1,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 5.1,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 35.2,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 7.1,
        "pit_depth_m": 13.4,
        "cavity_shielding_pct": 48.6,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_02",
      "name": "Western Bragança Coastal Plateau (Grid Block 2)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.875,
      "lon": -46.875,
      "bbox": [
        -0.9167,
        -46.9167,
        -0.8333,
        -46.8333
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 73.2,
        "slope_match": 57.1,
        "roughness_match": 73.4,
        "relief_match": 79.1,
        "cave_match": 79.5,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.1,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 4.1,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 39.0,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 7.5,
        "pit_depth_m": 18.1,
        "cavity_shielding_pct": 60.3,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_04",
      "name": "Western Bragança Coastal Plateau (Grid Block 4)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.875,
      "lon": -46.7083,
      "bbox": [
        -0.9167,
        -46.75,
        -0.8333,
        -46.6667
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 73.1,
        "slope_match": 66.7,
        "roughness_match": 77.8,
        "relief_match": 74.9,
        "cave_match": 57.7,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 1.56,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 4.6,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 34.5,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 6.0,
        "pit_depth_m": 12.6,
        "cavity_shielding_pct": 44.7,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_EG_03",
      "name": "Djara Stalactite Subsurface Cave (كهف الجارة)",
      "country": "Egypt (Asyut Plateau)",
      "category": "NEW CANDIDATE DISCOVERY (Egypt Western Desert)",
      "is_new_discovery": true,
      "is_egypt_discovery": true,
      "lat": 27.38,
      "lon": 29.805,
      "bbox": [
        27.3572,
        29.7797,
        27.4025,
        29.8306
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 72.7,
        "slope_match": 55.7,
        "roughness_match": 91.6,
        "relief_match": 92.6,
        "cave_match": 30.9,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.19,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 6.2,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 80.0,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 166.6,
        "pit_depth_m": 42.0,
        "cavity_shielding_pct": 79.2,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "High Potential: Natural depression/cavity suitable for radiation & thermal sheltering",
        "geological_facies": "Subterranean Karst Cavity & Skylight Entrance",
        "lithology": "Eocene limestone, calcite speleothems, hyper-arid regolith"
      },
      "scientific_justification": "Natural subterranean cave entrance in a hyper-arid plateau. Replicates skylight collapse into subsurface conduits like Mare Tranquillitatis Pit for testing drone navigation and astronaut subterranean habitat deployment.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_07",
      "name": "Western Bragança Coastal Plateau (Grid Block 7)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.9583,
      "lon": -46.7917,
      "bbox": [
        -1.0,
        -46.8333,
        -0.9167,
        -46.75
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 72.5,
        "slope_match": 58.4,
        "roughness_match": 72.9,
        "relief_match": 77.6,
        "cave_match": 74.8,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 2.02,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 4.1,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 37.4,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 6.5,
        "pit_depth_m": 14.5,
        "cavity_shielding_pct": 49.9,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_BR_06",
      "name": "Western Bragança Coastal Plateau (Grid Block 6)",
      "country": "Brazil (Pará)",
      "category": "NEW CANDIDATE DISCOVERY (Direct EDM Scan)",
      "is_new_discovery": true,
      "is_egypt_discovery": false,
      "lat": -0.9583,
      "lon": -46.875,
      "bbox": [
        -1.0,
        -46.9167,
        -0.9167,
        -46.8333
      ],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 72.3,
        "slope_match": 59.9,
        "roughness_match": 69.4,
        "relief_match": 81.8,
        "cave_match": 70.8,
        "solar_match": 99.6
      },
      "topography": {
        "earth_mean_slope_deg": 1.93,
        "target_mean_slope_deg": 0.14,
        "earth_rms_roughness_m": 3.7,
        "target_rms_roughness_m": 7.3,
        "earth_local_relief_m": 42.2,
        "target_local_relief_m": 67.1,
        "earth_elevation_m": 4.9,
        "pit_depth_m": 13.9,
        "cavity_shielding_pct": 48.8,
        "solar_exposure_proxy": 0.053
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Low-Relief Alluvial / Sedimentary Plain",
        "lithology": "Quaternary alluvial sediments, lateritic crust, sandstone"
      },
      "scientific_justification": "Newly discovered planar terrain analog directly extracted from raw SRTM EDM. Exhibits ultra-low slope and stable bearing capacity matching lunar mare basins.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_DISCOVERY_EG_02",
      "name": "Gebel Qatrani Basalt Flows & Widan El-Faras (جبل قطراني)",
      "country": "Egypt (Faiyum Depression)",
      "category": "NEW CANDIDATE DISCOVERY (Egypt Faiyum)",
      "is_new_discovery": true,
      "is_egypt_discovery": true,
      "lat": 29.645,
      "lon": 30.59,
      "bbox": [
        29.6178,
        30.5589,
        29.6719,
        30.6214
      ],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 70.3,
        "slope_match": 38.4,
        "roughness_match": 73.0,
        "relief_match": 87.7,
        "cave_match": 90.9,
        "solar_match": 93.4
      },
      "topography": {
        "earth_mean_slope_deg": 4.09,
        "target_mean_slope_deg": 0.74,
        "earth_rms_roughness_m": 17.3,
        "target_rms_roughness_m": 30.9,
        "earth_local_relief_m": 196.4,
        "target_local_relief_m": 265.8,
        "earth_elevation_m": 254.2,
        "pit_depth_m": 15.7,
        "cavity_shielding_pct": 63.2,
        "solar_exposure_proxy": 0.039
      },
      "operational": {
        "trafficability_score": 85.0,
        "landing_safety_rating": "Category 2: Moderate Grade (Requires Precision Landing)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Continental Flood Basalt Sheet & Inverted Channels",
        "lithology": "Tholeiitic columnar basalt, silica-cemented sandstone"
      },
      "scientific_justification": "Extensive Oligocene columnar basalt flows with dry sinuous channels. Provides an un-vegetated basaltic pavement matching Mare Tranquillitatis and Apollo 11 mare basalts.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    },
    {
      "id": "EARTH_BENCHMARK_HI_01",
      "name": "Mauna Kea Volcanic Massif & Cinder Cones",
      "country": "United States (Hawaii)",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": 19.82,
      "lon": -155.468,
      "bbox": [
        19.7883,
        -155.5014,
        19.8514,
        -155.4344
      ],
      "matched_target": {
        "name": "Peak Near Shackleton (Artemis III)",
        "body": "Moon",
        "morphology_type": "Crater Rim Peak of Eternal Light"
      },
      "scores": {
        "total_match": 62.7,
        "slope_match": 55.6,
        "roughness_match": 49.4,
        "relief_match": 59.5,
        "cave_match": 83.5,
        "solar_match": 92.3
      },
      "topography": {
        "earth_mean_slope_deg": 10.52,
        "target_mean_slope_deg": 8.47,
        "earth_rms_roughness_m": 139.7,
        "target_rms_roughness_m": 511.7,
        "earth_local_relief_m": 928.8,
        "target_local_relief_m": 3074.2,
        "earth_elevation_m": 3783.6,
        "pit_depth_m": 34.5,
        "cavity_shielding_pct": 87.2,
        "solar_exposure_proxy": 0.074
      },
      "operational": {
        "trafficability_score": 50.0,
        "landing_safety_rating": "Category 3: Rugged Mountain / Highland Ridge (Hazardous)",
        "subsurface_viability": "High Potential: Natural depression/cavity suitable for radiation & thermal sheltering",
        "geological_facies": "High-Elevation Basaltic Shield Massif & Tephra Cones",
        "lithology": "Alkalic basalt, hawaiite, ankaramite, cinders"
      },
      "scientific_justification": "High-altitude extreme elevation massif with volcanic cinder cones. Historic Apollo astronaut training ground replicating Mons Mouton and Malapert Massif high-elevation summit plateaus.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on the Moon; surface experiences 1 atm air pressure vs hard vacuum. Direct vacuum & radiation shielding testing requires chamber simulation.",
      "satellite_imagery": {
        "esri_world_imagery": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "nasa_gibs_wms": "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
      }
    }
  ]
};
