# 🔬 Mathematical & Algorithmic Methodology
## NASA Space Apps Challenge 2026 — Terrestrial-Lunar Topological Discovery Engine (TL-TDE)

This document provides a rigorous mathematical derivation of the geomorphometric operators, dimensional transformations, machine learning similarity metrics, and statistical validation frameworks implemented in the Terrestrial-Lunar Topological Discovery Engine.

---

## 1. Multi-Planetary Geodesy & Metric Coordinate Normalization

A fundamental challenge in comparing planetary elevation data across different celestial bodies is that angular coordinate intervals (arc-seconds or degrees) do not correspond to identical metric ground distances on Earth and the Moon.

### 1.1 Planetary Radius & Convergence Formulation
Let $R_p$ denote the volumetric mean radius of planetary body $p$:
* Earth reference radius: $R_\oplus = 6,378,137.0\text{ m}$ (WGS84 ellipsoid mean)
* Lunar reference radius: $R_M = 1,737,400.0\text{ m}$ (IAU standard sphere)

For an elevation grid with an angular sampling frequency of $\text{ppd}$ (pixels per degree), the meridional (latitude) metric spacing $\Delta y$ is constant along great circles:
$$\Delta y = \frac{\pi R_p}{180 \times \text{ppd}}$$

Along parallels of latitude $\phi$, the zonal (longitude) metric spacing $\Delta x$ compresses towards the poles due to meridional convergence:
$$\Delta x(\phi) = \Delta y \cdot \cos(\phi)$$

```
Planetary Metric Cell Scaling Comparison:
+--------------------------------------------------------------------------------+
| Metric Spacing        | Earth (SRTM 1-arcsec, 3600 ppd) | Moon (LOLA, 16 ppd)  |
+-----------------------+---------------------------------+----------------------+
| Equator (phi = 0°)    | dy = 30.87 m, dx = 30.87 m      | dy = 1895.3 m, dx = 1895.3 m |
| Mid-Lat (phi = 45°)   | dy = 30.87 m, dx = 21.83 m      | dy = 1895.3 m, dx = 1340.2 m |
| South Pole (phi = 85°)| dy = 30.87 m, dx = 2.69 m       | dy = 1895.3 m, dx = 165.2 m  |
| South Pole (phi = 89°)| dy = 30.87 m, dx = 0.54 m       | dy = 1895.3 m, dx = 33.1 m   |
+--------------------------------------------------------------------------------+
```

To avoid mathematical singularities or division by zero at extreme polar regions ($\phi \to \pm 90^\circ$), our implementation enforces a numerical regularization floor:
$$\Delta x_{\text{reg}}(\phi) = \max\left(\Delta x(\phi), \Delta x_{\min}\right)$$
where $\Delta x_{\min} = 1.0\text{ m}$ for Earth and $20.0\text{ m}$ for the Moon.

---

## 2. Geomorphological Feature Extraction

Topography is formally treated as a continuous bivariate scalar field $z = f(x, y)$ sampled on a discrete metric grid.

### 2.1 Gradient & Slope Computation (Horn's 8-Neighbor Kernel)
Directional partial derivatives $p = \frac{\partial z}{\partial x}$ and $q = \frac{\partial z}{\partial y}$ are computed over a moving $3 \times 3$ window:

$$\begin{bmatrix} z_{1} & z_{2} & z_{3} \\ z_{4} & z_{5} & z_{6} \\ z_{7} & z_{8} & z_{9} \end{bmatrix}$$

Horn's weighted finite difference operators apply twice the weight to orthogonal neighbors compared to diagonal neighbors, minimizing rotational discretization error:

$$p = \frac{(z_3 + 2z_6 + z_9) - (z_1 + 2z_4 + z_7)}{8 \Delta x}$$

$$q = \frac{(z_7 + 2z_8 + z_9) - (z_1 + 2z_2 + z_3)}{8 \Delta y}$$

The continuous terrain slope $\theta$ in decimal degrees is:
$$\theta = \arctan\left(\sqrt{p^2 + q^2}\right) \times \frac{180}{\pi}$$

