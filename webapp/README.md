# 🛰️ NASA Space Apps Challenge 2026 - Web Application Guide
## Terrestrial-Lunar Topological Discovery Engine (TL-TDE)

This directory contains the production-ready frontend web application implementing the interactive exploration of Terrestrial Planetary Analogs matching candidate landing sites on the Moon and Mars.

---

## 📁 Available Formats

We provide **two ready-to-run formats** so you can deploy seamlessly into any CodeSandbox or local server setup:

### 1. Standalone Pure HTML5/JS (Zero-CORS, Zero-Build)
Located in `webapp/`:
- [`index.html`](file:///d:/NASA_Hackathon/webapp/index.html): Responsive single-page application with Mission Control dark theme.
- [`style.css`](file:///d:/NASA_Hackathon/webapp/style.css): NASA Mission Control glassmorphism CSS with accent glows.
- [`data.js`](file:///d:/NASA_Hackathon/webapp/data.js): Self-contained analog catalog (`CATALOG_DATA`) with 14 deduplicated sites.
- [`app.js`](file:///d:/NASA_Hackathon/webapp/app.js): Full interactive Leaflet map controller, real-time dynamic slider re-ranking, and scientific modal dossier.

**To run locally:**
```bash
# Simply double-click index.html or run:
python -m http.server 8000 --directory webapp
# Then open http://localhost:8000 in your browser
```

---

### 2. Modern React / Vite / CRA Version
Located in `webapp/react-src/`:
- [`App.jsx`](file:///d:/NASA_Hackathon/webapp/react-src/App.jsx): Complete React component tree with hooks (`useMemo`, `useState`, `useRef`).
- [`App.css`](file:///d:/NASA_Hackathon/webapp/react-src/App.css): React-adapted CSS.
- [`data.js`](file:///d:/NASA_Hackathon/webapp/react-src/data.js): ES6 module data export (`export const CATALOG_DATA = ...`).
- [`index.js`](file:///d:/NASA_Hackathon/webapp/react-src/index.js): React DOM root mount.
- [`package.json`](file:///d:/NASA_Hackathon/webapp/react-src/package.json): Standard dependencies (`leaflet`, `react`, `react-dom`).

---

## 🚀 How to Import into CodeSandbox (`nasadraft-8yd442`)

1. Open your sandbox: [https://codesandbox.io/p/sandbox/nasadraft-8yd442](https://codesandbox.io/p/sandbox/nasadraft-8yd442)
2. **If your sandbox is Vanilla HTML / Static:**
   - Copy `webapp/index.html` into your sandbox `index.html`.
   - Copy `webapp/style.css` into your sandbox `style.css`.
   - Copy `webapp/data.js` into your sandbox `data.js`.
   - Copy `webapp/app.js` into your sandbox `app.js`.
3. **If your sandbox is React / Vite:**
   - Copy `webapp/react-src/App.jsx` into `src/App.jsx`.
   - Copy `webapp/react-src/App.css` into `src/App.css`.
   - Copy `webapp/react-src/data.js` into `src/data.js`.
   - Make sure `index.html` has Leaflet CSS in `<head>`:
     ```html
     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
     <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
     ```
4. Save and your live interactive map and dynamic ranking will boot up immediately!

---

## ✨ Features Included in Web Interface

1. **Planetary Target Selector:**
   - Toggle between **Moon 🌕** and **Mars 🔴**.
   - Select targets: *Mare Tranquillitatis Pit (MTP)*, *Marius Hills*, *Connecting Ridge (Artemis III)*, *Peak Near Shackleton*, *Mons Mouton*, and *Jezero Crater*.
   - Live target preview card showing slope, roughness, relief, and mission focus.
2. **Dynamic Priority Sliders (Weighted Geomorphometry):**
   - Slope Match (الميل)
   - Roughness Match (الوعورة)
   - Local Relief Match (التضاريس)
   - Subsurface Cave / Lava Tube Match (الكهوف وأنابيب الحمم البركانية)
   - Solar Exposure / Power Match (الإضاءة الشمسية)
   - Real-time mathematical composite re-calculation:
     $$\text{Score} = \frac{\sum w_i \cdot S_i}{\sum w_i}$$
3. **Interactive High-Resolution Satellite Map (Leaflet):**
   - High-res Esri World Imagery + OSM + USGS Topo switcher.
   - Distinctive styled pins:
     - 🇪🇬 **Gold Pin:** Newly discovered Egyptian analogs.
     - 🛰️ **Cyan Pin:** Raw EDM direct scans (10x10 km blocks).
     - 🏛️ **Purple Pin:** Established NASA/ESA benchmarks.
   - Smooth flying animations (`map.flyTo`) when clicking any card.
4. **Quick Category Filter Pills:**
   - `All Sites (14)`
   - `🇪🇬 Egypt (3)`
   - `🛰️ New EDM Scans (8)`
   - `🏛️ NASA Benchmarks (3)`
   - `🕳️ Caves/Lava Tubes`
   - `🛬 Safe Landing Cat 1`
5. **NASA Scientific Mission Dossier Modal:**
   - Side-by-side Topometry comparison table (Earth vs Target).
   - Rover Trafficability and Landing Safety classification.
   - Subsurface Cavity viability assessment.
   - NASA Mandatory Environmental Caveats (1.0g gravity, 1 atm pressure, radiation).
   - "Copy Coordinates" and "Center Satellite View" action buttons.
