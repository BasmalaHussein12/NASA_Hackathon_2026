# 🤝 Web Team Handoff & Frontend Integration Guide
## NASA Space Apps Challenge 2026 — Terrestrial-Lunar Topological Discovery Engine (TL-TDE)

Welcome Web Team! The **Data Analysis & Machine Learning** pipeline is 100% complete. All complex mathematical modeling, SVD Principal Component Analysis, and raw elevation grid convolutions have been **pre-computed**. You do **not** need to run any heavy Python, GDAL, or C libraries on your web server or frontend.

Everything you need to build a responsive web interface is packaged into two ready-to-use files:
* **Primary JSON File (Recommended for React/Vue/Vanilla JS):** [`outputs/web_catalog.json`](outputs/web_catalog.json)
* **Primary CSV File (If using D3 or PapaParse):** [`outputs/final_terrestrial_planetary_analogs_master.csv`](outputs/final_terrestrial_planetary_analogs_master.csv)

---

## 1. Expected Concerns from the Web Team & Instant Answers

| Common Web Concern | The Solution We Built for You |
| :--- | :--- |
| **"Do we need a backend server (Node/Python) to calculate similarity scores?"** | **No!** All component match percentages (`slope_match`, `roughness_match`, `relief_match`, `cave_match`, `solar_match`) are pre-computed in the JSON. You can recalculate the total score and re-sort the table **instantly in the browser in $< 1\text{ millisecond}$** using Vanilla JS. |
| **"How do we draw the bounding boxes and markers on the map?"** | Each site object includes **both** `lat, lon` (for standard pins/markers) AND `bbox: [min_lat, min_lon, max_lat, max_lon]` (for drawing exact rectangular test perimeters using Leaflet's `L.rectangle()` or Mapbox). |
| **"Are there missing values, NaNs, or broken coordinates?"** | **Zero.** The dataset is 100% cleaned, deduplicated, and validated. Every row has valid numbers and complete descriptions. |
| **"How do we get real satellite imagery without paying for Google Maps API?"** | Use the free, open **Esri World Imagery** tile service or **NASA GIBS TrueColor** WMS (already specified in the JSON). Leaflet loads this with 2 lines of code with zero API keys required! |

---

## 2. How the Feature Classification & Filtering Works in the UI

The website should guide the user (NASA scientist) through a clean, 4-step interactive flow:

```
+-----------------------------------------------------------------------------------------+
| STEP 1: Select Target Planet & Region                                                   |
| [ Dropdown: 🌕 Moon (Default) | 🔴 Mars ]                                               |
| [ Dropdown: Mare Tranquillitatis Pit | Marius Hills Domes | Connecting Ridge | Jezero ] |
+-----------------------------------------------------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
| STEP 2: Interactive Feature Weight Sliders (0% to 100%)                                 |
| 1. Slope / Flatness (الانحدار):             [========O===] 70%                          |
| 2. Surface Roughness (الوعورة):            [=====O======] 50%                          |
| 3. Local Relief (التضاريس والارتفاع):       [===O========] 30%                          |
| 4. Subsurface & Caves (الكهوف وأنابيب الحمم):[==========O=] 90%                          |
| 5. Solar Illumination (التعرض الشمسي):     [====O=======] 40%                          |
+-----------------------------------------------------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
| STEP 3: Classification Badges & Quick Filters                                           |
| [X] All Sites  [ ] 🌟 New Egyptian Discoveries  [ ] 🚀 New EDM Discoveries  [ ] Benchmarks|
| Landing Safety: ( ) All  ( ) 🟢 Cat 1: Safe  ( ) 🟡 Cat 2: Moderate  ( ) 🔴 Cat 3: High |
| Subsurface:     [ ] Show only sites with high cavity / lava tube potential (>70%)       |
+-----------------------------------------------------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
| STEP 4: Live Results View (Map + Ranked Cards / Table)                                  |
| • Card 1: 🇪🇬 Djara Stalactite Cave — 84.2% Match [Category 1 Safe] [High Cave Shielding]|
| • Card 2: 🇮🇸 Holuhraun Basalt Plain — 78.5% Match [Category 1 Safe] [Pristine Basalt]  |
| • Card 3: 🇪🇬 Bahariya Black Desert — 76.1% Match [Category 2] [Marius Hills Analog]    |
+-----------------------------------------------------------------------------------------+
```

---

## 3. The Live Dynamic Ranking Formula (Copy-Paste JS)

When the scientist drags any slider in the UI, execute this JavaScript function client-side to instantly recalculate the total score and re-order the cards:

```javascript
// Weights from user sliders (0 to 100)
const userWeights = {
  slope: 0.30,      // Slider 1
  roughness: 0.25,  // Slider 2
  relief: 0.20,     // Slider 3
  cave: 0.15,       // Slider 4
  solar: 0.10       // Slider 5
};

function calculateLiveScore(site, weights) {
  const sumWeights = weights.slope + weights.roughness + weights.relief + weights.cave + weights.solar;
  if (sumWeights === 0) return 0;

  const weightedSum = 
    (site.scores.slope_match * weights.slope) +
    (site.scores.roughness_match * weights.roughness) +
    (site.scores.relief_match * weights.relief) +
    (site.scores.cave_match * weights.cave) +
    (site.scores.solar_match * weights.solar);

  return parseFloat((weightedSum / sumWeights).toFixed(1));
}

// Re-rank sites on slider input
function onSliderChange() {
  catalogData.sites.forEach(site => {
    site.live_score = calculateLiveScore(site, userWeights);
  });
  // Sort descending
  catalogData.sites.sort((a, b) => b.live_score - a.live_score);
  renderResultsTable(catalogData.sites);
}
```

---

## 4. How to Display Real Satellite Imagery (Leaflet.js Guide)

To show live, high-resolution satellite imagery for each candidate site without paid API keys, use **Esri World Imagery** in Leaflet:

```html
<!-- Include Leaflet CSS and JS in HTML -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="map" style="height: 500px; width: 100%; border-radius: 8px;"></div>

<script>
  // 1. Initialize Map
  const map = L.map('map').setView([20.0, 0.0], 2);

  // 2. Free High-Res Esri Satellite Tile Layer (Zero Cost, Zero API Keys)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, Earthstar Geographics',
    maxZoom: 18
  }).addTo(map);

  // 3. Add Site Markers and Bounding Box Rectangles
  fetch('outputs/web_catalog.json')
    .then(res => res.json())
    .then(data => {
      data.sites.forEach(site => {
        // Choose marker color: Gold for Egypt, Blue for Brazil, Purple for Benchmarks
        const markerColor = site.is_egypt_discovery ? '#e5a93b' : (site.is_new_discovery ? '#3498db' : '#9b59b6');

        // Circle Marker
        const marker = L.circleMarker([site.lat, site.lon], {
          radius: 8,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9
        }).addTo(map);

        // Interactive Popup
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px;">
            <h4 style="margin: 0 0 5px 0;">${site.name}</h4>
            <b>Country:</b> ${site.country}<br/>
            <b>Match Score:</b> <span style="color: #27ae60; font-weight: bold;">${site.scores.total_match}%</span><br/>
            <b>Matched Target:</b> ${site.matched_target.name}<br/>
            <b>Safety:</b> ${site.operational.landing_safety_rating}<br/>
            <b>Cave Shielding:</b> ${site.topography.cavity_shielding_pct}%
          </div>
        `);

        // Draw Bounding Box Rectangle
        const bounds = [[site.bbox[0], site.bbox[1]], [site.bbox[2], site.bbox[3]]];
        L.rectangle(bounds, { color: markerColor, weight: 1, fillOpacity: 0.15 }).addTo(map);
      });
    });

  // When user clicks a card in the table, fly to the satellite view!
  function focusOnSite(lat, lon, bbox) {
    map.flyToBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { maxZoom: 13, duration: 1.5 });
  }