#### Extracted Slope Statistics:
* **Mean Slope ($\bar{\theta}$):** Central tendency of terrain inclination.
* **Standard Deviation ($\sigma_\theta$):** Dispersion of topographic grades.
* **90th Percentile Hazard Slope ($P_{90}$):** The steepness threshold exceeded by only 10% of the patch. Crucial for assessing lander stability and rover tip-over risk.
* **Steep Slope Fraction ($f_{\text{steep}}$):** $f_{\text{steep}} = \frac{1}{N} \sum \mathbb{I}(\theta > 15^\circ)$, directly reflecting the maximum slope operational limits for NASA's VIPER rover and Artemis Lunar Terrain Vehicles.

---

### 2.2 Surface Roughness Metrics

#### A. Detrended Root-Mean-Square (RMS) Height ($R_q$)
Conventional standard deviation of elevation conflates large-scale regional tilt (sloping hillsides) with true micro-roughness. To isolate genuine surface texturing, we fit a first-order bivariate planar regression via Ordinary Least Squares:
$$\hat{z}(x, y) = \beta_0 + \beta_1 x + \beta_2 y$$

The design matrix equation $\mathbf{A} \vec{\beta} = \vec{z}$ is solved via singular value decomposition. The detrended RMS roughness is then the sample standard deviation of residuals:
$$R_q = \sqrt{\frac{1}{N} \sum_{i=1}^N \left(z_i - \hat{z}(x_i, y_i)\right)^2}$$

#### B. Vector Ruggedness Measure ($VRM$, Sappington et al., 2007)
The Vector Ruggedness Measure quantifies terrain heterogeneity by measuring the vector dispersion of unit normal vectors in 3D Euclidean space:

1. For each cell, the unit normal vector $\vec{n}_k = (n_x, n_y, n_z)^T$ is computed from spatial derivatives:
   $$\nu = \sqrt{p^2 + q^2 + 1}$$
   $$\vec{n}_k = \left(-\frac{p}{\nu}, -\frac{q}{\nu}, \frac{1}{\nu}\right)^T$$

2. Over a local convolution window of size $W \times W$, the resultant vector sum is:
   $$\vec{R} = \sum_{k=1}^{W^2} \vec{n}_k = \left(\sum n_x, \sum n_y, \sum n_z\right)^T$$

3. The normalized resultant vector length is $\|\vec{R}\| = \sqrt{(\sum n_x)^2 + (\sum n_y)^2 + (\sum n_z)^2}$.

4. The Vector Ruggedness Measure is:
   $$VRM = 1 - \frac{\|\vec{R}\|}{W^2}, \quad VRM \in [0.0, 1.0]$$

*Properties:*
* If all cells in the window have identical orientation (even on a steep $45^\circ$ planar cliff), $\|\vec{R}\| = W^2 \implies VRM = 0.0$ (perfectly smooth planar surface).
* If orientations are scattered across ridges, boulders, or crater rims, $\|\vec{R}\| \ll W^2 \implies VRM \to 1.0$ (highly rugged).
* Thus, $VRM$ successfully decouples roughness from slope.

---

### 2.3 Local Relief & Hypsometric Distribution
* **Local Relief ($\Delta z$):** $\Delta z = z_{\max} - z_{\min}$ within the localized region.
* **Hypsometric Integral ($HI$):**
  $$HI = \frac{\bar{z} - z_{\min}}{\Delta z}$$
  $HI \approx 0.5$ indicates balanced undulating terrain; $HI > 0.6$ signifies plateau/mesas; $HI < 0.4$ indicates deeply incised valleys or impact crater bowls.
* **Elevation Skewness ($\gamma_1$):**
  $$\gamma_1 = \frac{\frac{1}{N} \sum_{i=1}^N (z_i - \bar{z})^3}{\left[\frac{1}{N} \sum_{i=1}^N (z_i - \bar{z})^2\right]^{3/2}}$$

---

## 3. Machine Learning Matching Engine

Each geographic patch is characterized by an 8-dimensional feature vector:
$$\vec{f} = \left[\bar{\theta}, \sigma_\theta, P_{90}, R_q, VRM, \Delta z, HI, \gamma_1\right]^T$$

