import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATALOG_DATA } from './data';
import './App.css';

export default function App() {
  const [activePlanet, setActivePlanet] = useState('Moon');
  const [activeTargetId, setActiveTargetId] = useState('MOON_MTP');
  const [weights, setWeights] = useState({
    slope: 25,
    roughness: 25,
    relief: 25,
    cave: 15,
    solar: 10
  });
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [modalSite, setModalSite] = useState(null);
  const [basemap, setBasemap] = useState('satellite');

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef({});
  const basemapLayersRef = useRef({});

  // Filter planetary targets
  const targets = useMemo(() => {
    return CATALOG_DATA.planetary_targets.filter(
      t => t.body.toLowerCase() === activePlanet.toLowerCase()
    );
  }, [activePlanet]);

  // Active Target Details
  const activeTarget = useMemo(() => {
    return CATALOG_DATA.planetary_targets.find(t => t.id === activeTargetId) || targets[0];
  }, [activeTargetId, targets]);

  // When planet changes, default to first target
  useEffect(() => {
    if (targets.length > 0 && !targets.some(t => t.id === activeTargetId)) {
      setActiveTargetId(targets[0].id);
    }
  }, [targets, activeTargetId]);

  // Calculate dynamic score function
  const calculateDynamicScore = (site) => {
    const totalWeight = weights.slope + weights.roughness + weights.relief + weights.cave + weights.solar;
    if (totalWeight === 0) return 0;

    const weightedSum = (
      (site.scores.slope_match * weights.slope) +
      (site.scores.roughness_match * weights.roughness) +
      (site.scores.relief_match * weights.relief) +
      (site.scores.cave_match * weights.cave) +
      (site.scores.solar_match * weights.solar)
    );

    return parseFloat((weightedSum / totalWeight).toFixed(1));
  };

  // Scored and Filtered Sites
  const rankedSites = useMemo(() => {
    const scored = CATALOG_DATA.sites.map(site => ({
      ...site,
      dynamicScore: calculateDynamicScore(site)
    }));

    const filtered = scored.filter(site => {
      if (activeFilter === 'EGYPT' && !site.is_egypt_discovery) return false;
      if (activeFilter === 'EDM' && (!site.is_new_discovery || site.is_egypt_discovery)) return false;
      if (activeFilter === 'BENCHMARK' && site.is_new_discovery) return false;
      if (activeFilter === 'CAVE' && site.scores.cave_match < 60) return false;
      if (activeFilter === 'SAFE' && !site.operational.landing_safety_rating.includes('Category 1')) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = site.name.toLowerCase().includes(q);
        const matchCountry = site.country.toLowerCase().includes(q);
        const matchFacies = site.operational.geological_facies.toLowerCase().includes(q);
        if (!matchName && !matchCountry && !matchFacies) return false;
      }
      return true;
    });

    return filtered.sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [weights, activeFilter, searchQuery]);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    if (!window.L) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [20.0, 0.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layers = {
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }),
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
      }),
      topo: L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'USGS The National Map'
      })
    };

    layers.satellite.addTo(map);
    basemapLayersRef.current = layers;
    leafletMap.current = map;

    // Create markers
    CATALOG_DATA.sites.forEach(site => {
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
        className: 'custom-pin-wrapper',
        html: `<div class="custom-pin ${pinClass}">${iconChar}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      const marker = L.marker([site.lat, site.lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div class="popup-container">
          <div class="popup-title">${site.name}</div>
          <div class="popup-meta">${site.country}</div>
          <div class="popup-score-row">
            <span>Match Score:</span>
            <span class="popup-score-val">${site.scores.total_match.toFixed(1)}%</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedSiteId(site.id);
      });

      markersRef.current[site.id] = marker;

      if (site.bbox) {
        const bounds = [[site.bbox[0], site.bbox[1]], [site.bbox[2], site.bbox[3]]];
        const rectColor = site.is_egypt_discovery ? '#f59e0b' : (!site.is_new_discovery ? '#a855f7' : '#38bdf8');
        L.rectangle(bounds, { color: rectColor, weight: 1.5, fillOpacity: 0.12, dashArray: '4, 4' }).addTo(map);
      }
    });
  }, []);

  // Handle Basemap Switch
  const handleBasemapChange = (type) => {
    setBasemap(type);
    if (!leafletMap.current) return;
    Object.values(basemapLayersRef.current).forEach(layer => leafletMap.current.removeLayer(layer));
    basemapLayersRef.current[type].addTo(leafletMap.current);
  };

  // Fly to Site
  const flyToSite = (siteId) => {
    setSelectedSiteId(siteId);
    const site = CATALOG_DATA.sites.find(s => s.id === siteId);
    if (site && leafletMap.current) {
      leafletMap.current.flyTo([site.lat, site.lon], 9, { animate: true, duration: 1.5 });
      if (markersRef.current[siteId]) {
        setTimeout(() => markersRef.current[siteId].openPopup(), 1200);
      }
    }
  };

  return (
    <div className="nasa-app-container">
      {/* Top Header */}
      <header className="header-bar">
        <div className="brand-section">
          <div className="nasa-logo-badge">NASA SPACE APPS</div>
          <div className="brand-title">
            <h1>TL-TDE &bull; Planetary Analog Discovery Engine</h1>
            <div className="subtitle">TERRESTRIAL-LUNAR TOPOLOGICAL MATCHING &bull; NASA SPACE APPS 2026</div>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-pill gold">
            <span className="label">Egypt Discoveries</span>
            <span className="val">3 Sites</span>
          </div>
          <div className="stat-pill">
            <span className="label">Raw EDM Scanned</span>
            <span className="val">8 Blocks</span>
          </div>
          <div className="stat-pill">
            <span className="label">NASA Benchmarks</span>
            <span className="val">3 Ground Truth</span>
          </div>
          <div className="stat-pill">
            <span className="label">Total Analogs</span>
            <span className="val">14 Unique</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main-layout">
        {/* Left Sidebar */}
        <aside className="sidebar-panel">
          <div className="sidebar-scroll-area">
            
            {/* Target Selection */}
            <div className="control-box">
              <div className="box-header">
                <span className="box-title">🪐 1. Target Celestial Body</span>
              </div>
              
              <div className="planet-selector-grid">
                <button
                  className={`planet-btn ${activePlanet === 'Moon' ? 'active' : ''}`}
                  onClick={() => setActivePlanet('Moon')}
                >
                  🌕 Moon (LOLA EDM)
                </button>
                <button
                  className={`planet-btn ${activePlanet === 'Mars' ? 'active' : ''}`}
                  onClick={() => setActivePlanet('Mars')}
                >
                  🔴 Mars (MOLA EDM)
                </button>
              </div>

              <div className="target-dropdown-group">
                <label>Select Planetary Candidate Site:</label>
                <select
                  className="styled-select"
                  value={activeTargetId}
                  onChange={(e) => setActiveTargetId(e.target.value)}
                >
                  {targets.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                  ))}
                </select>
              </div>

              {activeTarget && (
                <div className="target-preview-card">
                  <div className="target-preview-title">{activeTarget.name} [{activeTarget.body}]</div>
                  <div className="target-preview-desc">{activeTarget.mission_focus}</div>
                  <div className="target-metrics-mini">
                    <span>Slope: <strong>{activeTarget.slope_deg.toFixed(1)}°</strong></span>
                    <span>Roughness: <strong>{activeTarget.roughness_m.toFixed(0)}m</strong></span>
                    <span>Relief: <strong>{activeTarget.relief_m.toFixed(0)}m</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Sliders */}
            <div className="control-box">
              <div className="box-header">
                <span className="box-title">⚙️ 2. Feature Priority Weights</span>
                <button
                  className="reset-weights-btn"
                  onClick={() => setWeights({ slope: 25, roughness: 25, relief: 25, cave: 15, solar: 10 })}
                >
                  Reset Default
                </button>
              </div>

              <div className="slider-group">
                {[
                  { key: 'slope', label: '📐 Surface Slope Match (الميل)' },
                  { key: 'roughness', label: '⛰️ Roughness Match (الوعورة)' },
                  { key: 'relief', label: '🏔️ Local Relief Match (التضاريس)' },
                  { key: 'cave', label: '🕳️ Caves & Lava Tubes (الكهوف)' },
                  { key: 'solar', label: '☀️ Solar Exposure Match (الإضاءة)' }
                ].map(({ key, label }) => (
                  <div className="slider-item" key={key}>
                    <div className="slider-label-row">
                      <span className="slider-name">{label}</span>
                      <span className="slider-val-badge">{weights[key]}%</span>
                    </div>
                    <input
                      type="range"
                      className="custom-range"
                      min="0"
                      max="100"
                      value={weights[key]}
                      onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value, 10) })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Filtering & Search */}
            <div className="control-box">
              <div className="box-header">
                <span className="box-title">🔍 3. Filter & Explore Analogs</span>
              </div>

              <div className="search-input-wrap">
                <span className="search-icon">🔎</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search site, country, geology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-pills-row">
                {[
                  { id: 'ALL', label: 'All Sites (14)' },
                  { id: 'EGYPT', label: '🇪🇬 Egypt (3)', gold: true },
                  { id: 'EDM', label: '🛰️ New EDM (8)' },
                  { id: 'BENCHMARK', label: '🏛️ Benchmarks (3)' },
                  { id: 'CAVE', label: '🕳️ Caves' },
                  { id: 'SAFE', label: '🛬 Safe Landing' }
                ].map(p => (
                  <button
                    key={p.id}
                    className={`filter-pill ${p.gold ? 'gold' : ''} ${activeFilter === p.id ? 'active' : ''}`}
                    onClick={() => setActiveFilter(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="results-header-row">
                <span className="results-count">{rankedSites.length} Analogs Ranked</span>
                <span>Sorted by Dynamic PTSI</span>
              </div>

              {/* Cards List */}
              <div className="analogs-list">
                {rankedSites.map((site, idx) => (
                  <div
                    key={site.id}
                    className={`analog-card ${selectedSiteId === site.id ? 'active' : ''} ${site.is_egypt_discovery ? 'egypt-highlight' : ''}`}
                    onClick={() => flyToSite(site.id)}
                  >
                    <div className="card-top-row">
                      <div className="card-title-wrap">
                        <div className="card-name"><span className="card-rank">#{idx + 1}</span>{site.name}</div>
                        <div className="card-country">{site.country} &bull; Lat: {site.lat.toFixed(3)}, Lon: {site.lon.toFixed(3)}</div>
                      </div>
                      <div className="card-score-pill">
                        <span className={`card-score-val ${site.is_egypt_discovery ? 'gold' : (site.dynamicScore >= 80 ? 'high' : '')}`}>
                          {site.dynamicScore}%
                        </span>
                        <span className="card-score-label">MATCH SCORE</span>
                      </div>
                    </div>

                    <div className="card-badges">
                      {site.is_egypt_discovery && <span className="badge badge-egypt">🇪🇬 Egypt Discovery</span>}
                      {site.is_new_discovery && !site.is_egypt_discovery && <span className="badge badge-edm">🛰️ New EDM Discovery</span>}
                      {!site.is_new_discovery && <span className="badge badge-benchmark">🏛️ NASA Benchmark</span>}
                      {site.operational.landing_safety_rating.includes('Category 1') && <span className="badge badge-safe">🛬 Safe Landing Cat 1</span>}
                      {site.scores.cave_match >= 75 && <span className="badge badge-cave">🕳️ Subsurface Shelter</span>}
                    </div>

                    <div className="feature-bars-grid">
                      <div className="mini-bar-item">
                        <div className="mini-bar-label"><span>Slope</span><span>{site.scores.slope_match.toFixed(0)}%</span></div>
                        <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${site.scores.slope_match}%` }}></div></div>
                      </div>
                      <div className="mini-bar-item">
                        <div className="mini-bar-label"><span>Roughness</span><span>{site.scores.roughness_match.toFixed(0)}%</span></div>
                        <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${site.scores.roughness_match}%` }}></div></div>
                      </div>
                      <div className="mini-bar-item">
                        <div className="mini-bar-label"><span>Relief</span><span>{site.scores.relief_match.toFixed(0)}%</span></div>
                        <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${site.scores.relief_match}%` }}></div></div>
                      </div>
                      <div className="mini-bar-item">
                        <div className="mini-bar-label"><span>Cave Viability</span><span>{site.scores.cave_match.toFixed(0)}%</span></div>
                        <div className="mini-bar-track"><div className="mini-bar-fill purple" style={{ width: `${site.scores.cave_match}%` }}></div></div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <span>Target: {site.matched_target.name}</span>
                      <button
                        className="view-dossier-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalSite(site);
                        }}
                      >
                        Dossier &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Map View */}
        <section className="map-panel">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

          <div className="map-floating-overlay">
            <div className="basemap-toggle-box">
              <button
                className={`basemap-btn ${basemap === 'satellite' ? 'active' : ''}`}
                onClick={() => handleBasemapChange('satellite')}
              >
                🛰️ Satellite
              </button>
              <button
                className={`basemap-btn ${basemap === 'osm' ? 'active' : ''}`}
                onClick={() => handleBasemapChange('osm')}
              >
                🗺️ Street
              </button>
              <button
                className={`basemap-btn ${basemap === 'topo' ? 'active' : ''}`}
                onClick={() => handleBasemapChange('topo')}
              >
                🏔️ Topo
              </button>
            </div>

            <div className="map-legend-box">
              <div className="legend-item"><span className="legend-dot gold"></span><span>Egypt Discovery (New)</span></div>
              <div className="legend-item"><span className="legend-dot cyan"></span><span>Raw EDM Discovery (10x10 km)</span></div>
              <div className="legend-item"><span className="legend-dot purple"></span><span>NASA/ESA Benchmark</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Dialog */}
      {modalSite && (
        <div className="modal-backdrop open" onClick={() => setModalSite(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h2>{modalSite.name}</h2>
                <div className="modal-subtitle">{modalSite.country} | Lat: {modalSite.lat.toFixed(5)}°, Lon: {modalSite.lon.toFixed(5)}°</div>
              </div>
              <button className="modal-close-btn" onClick={() => setModalSite(null)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="dossier-section">
                <div className="dossier-section-title">📊 Topometric Geomorphology Comparison</div>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Topographic Metric</th>
                      <th>Terrestrial Value (Earth)</th>
                      <th>Target Value ({activeTarget.body})</th>
                      <th>Component Match Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mean Surface Slope</td>
                      <td className="numeric">{modalSite.topography.earth_mean_slope_deg.toFixed(2)}°</td>
                      <td className="numeric">{activeTarget.slope_deg.toFixed(2)}°</td>
                      <td className="match-pct">{modalSite.scores.slope_match.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td>RMS Roughness</td>
                      <td className="numeric">{modalSite.topography.earth_rms_roughness_m.toFixed(1)} m</td>
                      <td className="numeric">{activeTarget.roughness_m.toFixed(1)} m</td>
                      <td className="match-pct">{modalSite.scores.roughness_match.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td>Local Topographic Relief</td>
                      <td className="numeric">{modalSite.topography.earth_local_relief_m.toFixed(1)} m</td>
                      <td className="numeric">{activeTarget.relief_m.toFixed(1)} m</td>
                      <td className="match-pct">{modalSite.scores.relief_match.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td>Subsurface Cavity Viability</td>
                      <td className="numeric">{modalSite.topography.pit_depth_m.toFixed(1)} m depth</td>
                      <td className="numeric">{activeTarget.pit_depth_m ? `${activeTarget.pit_depth_m} m pit` : 'N/A'}</td>
                      <td className="match-pct">{modalSite.scores.cave_match.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td>Solar Illumination Proxy</td>
                      <td className="numeric">{(modalSite.topography.solar_exposure_proxy * 100).toFixed(0)}%</td>
                      <td className="numeric">{(activeTarget.solar_exp * 100).toFixed(0)}%</td>
                      <td className="match-pct">{modalSite.scores.solar_match.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="dossier-grid">
                <div className="dossier-section">
                  <div className="dossier-section-title">🚀 Operational Suitability & Geology</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <div><strong>Landing Safety:</strong> <span style={{ color: '#34d399' }}>{modalSite.operational.landing_safety_rating}</span></div>
                    <div><strong>Rover Trafficability:</strong> <span style={{ color: '#38bdf8' }}>{modalSite.operational.trafficability_score.toFixed(1)} / 100</span></div>
                    <div><strong>Subsurface Viability:</strong> <span>{modalSite.operational.subsurface_viability}</span></div>
                    <div><strong>Geological Facies:</strong> <span>{modalSite.operational.geological_facies}</span></div>
                    <div><strong>Lithology:</strong> <span style={{ color: '#94a3b8' }}>{modalSite.operational.lithology}</span></div>
                  </div>
                </div>

                <div className="dossier-section">
                  <div className="dossier-section-title">🔬 NASA Scientific Justification</div>
                  <p style={{ fontSize: '0.78rem', lineHeight: '1.45', color: '#cbd5e1' }}>
                    {modalSite.scientific_justification}
                  </p>
                </div>
              </div>

              <div className="caveat-box">
                <strong>CRITICAL PLANETARY ENVIRONMENT CAVEATS:</strong><br />
                {modalSite.environmental_caveats}<br />
                <em>Terrestrial tests must account for Earth's 1.0g gravitational field, atmospheric wind drag, moisture, and ambient atmospheric pressure (1 atm vs lunar vacuum).</em>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => {
                  navigator.clipboard.writeText(`${modalSite.lat}, ${modalSite.lon}`);
                  alert('Coordinates copied to clipboard!');
                }}
              >
                📋 Copy Coordinates
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  const id = modalSite.id;
                  setModalSite(null);
                  flyToSite(id);
                }}
              >
                🛰️ Center Satellite View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
