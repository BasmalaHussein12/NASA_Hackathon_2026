# 📖 Data Dictionary & Dataset Specifications
## NASA Space Apps Challenge 2026 — Terrestrial-Lunar Topological Discovery Engine (TL-TDE)

This document provides complete technical specifications for the raw planetary Elevation Data Models (EDMs) ingested by the pipeline and a comprehensive, field-by-field dictionary for the primary output deliverable: [`outputs/terrestrial_lunar_analogs.csv`](outputs/terrestrial_lunar_analogs.csv).

---

## 1. Raw Input Datasets

### 1.1 Earth Elevation Dataset (`Data/Earth_Data/s01w047.hgt`)

| Property | Value | Description |
| :--- | :--- | :--- |
| **Data Product** | SRTMGL1 (Shuttle Radar Topography Mission Global 1-arc-second) | Global terrestrial digital elevation model |
| **File Format** | Raw binary raster (`.hgt`) | Fixed-grid elevation array |
| **Data Type** | `>i2` (Signed 16-bit integer, Big-Endian) | Elevation stored in integer meters above WGS84 EGM96 geoid |
| **Grid Dimensions** | 3,601 rows $\times$ 3,601 columns | Exactly 12,967,201 pixels ($3601 \times 3601 \times 2 = 25,934,402$ bytes) |
| **Spatial Resolution** | 1 arc-second ($\approx 30.87\text{ m}$ at equator) | High-resolution terrestrial elevation grid |
| **Spatial Bounds** | Lat: $[-1.0^\circ, 0.0^\circ]$, Lon: $[-47.0^\circ, -46.0^\circ]$ | Covers the coastal plain of Pará, Northern Brazil |
| **Void / No-Data Value**| `-32768` | Represented as values $\le -500\text{ m}$ in coastal landmasks |
| **Companion Files** | `s01w047.num` (coverage count), `s01w047.swb` (water body vector/raster mask) | Auxiliary quality assessment files |

---

### 1.2 Lunar Elevation Dataset (`Data/Moon_Data/ldem_16_float.img`)

| Property | Value | Description |
| :--- | :--- | :--- |
| **Data Product** | LRO LOLA GDR (Lunar Orbiter Laser Altimeter Gridded Data Record) | Global cylindrical digital elevation model |
| **File Format** | NASA PDS (Planetary Data System) Image (`.img`) | Raw binary floating-point raster |
| **Data Type** | `<f4` (32-bit floating point, Little-Endian) | High-precision elevation values |
| **Grid Dimensions** | 2,880 rows $\times$ 5,760 columns | Exactly 16,588,800 pixels ($16,588,800 \times 4 = 66,355,200$ bytes) |
| **Angular Resolution**| 16 pixels per degree (ppd) | $\approx 1.895\text{ km/pixel}$ at equator |
| **Latitude Range** | $+90.0^\circ\text{ N}$ (Row 0) to $-90.0^\circ\text{ S}$ (Row 2879) | Complete global polar-to-polar lunar coverage |
| **Longitude Range** | $0.0^\circ\text{ E}$ (Col 0) to $360.0^\circ\text{ E}$ (Col 5759) | Standard lunar coordinate system |
| **Elevation Units** | Kilometers ($\text{km}$) | Measured relative to reference lunar sphere radius $R = 1,737.4\text{ km}$ |
| **Pipeline Transform**| Multiplied by $1000.0$ to convert to SI meters | Harmonizes lunar elevation with terrestrial meter units |

---

## 2. Deliverable Data Dictionary: `terrestrial_lunar_analogs.csv`

The deliverable catalog [`outputs/terrestrial_lunar_analogs.csv`](outputs/terrestrial_lunar_analogs.csv) contains 24 structured fields characterizing the topological correspondence, geomorphometry, and scientific viability of each identified planetary analog pair.

### Field Definitions