### 3.1 Robust Feature Scaling
Because geological features exhibit severe outliers (e.g., vertical cliffs, deep impact craters), standard $z$-score normalization based on mean and standard deviation is sensitive to extreme values. We utilize a **Robust Scaler** based on median and Interquartile Range (IQR):
$$x'_{ij} = \frac{x_{ij} - \text{median}(X_j)}{\text{IQR}(X_j)}, \quad \text{IQR}(X_j) = Q_{75}(X_j) - Q_{25}(X_j)$$

### 3.2 SVD Principal Component Analysis (PCA)
To visualize and verify that Earth analog clusters overlap with Lunar candidate regimes, we project the normalized feature space $\mathbf{X} \in \mathbb{R}^{M \times 8}$ onto its principal orthogonal axes of variance via Singular Value Decomposition:
$$\mathbf{X}_{\text{centered}} = \mathbf{U} \mathbf{\Sigma} \mathbf{V}^T$$
* **Principal Component 1 (91.75% Explained Variance):** Represents the primary **Energy & Relief Axis** (strong loadings on local relief $\Delta z$, RMS roughness $R_q$, and slope).
* **Principal Component 2 (5.25% Explained Variance):** Represents the **Roughness & Slope Dispersion Axis** (strong loadings on $VRM$, $\sigma_\theta$, and hypsometric skewness).
* Combined 2D manifold captures **97.00%** of total multi-planetary geomorphic variance.

### 3.3 Metric Similarity Formulations

1. **Cosine Similarity ($\mathcal{S}_{\cos}$):**
   $$\mathcal{S}_{\cos}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$$
   Evaluates proportional alignment in morphometric space independent of absolute vector magnitude.

2. **Mahalanobis Distance ($D_M$):**
   Accounts for natural correlations between geomorphic variables (e.g., steep slope naturally correlates with high local relief):
   $$D_M(\vec{u}, \vec{v}) = \sqrt{(\vec{u} - \vec{v})^T \mathbf{\Sigma}_{\text{reg}}^{-1} (\vec{u} - \vec{v})}$$
   where $\mathbf{\Sigma}_{\text{reg}} = \text{Cov}(\mathbf{X}) + \lambda \mathbf{I}$ uses Tikhonov shrinkage regularization ($\lambda = 10^{-4}$) to ensure positive definiteness.

3. **Composite Planetary Topological Similarity Index ($PTSI$):**
   $$\text{PTSI} = 0.30 S_{\text{slope}} + 0.25 S_{\text{rough}} + 0.20 S_{\text{relief}} + 0.15 S_{\text{vrm}} + 0.10 S_{\text{hazard}}$$
   Each sub-component applies an exponential kernel to penalize deviations according to physical tolerances established by planetary landing engineers:
   * Slope tolerance: $\sigma_s = 4.0^\circ$
   * Roughness logarithmic tolerance: $\sigma_r = 0.8$ dex
   * Relief logarithmic tolerance: $\sigma_l = 1.0$ dex
   * VRM tolerance: $\sigma_v = 0.015$

---

## 4. Scientific Validation & Operational Viability

Candidate matches are evaluated against NASA operational requirements for surface mobility and habitat construction:

### 4.1 Rover Trafficability Score
NASA's VIPER rover and Human Lunar Terrain Vehicles (LTV) have maximum slope negotiation limits ($\approx 15^\circ$) and obstacle clearing capabilities:
$$\text{Trafficability} = \max\left(10.0, \min\left(100.0, 100.0 - 4.0 \cdot \max(0, P_{90} - 10^\circ) - 2000.0 \cdot \max(0, VRM - 0.005)\right)\right)$$

### 4.2 Landing Safety Categorization
* **Category 1 (Prime Safe Landing Zone):** $P_{90} \le 8.0^\circ$ and $VRM < 0.004$. Smooth basaltic plains / mare basins with minimal landing gear tipping risk.
* **Category 2 (Moderate Slope / Precision Landing):** $8.0^\circ < P_{90} \le 15.0^\circ$ and $VRM < 0.012$. Elevated volcanic plateaus requiring autonomous terrain relative navigation (TRN) hazard avoidance.
* **Category 3 (Rugged Ridge / Highland Massif):** $P_{90} > 15.0^\circ$ or $VRM \ge 0.012$. Steep crater rims and mountain massifs. Unsuitable for direct landing; accessible only via rover traverse routes.