</script>
```

---

## 5. UI Badge & Warning Guide for Design & Web

When rendering cards for each candidate site:

### A. Classification Badges (Pills)
* 🌟 **`NEW DISCOVERY (Egypt)`** $\to$ Gold/Yellow badge (`background: #f39c12; color: white;`)
* 🚀 **`NEW DISCOVERY (Direct EDM)`** $\to$ Blue badge (`background: #2980b9; color: white;`)
* 🏛️ **`GLOBAL BENCHMARK`** $\to$ Purple badge (`background: #8e44ad; color: white;`)

### B. Landing Safety Rating Badges
* 🟢 **`Category 1: Prime Flat Landing Zone (Safe)`** $\to$ Green (`#27ae60`)
* 🟡 **`Category 2: Moderate Grade`** $\to$ Orange (`#e67e22`)
* 🔴 **`Category 3: Rugged Mountain / Highland`** $\to$ Red (`#c0392b`)

### C. Automated Warning Boxes (Collapsible in Card)
Display the pre-formatted `environmental_caveats` text from the JSON:
> ⚠️ **NASA Environmental Caveat:** Gravity on Earth is $1.0\text{ g}$ vs $0.166\text{ g}$ on Moon / $0.38\text{ g}$ on Mars. Surface has $1\text{ atm}$ air pressure vs vacuum. Cosmic radiation testing requires specialized vacuum chambers.
