import numpy as np

# Load lunar DEM
lunar_dem = np.fromfile('Data/Moon_Data/ldem_16_float.img', dtype='<f4').reshape((2880, 5760))

# Lunar candidate sites
lunar_sites = [
    ('Mare Tranquillitatis Plain (Apollo 11 Base)', 0.674, 23.472),
    ('Mare Tranquillitatis Pit (MTP Subsurface Base)', 8.330, 33.220),
    ('Marius Hills Volcanic Apron (Lava Tube Base)', 14.200, 303.200),
    ('Oceanus Procellarum ISRU Plain (Apollo 12)', -3.012, 336.577),
    ('Fra Mauro Formation Plain (Apollo 14)', -3.645, 342.528),
    ('Mons Mouton Summit Plateau (Artemis III)', -84.800, 31.700),
]

R_moon = 1737400.0

lunar_feats = []
for name, lat, lon in lunar_sites:
    r = int(round((90.0 - lat) * 16.0))
    c = int(round((lon % 360.0) * 16.0)) % 5760
    half = 5
    patch = lunar_dem[max(0, r-half):min(2880, r+half), :][:, [(c+dc)%5760 for dc in range(-half, half)]] * 1000.0
    lat_rad = np.radians(lat)
    dy = (np.pi * R_moon) / (180.0 * 16.0)
    dx = max(dy * np.cos(lat_rad), 50.0)
    gy, gx = np.gradient(patch, dy, dx)
    slope = np.degrees(np.arctan(np.sqrt(gx**2 + gy**2)))
    lunar_feats.append({
        'name': name, 'lat': lat, 'lon': lon,
        'mean_slope': float(np.mean(slope)), 'relief': float(patch.max() - patch.min()),
        'rms': float(np.std(patch))
    })

print("LUNAR SITES TOPOGRAPHY:")
for lf in lunar_feats:
    print(f"{lf['name']:<45} | Slope: {lf['mean_slope']:.2f} deg | Relief: {lf['relief']:.1f} m | RMS: {lf['rms']:.1f} m")

# Load Earth DEM tile
raw_earth = np.fromfile('Data/Earth_Data/s01w047.hgt', dtype='>i2').reshape((3601, 3601))
dy_earth = dx_earth = 30.87

# Extract 150x150 pixel patches (~4.6 km x 4.6 km) across the landmass
patch_size = 150
stride = 75
earth_patches = []

for r in range(2400, 3600 - patch_size, stride):
    for c in range(0, 3600 - patch_size, stride):
        sub = raw_earth[r:r+patch_size, c:c+patch_size]
        if np.mean(sub > 0) > 0.8: # mostly land
            elev_valid = sub[sub > 0]
            gy, gx = np.gradient(sub, dy_earth, dx_earth)
            slope = np.degrees(np.arctan(np.sqrt(gx**2 + gy**2)))
            lat_c = - (r + patch_size/2.0) / 3600.0
            lon_c = -47.0 + (c + patch_size/2.0) / 3600.0
            min_lat = - (r + patch_size) / 3600.0
            max_lat = - r / 3600.0
            min_lon = -47.0 + c / 3600.0
            max_lon = -47.0 + (c + patch_size) / 3600.0
            
            earth_patches.append({
                'patch_id': f"Para_Patch_R{r}_C{c}",
                'lat': lat_c, 'lon': lon_c,
                'bbox': [min_lat, min_lon, max_lat, max_lon],
                'mean_slope': float(np.mean(slope)),
                'p90_slope': float(np.percentile(slope, 90)),
                'relief': float(elev_valid.max() - elev_valid.min()),
                'rms': float(np.std(elev_valid)),
                'mean_elev': float(np.mean(elev_valid))
            })

print(f"\nExtracted {len(earth_patches)} localized patches directly from s01w047.hgt")

# Now match each lunar plain site to the best patches in s01w047.hgt
print("\n=== DIRECT DISCOVERIES IN s01w047.hgt MATCHING LUNAR BASES ===")
for lf in lunar_feats:
    # Compute similarity to all earth patches
    scored_patches = []
    for ep in earth_patches:
        delta_slope = abs(ep['mean_slope'] - lf['mean_slope'])
        delta_log_rms = abs(np.log10(max(0.1, ep['rms'])) - np.log10(max(0.1, lf['rms'])))
        delta_log_rel = abs(np.log10(max(1.0, ep['relief'])) - np.log10(max(1.0, lf['relief'])))
        
        ptsi = 0.40 * np.exp(-delta_slope / 3.0) + 0.35 * np.exp(-delta_log_rms / 0.8) + 0.25 * np.exp(-delta_log_rel / 1.0)
        scored_patches.append((ptsi, ep))
        
    scored_patches.sort(key=lambda x: x[0], reverse=True)
    best_score, best_ep = scored_patches[0]
    print(f"\nTarget: {lf['name']}")
    print(f"  Lunar Slope: {lf['mean_slope']:.2f} deg | Relief: {lf['relief']:.1f} m | RMS: {lf['rms']:.1f} m")
    print(f"  Best Earth EDM Match: {best_ep['patch_id']} (PTSI: {best_score*100:.1f}%)")
    print(f"  Coordinates: Lat {best_ep['lat']:.4f} S, Lon {best_ep['lon']:.4f} W")
    print(f"  Bounding Box: [{best_ep['bbox'][0]:.4f}, {best_ep['bbox'][1]:.4f}, {best_ep['bbox'][2]:.4f}, {best_ep['bbox'][3]:.4f}]")
    print(f"  Earth Slope: {best_ep['mean_slope']:.2f} deg | Relief: {best_ep['relief']:.1f} m | RMS: {best_ep['rms']:.1f} m | Mean Elev: {best_ep['mean_elev']:.1f} m")
