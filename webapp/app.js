/**
 * NASA Space Apps Challenge 2026
 * Terrestrial-Lunar Topological Discovery Engine (TL-TDE)
 * Core Application Logic & Interactive Controller
 */

// Application State
const state = {
  activePlanet: 'Moon',
  activeTargetId: 'MOON_MTP',
  weights: {
    slope: 25,
    roughness: 25,
    relief: 25,
    cave: 15,
    solar: 10
  },
  activeFilter: 'ALL',
  searchQuery: '',
  selectedSiteId: null,
  map: null,
  markers: {},
  boundingBoxes: {},
  currentBasemap: 'satellite',
  basemapLayers: {}
};

// DOM References
const elements = {
  planetMoonBtn: document.getElementById('planetMoonBtn'),
  planetMarsBtn: document.getElementById('planetMarsBtn'),
  targetSelect: document.getElementById('targetSelect'),
  targetPreviewTitle: document.getElementById('targetPreviewTitle'),
  targetPreviewDesc: document.getElementById('targetPreviewDesc'),
  targetPreviewMetrics: document.getElementById('targetPreviewMetrics'),
  
  // Sliders
  weightSlope: document.getElementById('weightSlope'),
  valSlope: document.getElementById('valSlope'),
  weightRoughness: document.getElementById('weightRoughness'),
  valRoughness: document.getElementById('valRoughness'),
  weightRelief: document.getElementById('weightRelief'),
  valRelief: document.getElementById('valRelief'),
  weightCave: document.getElementById('weightCave'),
  valCave: document.getElementById('valCave'),
  weightSolar: document.getElementById('weightSolar'),
  valSolar: document.getElementById('valSolar'),
  resetWeightsBtn: document.getElementById('resetWeightsBtn'),
  
  // Search & Filter
  searchInput: document.getElementById('searchInput'),
  filterPills: document.querySelectorAll('.filter-pill'),
  analogsList: document.getElementById('analogsList'),
  resultsCount: document.getElementById('resultsCount'),
  
  // Modal
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalTitle: document.getElementById('modalTitle'),
  modalSubtitle: document.getElementById('modalSubtitle'),
  modalTargetComparisonTable: document.getElementById('modalTargetComparisonTable'),
  modalOperationalBody: document.getElementById('modalOperationalBody'),
  modalScientificJustification: document.getElementById('modalScientificJustification'),
  modalEnvironmentalCaveats: document.getElementById('modalEnvironmentalCaveats'),
  modalCopyCoordsBtn: document.getElementById('modalCopyCoordsBtn'),
  modalFlyMapBtn: document.getElementById('modalFlyMapBtn')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  populateTargetSelect();
  attachEventListeners();
  render();
});

// Initialize Leaflet Map with High-Resolution Satellite Tiles
function initMap() {
  state.map = L.map('leafletMap', {
    center: [20.0, 0.0],
    zoom: 3,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: false
  });

  // Custom Zoom Control position
  L.control.zoom({ position: 'bottomright' }).addTo(state.map);

  // Basemap Tile Providers
  state.basemapLayers = {
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, and GIS User Community',
      maxZoom: 18
    }),
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }),
    topo: L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'USGS The National Map',
      maxZoom: 16
    })
  };

  // Add Default Satellite Layer
  state.basemapLayers.satellite.addTo(state.map);

  // Basemap switcher buttons
  document.querySelectorAll('.basemap-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.basemap-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const basemapType = e.target.getAttribute('data-basemap');
      
      // Swap layer
      Object.values(state.basemapLayers).forEach(layer => state.map.removeLayer(layer));
      state.basemapLayers[basemapType].addTo(state.map);
    });
  });

  // Build Markers from Catalog Data
  createMapLayers();
}

