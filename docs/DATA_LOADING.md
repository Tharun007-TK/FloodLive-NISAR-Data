# FloodMap Live — Automatic Dataset Loading & Discovery Guide
### Manifest-Driven Architecture for Seamless Data Ingestion

FloodMap Live features an automated data-discovery engine. When new satellite passes, boundary files, or reference data arrive, **no code modifications or component edits are required**.

---

## 1. Directory Structure for Ingestion

Datasets are organized under `frontend/public/data/` into 5 functional categories:

```text
frontend/public/data/
├── manifest.json              ← Auto-generated index of all discovered datasets
├── nisar/                     ← SAR classified flood extents & baseline observations
│   ├── nisar_20240708_flood_extent.geojson
│   ├── nisar_20240610_preflood_extent.geojson
│   └── nisar_observations_catalog.json
├── boundaries/                ← Administrative & spatial reference boundaries
│   ├── study_area.geojson
│   ├── districts.geojson
│   └── villages.geojson
├── permanent-water/           ← Perennial water mask (subtracted from flood extents)
│   └── permanent_water_mask.geojson
├── agriculture/               ← Cropland & agricultural exposure layers
│   └── cropland_exposure.geojson
└── reference-data/            ← Meteorological station timeseries & calibration data
    └── daily_rainfall_timeseries.csv
```

---

## 2. Ingestion Workflow (3 Simple Steps)

### Step 1: Copy Your Dataset
Place your compatible `.geojson`, `.json`, or `.csv` file into the appropriate subfolder above.

*Example:* Add a new observation `nisar_20240720_recession_extent.geojson` into `frontend/public/data/nisar/`.

### Step 2: Run the Indexer
From the project root (or inside `frontend/`), execute the indexing script:

```bash
# From project root:
node scripts/data-indexer.js

# Or from inside frontend:
npm run index-data
```

The script will:
1. Scan all 5 directories recursively.
2. Calculate file sizes and timestamps.
3. Compute 2D bounding boxes (`[minLng, minLat, maxLng, maxLat]`) from GeoJSON coordinates.
4. Extract observation dates, platforms, polarizations, and attribute property keys.
5. Generate `frontend/public/data/manifest.json`.

### Step 3: Refresh the Application
Open or refresh the browser.
- The data service dynamically fetches `/data/manifest.json`.
- The dashboard immediately recalculates all statistics (total flooded area, affected districts, exposed villages, cropland overlap).
- The map automatically displays the newly indexed layers.

---

## 3. Preprocessing Guidelines for Raw Satellite Data

Web browsers cannot directly render multi-gigabyte raw SAR products (e.g. NISAR HDF5 L1 SLC or Sentinel-1 SAFE archives). 

Recommended preprocessing pipeline:
1. **Speckle Filtering:** Apply Lee Sigma or Enhanced Frost filter (7x7 window).
2. **Terrain Correction:** Radiometric terrain flattening using 30m SRTM/Copernicus DEM.
3. **Bitemporal Ratioing:** Compute $\Delta \sigma^0 = \sigma^0_{\text{flood}} - \sigma^0_{\text{baseline}}$.
4. **Thresholding & Masking:** Apply Otsu adaptive threshold (typically $\le -19\text{ dB}$) and subtract permanent water.
5. **Vector Polygonization:** Export the classified water mask to GeoJSON (`EPSG:4326`).