| Column Name | Data Type | Units | Range / Format | Description & Physical Significance |
| :--- | :---: | :---: | :---: | :--- |
| **`Lunar_Base_Site`** | `String` | N/A | Text | Official name of candidate permanent Moon base location (e.g., Artemis III landing region or equatorial lava tube node). |
| **`Lunar_Latitude`** | `Float` | Decimal Degrees | $[-90.0, +90.0]$ | Center latitude of lunar target region. Negative values denote Southern Hemisphere. |
| **`Lunar_Longitude`** | `Float` | Decimal Degrees | $[0.0, 360.0]$ | Center longitude of lunar target region (East positive). |
| **`Earth_Analog_Site`** | `String` | N/A | Text | Official geographical or geological name of the matched terrestrial analog feature on Earth. |
| **`Earth_Country`** | `String` | N/A | Text | Sovereign nation or territory where the terrestrial analog is located. |
| **`Earth_Latitude`** | `Float` | Decimal Degrees | $[-90.0, +90.0]$ | Precise center latitude of matched terrestrial analog footprint. |
| **`Earth_Longitude`** | `Float` | Decimal Degrees | $[-180.0, +180.0]$ | Precise center longitude of matched terrestrial analog footprint. |
| **`Earth_Bounding_Box`** | `String` | Degrees | `[S_lat, W_lon, N_lat, E_lon]` | Four-point geographical bounding box defining the operational testing perimeter on Earth. |
| **`PTSI_Similarity_Score`**| `Float` | Percentage ($\%$) | $[0.0, 100.0]$ | **Planetary Topological Similarity Index.** Multi-objective composite score evaluating slope, roughness, relief, VRM, and hazard compatibility. |
| **`Cosine_Similarity`** | `Float` | Dimensionless | $[-1.0, +1.0]$ | Directional similarity of scaled 8D geomorphological feature vectors in normalized topological space. Values $> 0.90$ indicate near-identical morphometric proportions. |
| **`Mahalanobis_Distance`**| `Float` | Dimensionless | $[0.0, \infty)$ | Covariance-weighted statistical distance accounting for correlations between slope, roughness, and relief. Smaller values indicate closer alignment. |
| **`Earth_Mean_Slope_deg`**| `Float` | Degrees ($^\circ$) | $[0.0, 90.0]$ | Mean surface inclination of the terrestrial analog computed via Horn's gradient kernel. |
| **`Lunar_Mean_Slope_deg`**| `Float` | Degrees ($^\circ$) | $[0.0, 90.0]$ | Mean surface inclination of the lunar candidate base region computed from LOLA DEM. |
| **`Earth_RMS_Roughness_m`**| `Float` | Meters ($\text{m}$) | $[0.0, \infty)$ | Detrended Root-Mean-Square surface roughness ($R_q$) of the terrestrial analog after subtracting planar tilt. |
| **`Lunar_RMS_Roughness_m`**| `Float` | Meters ($\text{m}$) | $[0.0, \infty)$ | Detrended Root-Mean-Square surface roughness ($R_q$) of the lunar candidate site. |
| **`Earth_Local_Relief_m`**| `Float` | Meters ($\text{m}$) | $[0.0, \infty)$ | Elevation range ($\Delta z = z_{\max} - z_{\min}$) within the terrestrial bounding footprint. |
| **`Lunar_Local_Relief_m`**| `Float` | Meters ($\text{m}$) | $[0.0, \infty)$ | Elevation range ($\Delta z = z_{\max} - z_{\min}$) within the lunar target footprint. |
| **`Geological_Facies`** | `String` | N/A | Categorical | Primary geological classification (e.g., Complex Impact Crater, Basaltic Flood Plain, Periglacial Massif, Lava Tube). |
| **`Lithology_Bedrock`** | `String` | N/A | Text | Dominant rock types and mineral composition of the substrate (e.g., Anorthosite, Tholeiitic Basalt, Impact Melt Breccia). |
| **`Trafficability_Score`**| `Float` | Score | $[0.0, 100.0]$ | Mobility feasibility index for robotic rovers (VIPER / LTV). Penalizes slopes $> 15^\circ$ and high normal vector dispersion ($VRM$). |
| **`Landing_Safety_Rating`**| `String` | N/A | Categorical | Operational landing hazard tier: <br>• **Category 1:** Prime Flat Landing Zone (Safe) <br>• **Category 2:** Moderate Slope (Requires Precision Landing) <br>• **Category 3:** Rugged Ridge/Massif (Highland Traverse Only) |
| **`Habitat_Utility`** | `String` | N/A | Text | Strategic utility for base camp engineering (e.g., Sub-surface Radiation Shelter, Peak of Eternal Light Telemetry Hub). |
| **`NASA_Analog_Context`** | `String` | N/A | Text | Historical or current space agency usage (NASA SSERVI, JETT, Desert RATS, FINESSE, GEODES, ESA PANGAEA). |
| **`Scientific_Viability_Summary`**| `String` | N/A | Text | Narrative synthesis of geological fidelity, environmental parallels, and operational testing relevance. |

---

## 3. Topographic Feature Metrics Summary

The feature extraction engine calculates the following core statistical and geometric descriptors:

```
+---------------------------------------------------------------------------------------+
| Feature Variable        | Formulation                               | Units           |
+-------------------------+-------------------------------------------+-----------------+
| mean_slope_deg          | Mean of arctan(sqrt(p^2 + q^2)) * 180/pi  | Degrees (deg)   |
| std_slope_deg           | Standard deviation of terrain slope       | Degrees (deg)   |
| p90_slope_deg           | 90th percentile terrain slope             | Degrees (deg)   |
| fraction_steep          | Fraction of grid cells with slope > 15°   | Ratio [0, 1]    |
| rms_roughness_m         | sqrt(mean((z - z_plane)^2))               | Meters (m)      |
| vrm                     | 1 - (||sum(normal_vectors)|| / N)         | Ratio [0, 1]    |
| tri_m                   | sqrt(mean((z_center - z_neighbors)^2))    | Meters (m)      |
| local_relief_m          | max(z) - min(z)                           | Meters (m)      |
| hypsometric_integral    | (mean(z) - min(z)) / local_relief         | Ratio [0, 1]    |
| elevation_skewness      | Fisher-Pearson standardized 3rd moment    | Dimensionless   |
+---------------------------------------------------------------------------------------+
```