// Generate Custom Markers & Bounding Rectangles
function createMapLayers() {
  CATALOG_DATA.sites.forEach(site => {
    // Custom Pin HTML based on category
    let pinClass = 'cyan';
    let iconChar = '🛰️';

    if (site.is_egypt_discovery) {
      pinClass = 'gold';
      iconChar = '🇪🇬';
    } else if (!site.is_new_discovery) {
      pinClass = 'purple';
      iconChar = '🏛️';
    }

    const customIcon = L.divIcon({
      className: `custom-pin-wrapper`,
      html: `<div class="custom-pin ${pinClass}" title="${site.name}">${iconChar}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });

    // Create Marker
    const marker = L.marker([site.lat, site.lon], { icon: customIcon }).addTo(state.map);

    // Popup Content
    const popupContent = `
      <div class="popup-container">
        <div class="popup-title">${site.name}</div>
        <div class="popup-meta">${site.country} &bull; Lat: ${site.lat.toFixed(4)}, Lon: ${site.lon.toFixed(4)}</div>
        <div class="popup-score-row">
          <span>Topological Match:</span>
          <span class="popup-score-val" id="pop-score-${site.id}">${site.scores.total_match.toFixed(1)}%</span>
        </div>
        <button class="popup-btn" onclick="openModal('${site.id}')">View Mission Dossier</button>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('click', () => {
      highlightCard(site.id);
    });

    state.markers[site.id] = marker;

    // Create 10km x 10km Bounding Box
    if (site.bbox && site.bbox.length === 4) {
      const bounds = [[site.bbox[0], site.bbox[1]], [site.bbox[2], site.bbox[3]]];
      const rectColor = site.is_egypt_discovery ? '#f59e0b' : (!site.is_new_discovery ? '#a855f7' : '#38bdf8');
      
      const rect = L.rectangle(bounds, {
        color: rectColor,
        weight: 1.5,
        fillOpacity: 0.12,
        dashArray: '4, 4'
      }).addTo(state.map);

      state.boundingBoxes[site.id] = rect;
    }
  });
}

// Populate Planetary Target Dropdown
function populateTargetSelect() {
  elements.targetSelect.innerHTML = '';
  const filteredTargets = CATALOG_DATA.planetary_targets.filter(t => t.body.toLowerCase() === state.activePlanet.toLowerCase());
  
  filteredTargets.forEach(target => {
    const opt = document.createElement('option');
    opt.value = target.id;
    opt.textContent = `${target.name} (${target.type})`;
    if (target.id === state.activeTargetId) opt.selected = true;
    elements.targetSelect.appendChild(opt);
  });

  // If previous target not in new list, pick first
  if (!filteredTargets.some(t => t.id === state.activeTargetId) && filteredTargets.length > 0) {
    state.activeTargetId = filteredTargets[0].id;
    elements.targetSelect.value = state.activeTargetId;
  }

  updateTargetPreview();
}

// Update Active Target Information Box
function updateTargetPreview() {
  const target = CATALOG_DATA.planetary_targets.find(t => t.id === state.activeTargetId);
  if (!target) return;

  elements.targetPreviewTitle.textContent = `${target.name} [${target.body}]`;
  elements.targetPreviewDesc.textContent = `${target.mission_focus} (Morphology: ${target.type})`;
  elements.targetPreviewMetrics.innerHTML = `
    <span>Slope: <strong>${target.slope_deg.toFixed(1)}°</strong></span>
    <span>Roughness: <strong>${target.roughness_m.toFixed(0)}m</strong></span>
    <span>Relief: <strong>${target.relief_m.toFixed(0)}m</strong></span>
    ${target.pit_depth_m > 0 ? `<span>Cave Depth: <strong>${target.pit_depth_m.toFixed(0)}m</strong></span>` : ''}
  `;
}

// Calculate Dynamic Weighted PTSI Score
function calculateDynamicScore(site) {
  const w = state.weights;
  const totalWeight = w.slope + w.roughness + w.relief + w.cave + w.solar;
  if (totalWeight === 0) return 0;

  const weightedSum = (
    (site.scores.slope_match * w.slope) +
    (site.scores.roughness_match * w.roughness) +
    (site.scores.relief_match * w.relief) +
    (site.scores.cave_match * w.cave) +
    (site.scores.solar_match * w.solar)
  );

  return parseFloat((weightedSum / totalWeight).toFixed(1));
}

// Attach Event Listeners
function attachEventListeners() {
  // Planet Toggle
  elements.planetMoonBtn.addEventListener('click', () => {
    state.activePlanet = 'Moon';
    elements.planetMoonBtn.classList.add('active');
    elements.planetMarsBtn.classList.remove('active');
    populateTargetSelect();
    render();
  });

  elements.planetMarsBtn.addEventListener('click', () => {
    state.activePlanet = 'Mars';
    elements.planetMarsBtn.classList.add('active');
    elements.planetMoonBtn.classList.remove('active');
    populateTargetSelect();
    render();
  });

  // Target Select
  elements.targetSelect.addEventListener('change', (e) => {
    state.activeTargetId = e.target.value;
    updateTargetPreview();
    render();
  });

  // Sliders
  const sliders = [
    { el: elements.weightSlope, key: 'slope', label: elements.valSlope },
    { el: elements.weightRoughness, key: 'roughness', label: elements.valRoughness },
    { el: elements.weightRelief, key: 'relief', label: elements.valRelief },
    { el: elements.weightCave, key: 'cave', label: elements.valCave },
    { el: elements.weightSolar, key: 'solar', label: elements.valSolar }
  ];

  sliders.forEach(({ el, key, label }) => {
    el.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.weights[key] = val;
      label.textContent = `${val}%`;
      render();
    });
  });

  // Reset Weights
  elements.resetWeightsBtn.addEventListener('click', () => {
    state.weights = { slope: 25, roughness: 25, relief: 25, cave: 15, solar: 10 };
    elements.weightSlope.value = 25; elements.valSlope.textContent = '25%';
    elements.weightRoughness.value = 25; elements.valRoughness.textContent = '25%';
    elements.weightRelief.value = 25; elements.valRelief.textContent = '25%';
    elements.weightCave.value = 15; elements.valCave.textContent = '15%';
    elements.weightSolar.value = 10; elements.valSolar.textContent = '10%';
    render();
  });

  // Search Bar
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    render();
  });

  // Quick Filter Pills
  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      elements.filterPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.activeFilter = e.target.getAttribute('data-filter');
      render();
    });
  });

  // Modal Close
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.modalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Modal Action Buttons
  elements.modalCopyCoordsBtn.addEventListener('click', () => {
    const site = CATALOG_DATA.sites.find(s => s.id === state.selectedSiteId);
    if (!site) return;
    const coordsText = `${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}`;
    navigator.clipboard.writeText(coordsText).then(() => {
      const origText = elements.modalCopyCoordsBtn.innerHTML;
      elements.modalCopyCoordsBtn.innerHTML = '✓ Coordinates Copied!';
      setTimeout(() => { elements.modalCopyCoordsBtn.innerHTML = origText; }, 2000);
    });
  });

  elements.modalFlyMapBtn.addEventListener('click', () => {
    const site = CATALOG_DATA.sites.find(s => s.id === state.selectedSiteId);
    if (!site) return;
    closeModal();
    flyToSite(site.id);
  });
}

