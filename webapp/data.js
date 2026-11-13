/**
 * Pre-compiled, validated analog sites catalog for the Web Team.
 * Loaded synchronously to prevent CORS issues when opening index.html directly.
 */
const CATALOG_DATA = {
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
      "lat": 8.330, "lon": 33.220,
      "mission_focus": "Confirmed subsurface cave conduit entrance for radiation-shielded habitat.",
      "slope_deg": 0.17, "relief_m": 58.5, "roughness_m": 12.3, "pit_depth_m": 105.0,
      "shielding_pct": 95.0, "solar_exp": 0.52
    },
    {
      "id": "MOON_MARIUS",
      "name": "Marius Hills Volcanic Dome & Skylight",
      "body": "Moon",
      "type": "Volcanic Dome Field & Lava Tube",
      "lat": 14.200, "lon": 303.200,
      "mission_focus": "Sinuous rille roof collapse skylight leading into intact lava tube.",
      "slope_deg": 0.92, "relief_m": 259.0, "roughness_m": 51.9, "pit_depth_m": 45.0,
      "shielding_pct": 88.0, "solar_exp": 0.48
    },
    {
      "id": "MOON_CONNECTING",
      "name": "Connecting Ridge (Artemis III)",
      "body": "Moon",
      "type": "Polar Highland Ridge & Col",
      "lat": -89.400, "lon": 222.000,
      "mission_focus": "Strategic traverse corridor connecting Shackleton and de Gerlache crater rims.",
      "slope_deg": 11.66, "relief_m": 3704.0, "roughness_m": 635.2, "pit_depth_m": 0.0,
      "shielding_pct": 10.0, "solar_exp": 0.88
    },
    {
      "id": "MOON_SHACKLETON",
      "name": "Peak Near Shackleton (Artemis III)",
      "body": "Moon",
      "type": "Crater Rim Peak of Eternal Light",
      "lat": -88.900, "lon": 124.500,
      "mission_focus": "Near-permanent solar power illumination adjacent to deep cryogenic cold traps.",
      "slope_deg": 8.47, "relief_m": 3074.0, "roughness_m": 511.7, "pit_depth_m": 0.0,
      "shielding_pct": 12.0, "solar_exp": 0.92
    },
    {
      "id": "MOON_MOUTON",
      "name": "Mons Mouton Summit (Artemis III)",
      "body": "Moon",
      "type": "Elevated Flat Highland Plateau",
      "lat": -84.800, "lon": 31.700,
      "mission_focus": "Large flat summit plateau candidate for Artemis base camp infrastructure.",
      "slope_deg": 4.78, "relief_m": 1951.0, "roughness_m": 229.7, "pit_depth_m": 0.0,
      "shielding_pct": 15.0, "solar_exp": 0.75
    },
    {
      "id": "MARS_JEZERO",
      "name": "Jezero Crater Delta & Rim",
      "body": "Mars",
      "type": "Ancient Lacustrine Fan & Crater Scarp",
      "lat": 18.380, "lon": 77.580,
      "mission_focus": "Perseverance rover biosignature sampling and delta traverse.",
      "slope_deg": 5.40, "relief_m": 820.0, "roughness_m": 145.0, "pit_depth_m": 15.0,
      "shielding_pct": 40.0, "solar_exp": 0.60
    }
  ],
  "sites": [
    {
      "id": "EARTH_DISCOVERY_EG_03",
      "name": "Djara Stalactite Subsurface Cave (كهف الجارة)",
      "country": "Egypt (Asyut Plateau)",
      "category": "NEW CANDIDATE DISCOVERY (Egypt Western Desert)",
      "is_new_discovery": true,
      "is_egypt_discovery": true,
      "lat": 27.38,
      "lon": 29.805,
      "bbox": [27.35, 29.78, 27.42, 29.85],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 77.3,
        "slope_match": 61.9,
        "roughness_match": 81.3,
        "relief_match": 89.8,
        "cave_match": 95.1,
        "solar_match": 61.9
      },
      "topography": {
        "earth_mean_slope_deg": 1.85,
        "target_mean_slope_deg": 0.17,
        "earth_rms_roughness_m": 18.0,
        "target_rms_roughness_m": 12.3,
        "earth_local_relief_m": 75.0,
        "target_local_relief_m": 58.5,
        "earth_elevation_m": 285.0,
        "pit_depth_m": 48.0,
        "cavity_shielding_pct": 94.0,
        "solar_exposure_proxy": 0.4
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "High Potential: Natural depression/cavity suitable for radiation & thermal sheltering",
        "geological_facies": "Subterranean Karst Cavity & Skylight Entrance",
        "lithology": "Eocene limestone, calcite speleothems, hyper-arid regolith"
      },
      "scientific_justification": "Natural subterranean cave entrance in a hyper-arid plateau. Replicates skylight collapse into subsurface conduits like Mare Tranquillitatis Pit for testing drone navigation and astronaut subterranean habitat deployment.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
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
      "bbox": [28.25, 28.75, 28.48, 28.95],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 73.1,
        "slope_match": 43.3,
        "roughness_match": 95.8,
        "relief_match": 96.7,
        "cave_match": 74.1,
        "solar_match": 57.1
      },
      "topography": {
        "earth_mean_slope_deg": 3.85,
        "target_mean_slope_deg": 0.92,
        "earth_rms_roughness_m": 48.0,
        "target_rms_roughness_m": 51.9,
        "earth_local_relief_m": 240.0,
        "target_local_relief_m": 259.0,
        "earth_elevation_m": 210.0,
        "pit_depth_m": 35.0,
        "cavity_shielding_pct": 82.0,
        "solar_exposure_proxy": 0.62
      },
      "operational": {
        "trafficability_score": 85.0,
        "landing_safety_rating": "Category 2: Moderate Grade (Requires Precision Landing)",
        "subsurface_viability": "High Potential: Natural depression/cavity suitable for radiation & thermal sheltering",
        "geological_facies": "Conical Basalt Cinder Cones & Dolerite Apron",
        "lithology": "Doleritic basalt, ferruginous sandstone, volcanic tuff"
      },
      "scientific_justification": "Pristine hyper-arid volcanic cone field. Conical dolerite mounds rising from flat desert aprons replicate the Marius Hills volcanic dome field on the Moon and Cerberus Fossae cones on Mars.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
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
      "bbox": [29.58, 30.48, 29.72, 30.7],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 68.0,
        "slope_match": 71.4,
        "roughness_match": 71.5,
        "relief_match": 72.9,
        "cave_match": 49.7,
        "solar_match": 67.0
      },
      "topography": {
        "earth_mean_slope_deg": 2.1,
        "target_mean_slope_deg": 0.92,
        "earth_rms_roughness_m": 28.0,
        "target_rms_roughness_m": 51.9,
        "earth_local_relief_m": 125.0,
        "target_local_relief_m": 259.0,
        "earth_elevation_m": 340.0,
        "pit_depth_m": 22.0,
        "cavity_shielding_pct": 74.0,
        "solar_exposure_proxy": 0.58
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Continental Flood Basalt Sheet & Inverted Channels",
        "lithology": "Tholeiitic columnar basalt, silica-cemented sandstone"
      },
      "scientific_justification": "Extensive Oligocene columnar basalt flows with dry sinuous channels. Provides an un-vegetated basaltic pavement matching Mare Tranquillitatis and Apollo 11 mare basalts.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
    },
    {
      "id": "EARTH_BENCHMARK_IS_01",
      "name": "Holuhraun Basalt Flood Plain",
      "country": "Iceland",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": 64.85,
      "lon": -16.83,
      "bbox": [64.8, -16.92, 64.92, -16.72],
      "matched_target": {
        "name": "Marius Hills Volcanic Dome & Skylight",
        "body": "Moon",
        "morphology_type": "Volcanic Dome Field & Lava Tube"
      },
      "scores": {
        "total_match": 77.2,
        "slope_match": 92.3,
        "roughness_match": 79.5,
        "relief_match": 76.6,
        "cave_match": 44.9,
        "solar_match": 75.6
      },
      "topography": {
        "earth_mean_slope_deg": 1.2,
        "target_mean_slope_deg": 0.92,
        "earth_rms_roughness_m": 34.0,
        "target_rms_roughness_m": 51.9,
        "earth_local_relief_m": 140.0,
        "target_local_relief_m": 259.0,
        "earth_elevation_m": 720.0,
        "pit_depth_m": 18.0,
        "cavity_shielding_pct": 72.0,
        "solar_exposure_proxy": 0.55
      },
      "operational": {
        "trafficability_score": 100.0,
        "landing_safety_rating": "Category 1: Prime Flat Landing Zone (Safe)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Pristine Flood Basalt Lava Sheet",
        "lithology": "Tholeiitic basalt, vesicle crusts, collapse pits"
      },
      "scientific_justification": "Un-vegetated flood basalt sheet matching lunar mare basalt plain radar texture and lander stability.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
    },
    {
      "id": "EARTH_BENCHMARK_AQ_01",
      "name": "Asgard Range, McMurdo Dry Valleys",
      "country": "Antarctica",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": -77.75,
      "lon": 161.5,
      "bbox": [-77.85, 161.2, -77.65, 161.8],
      "matched_target": {
        "name": "Connecting Ridge (Artemis III)",
        "body": "Moon",
        "morphology_type": "Polar Highland Ridge & Col"
      },
      "scores": {
        "total_match": 75.3,
        "slope_match": 49.8,
        "roughness_match": 72.5,
        "relief_match": 92.1,
        "cave_match": 100.0,
        "solar_match": 88.7
      },
      "topography": {
        "earth_mean_slope_deg": 14.1,
        "target_mean_slope_deg": 11.66,
        "earth_rms_roughness_m": 1150.0,
        "target_rms_roughness_m": 635.2,
        "earth_local_relief_m": 4480.0,
        "target_local_relief_m": 3704.0,
        "earth_elevation_m": 1620.0,
        "pit_depth_m": 0.0,
        "cavity_shielding_pct": 10.0,
        "solar_exposure_proxy": 0.85
      },
      "operational": {
        "trafficability_score": 50.0,
        "landing_safety_rating": "Category 3: Rugged Mountain / Highland Ridge (Hazardous)",
        "subsurface_viability": "Low Potential: Open elevated ridge or surface plain without subterranean shielding",
        "geological_facies": "Hyper-arid Periglacial Massif & Col",
        "lithology": "Ferrar dolerite sills, Beacon sandstone, cryogenic permafrost"
      },
      "scientific_justification": "Liquid water-free cryogenic massif replicating the extreme 5km relief and thermal conditions of Malapert Massif.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
    },
    {
      "id": "EARTH_BENCHMARK_CA_01",
      "name": "Mistastin Lake Impact Crater (Kamestastin)",
      "country": "Canada (Labrador)",
      "category": "GLOBAL GEOLOGICAL BENCHMARK",
      "is_new_discovery": false,
      "is_egypt_discovery": false,
      "lat": 55.883,
      "lon": -63.3,
      "bbox": [55.8, -63.45, 55.97, -63.15],
      "matched_target": {
        "name": "Connecting Ridge (Artemis III)",
        "body": "Moon",
        "morphology_type": "Polar Highland Ridge & Col"
      },
      "scores": {
        "total_match": 74.5,
        "slope_match": 87.7,
        "roughness_match": 96.4,
        "relief_match": 89.2,
        "cave_match": 6.4,
        "solar_match": 52.7
      },
      "topography": {
        "earth_mean_slope_deg": 11.2,
        "target_mean_slope_deg": 11.66,
        "earth_rms_roughness_m": 680.0,
        "target_rms_roughness_m": 635.2,
        "earth_local_relief_m": 2850.0,
        "target_local_relief_m": 3704.0,
        "earth_elevation_m": 420.0,
        "pit_depth_m": 120.0,
        "cavity_shielding_pct": 65.0,
        "solar_exposure_proxy": 0.72
      },
      "operational": {
        "trafficability_score": 50.0,
        "landing_safety_rating": "Category 3: Rugged Mountain / Highland Ridge (Hazardous)",
        "subsurface_viability": "Moderate Potential: Depressed relief with partial rim overhang",
        "geological_facies": "Complex Anorthosite Impact Crater",
        "lithology": "Anorthosite, impact melt sheet, suevite breccia"
      },
      "scientific_justification": "Earth's premier lunar highland analog. Formed directly in an anorthosite pluton identical to lunar ferroan anorthosite.",
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
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
      "bbox": [-0.9167, -46.8333, -0.8333, -46.75],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 57.2,
        "slope_match": 60.6,
        "roughness_match": 61.3,
        "relief_match": 87.5,
        "cave_match": 30.7,
        "solar_match": 15.5
      },
      "topography": {
        "earth_mean_slope_deg": 1.92,
        "target_mean_slope_deg": 0.17,
        "earth_rms_roughness_m": 5.0,
        "target_rms_roughness_m": 12.3,
        "earth_local_relief_m": 43.0,
        "target_local_relief_m": 58.5,
        "earth_elevation_m": 6.7,
        "pit_depth_m": 20.4,
        "cavity_shielding_pct": 71.4,
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
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
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
      "bbox": [-0.9167, -47.0, -0.8333, -46.9167],
      "matched_target": {
        "name": "Mare Tranquillitatis Pit (MTP)",
        "body": "Moon",
        "morphology_type": "Subsurface Lava Tube / Pit Skylight"
      },
      "scores": {
        "total_match": 55.1,
        "slope_match": 55.6,
        "roughness_match": 65.1,
        "relief_match": 89.2,
        "cave_match": 18.0,
        "solar_match": 15.5
      },
      "topography": {
        "earth_mean_slope_deg": 2.22,
        "target_mean_slope_deg": 0.17,
        "earth_rms_roughness_m": 5.6,
        "target_rms_roughness_m": 12.3,
        "earth_local_relief_m": 45.0,
        "target_local_relief_m": 58.5,
        "earth_elevation_m": 8.1,
        "pit_depth_m": 16.3,
        "cavity_shielding_pct": 60.7,
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
      "environmental_caveats": "Gravity is 1.0g on Earth vs 0.166g on target body; surface experiences 1 atm air pressure vs vacuum. Radiation shielding requires lab simulation."
    }
  ]
};