// Render Results List & Re-rank
function render() {
  // 1. Calculate Dynamic Score for all sites
  const scoredSites = CATALOG_DATA.sites.map(site => {
    const dynamicScore = calculateDynamicScore(site);
    return { ...site, dynamicScore };
  });

  // 2. Filter Sites
  let filtered = scoredSites.filter(site => {
    // Filter Pill Condition
    if (state.activeFilter === 'EGYPT' && !site.is_egypt_discovery) return false;
    if (state.activeFilter === 'EDM' && (!site.is_new_discovery || site.is_egypt_discovery)) return false;
    if (state.activeFilter === 'BENCHMARK' && site.is_new_discovery) return false;
    if (state.activeFilter === 'CAVE' && site.scores.cave_match < 60) return false;
    if (state.activeFilter === 'SAFE' && !site.operational.landing_safety_rating.includes('Category 1')) return false;

    // Search Query Condition
    if (state.searchQuery) {
      const matchName = site.name.toLowerCase().includes(state.searchQuery);
      const matchCountry = site.country.toLowerCase().includes(state.searchQuery);
      const matchFacies = site.operational.geological_facies.toLowerCase().includes(state.searchQuery);
      if (!matchName && !matchCountry && !matchFacies) return false;
    }

    return true;
  });

  // 3. Sort Descending by Dynamic Score
  filtered.sort((a, b) => b.dynamicScore - a.dynamicScore);

  // 4. Update Result Count
  elements.resultsCount.textContent = `${filtered.length} Analogs Ranked`;

  // 5. Build HTML
  elements.analogsList.innerHTML = '';

  if (filtered.length === 0) {
    elements.analogsList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #64748b;">
        <p>No analog sites match your active filter / search query.</p>
        <button class="filter-pill" style="margin-top: 0.75rem;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  filtered.forEach((site, index) => {
    const rank = index + 1;
    const isSelected = state.selectedSiteId === site.id;
    const cardEl = document.createElement('div');
    cardEl.className = `analog-card ${isSelected ? 'active' : ''} ${site.is_egypt_discovery ? 'egypt-highlight' : ''}`;
    cardEl.setAttribute('id', `card-${site.id}`);

    // Badges HTML
    let badgeHtml = '';
    if (site.is_egypt_discovery) {
      badgeHtml += `<span class="badge badge-egypt">🇪🇬 Egypt Discovery</span>`;
    } else if (site.is_new_discovery) {
      badgeHtml += `<span class="badge badge-edm">🛰️ New EDM Discovery</span>`;
    } else {
      badgeHtml += `<span class="badge badge-benchmark">🏛️ NASA Benchmark</span>`;
    }

    if (site.operational.landing_safety_rating.includes('Category 1')) {
      badgeHtml += `<span class="badge badge-safe">🛬 Safe Landing Cat 1</span>`;
    }
    if (site.scores.cave_match >= 75) {
      badgeHtml += `<span class="badge badge-cave">🕳️ Subsurface Shelter</span>`;
    }

    // Score Value Color Class
    let scoreColorClass = '';
    if (site.is_egypt_discovery) scoreColorClass = 'gold';
    else if (site.dynamicScore >= 80) scoreColorClass = 'high';

    cardEl.innerHTML = `
      <div class="card-top-row">
        <div class="card-title-wrap">
          <div class="card-name"><span class="card-rank">#${rank}</span>${site.name}</div>
          <div class="card-country">${site.country} &bull; Lat: ${site.lat.toFixed(3)}, Lon: ${site.lon.toFixed(3)}</div>
        </div>
        <div class="card-score-pill">
          <span class="card-score-val ${scoreColorClass}">${site.dynamicScore}%</span>
          <span class="card-score-label">MATCH SCORE</span>
        </div>
      </div>

      <div class="card-badges">${badgeHtml}</div>

      <div class="feature-bars-grid">
        <div class="mini-bar-item">
          <div class="mini-bar-label"><span>Slope</span><span>${site.scores.slope_match.toFixed(0)}%</span></div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${site.scores.slope_match}%"></div></div>
        </div>
        <div class="mini-bar-item">
          <div class="mini-bar-label"><span>Roughness</span><span>${site.scores.roughness_match.toFixed(0)}%</span></div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${site.scores.roughness_match}%"></div></div>
        </div>
        <div class="mini-bar-item">
          <div class="mini-bar-label"><span>Relief</span><span>${site.scores.relief_match.toFixed(0)}%</span></div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${site.scores.relief_match}%"></div></div>
        </div>
        <div class="mini-bar-item">
          <div class="mini-bar-label"><span>Cave Viability</span><span>${site.scores.cave_match.toFixed(0)}%</span></div>
          <div class="mini-bar-track"><div class="mini-bar-fill purple" style="width: ${site.scores.cave_match}%"></div></div>
        </div>
      </div>

      <div class="card-footer">
        <span>Target: ${site.matched_target.name}</span>
        <a class="view-dossier-link" href="#" onclick="event.stopPropagation(); openModal('${site.id}')">
          Dossier &rarr;
        </a>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      flyToSite(site.id);
    });

    elements.analogsList.appendChild(cardEl);

    // Update popup score if open
    const popScoreEl = document.getElementById(`pop-score-${site.id}`);
    if (popScoreEl) popScoreEl.textContent = `${site.dynamicScore}%`;
  });
}

// Map Fly-To and Highlight
function flyToSite(siteId) {
  state.selectedSiteId = siteId;
  const site = CATALOG_DATA.sites.find(s => s.id === siteId);
  if (!site) return;

  // Center Map smoothly
  state.map.flyTo([site.lat, site.lon], 9, {
    animate: true,
    duration: 1.5
  });

  // Open Marker Popup
  if (state.markers[siteId]) {
    setTimeout(() => {
      state.markers[siteId].openPopup();
    }, 1200);
  }

  // Highlight Sidebar Card
  highlightCard(siteId);
}

function highlightCard(siteId) {
  state.selectedSiteId = siteId;
  document.querySelectorAll('.analog-card').forEach(card => card.classList.remove('active'));
  const targetCard = document.getElementById(`card-${siteId}`);
  if (targetCard) {
    targetCard.classList.add('active');
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Reset Filters Shortcut
function resetFilters() {
  state.activeFilter = 'ALL';
  state.searchQuery = '';
  elements.searchInput.value = '';
  elements.filterPills.forEach(p => {
    if (p.getAttribute('data-filter') === 'ALL') p.classList.add('active');
    else p.classList.remove('active');
  });
  render();
}

// Open Scientific Mission Dossier Modal
function openModal(siteId) {
  const site = CATALOG_DATA.sites.find(s => s.id === siteId);
  if (!site) return;

  state.selectedSiteId = siteId;
  const dynamicScore = calculateDynamicScore(site);

  // Modal Title & Subtitle
  elements.modalTitle.textContent = site.name;
  elements.modalSubtitle.textContent = `${site.country} | Lat: ${site.lat.toFixed(5)}°, Lon: ${site.lon.toFixed(5)}° | Dynamic Match Score: ${dynamicScore}%`;

  // Topometric Comparison Table
  const target = CATALOG_DATA.planetary_targets.find(t => t.id === state.activeTargetId) || {
    name: site.matched_target.name,
    slope_deg: site.topography.target_mean_slope_deg,
    roughness_m: site.topography.target_rms_roughness_m,
    relief_m: site.topography.target_local_relief_m
  };

  elements.modalTargetComparisonTable.innerHTML = `
    <tr>
      <td>Mean Surface Slope</td>
      <td class="numeric">${site.topography.earth_mean_slope_deg.toFixed(2)}°</td>
      <td class="numeric">${target.slope_deg.toFixed(2)}°</td>
      <td class="match-pct">${site.scores.slope_match.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>RMS Roughness / Hurst Exponent</td>
      <td class="numeric">${site.topography.earth_rms_roughness_m.toFixed(1)} m</td>
      <td class="numeric">${target.roughness_m.toFixed(1)} m</td>
      <td class="match-pct">${site.scores.roughness_match.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Local Topographic Relief</td>
      <td class="numeric">${site.topography.earth_local_relief_m.toFixed(1)} m</td>
      <td class="numeric">${target.relief_m.toFixed(1)} m</td>
      <td class="match-pct">${site.scores.relief_match.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Subsurface Cavity / Skylight Viability</td>
      <td class="numeric">${site.topography.pit_depth_m.toFixed(1)} m pit (${site.topography.cavity_shielding_pct.toFixed(0)}% shield)</td>
      <td class="numeric">${target.pit_depth_m ? target.pit_depth_m.toFixed(1) + ' m pit' : 'N/A'}</td>
      <td class="match-pct">${site.scores.cave_match.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Solar Illumination / Power Proxy</td>
      <td class="numeric">${(site.topography.solar_exposure_proxy * 100).toFixed(0)}% exposure</td>
      <td class="numeric">${(target.solar_exp ? target.solar_exp * 100 : 75).toFixed(0)}% exposure</td>
      <td class="match-pct">${site.scores.solar_match.toFixed(1)}%</td>
    </tr>
  `;

  // Operational Suitability
  elements.modalOperationalBody.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.78rem;">
      <div><strong>Landing Safety:</strong> <span style="color: #34d399;">${site.operational.landing_safety_rating}</span></div>
      <div><strong>Rover Trafficability Score:</strong> <span style="font-family: var(--font-mono); color: var(--nasa-cyan);">${site.operational.trafficability_score.toFixed(1)} / 100</span></div>
      <div><strong>Subsurface Viability:</strong> <span>${site.operational.subsurface_viability}</span></div>
      <div><strong>Geological Facies:</strong> <span>${site.operational.geological_facies}</span></div>
      <div><strong>Facies Lithology:</strong> <span style="color: #94a3b8;">${site.operational.lithology}</span></div>
    </div>
  `;

  // Scientific Justification
  elements.modalScientificJustification.textContent = site.scientific_justification;

  // Environmental Caveats (NASA Mandatory)
  elements.modalEnvironmentalCaveats.innerHTML = `
    <strong>CRITICAL PLANETARY ENVIRONMENT CAVEATS:</strong><br/>
    ${site.environmental_caveats}<br/>
    <em>Terrestrial tests must account for Earth's 1.0g gravitational field, atmospheric wind drag, moisture, and ambient atmospheric pressure (1 atm vs lunar vacuum).</em>
  `;

  // Show Modal
  elements.modalBackdrop.classList.add('open');
}

function closeModal() {
  elements.modalBackdrop.classList.remove('open');
}

// Global scope exports for inline HTML handlers
window.openModal = openModal;
window.resetFilters = resetFilters;
