# NASA & SAR Satellite Datasets Download & Ingestion Guide
### NASA Space Apps Challenge 2026 — Track: Dancing with the SARs

This guide provides direct portal links, exact search query parameters, required file formats, and placement destinations for real satellite radar datasets to run with **FloodMap Live**.

---

## 1. Where to Insert Your API Keys & Credentials

To enable automated downloading and processing of real NASA datasets, open:

[`backend/.env`](file:///c:/Users/DELL/Downloads/FloodTracker/backend/.env)

Configure the following fields:

```env
# ------------------------------------------------------------------------------
# 1. NASA EARTHDATA LOGIN (Required for NASA CMR & ASF DAAC Downloads)
# ------------------------------------------------------------------------------
# Create a free account at: https://urs.earthdata.nasa.gov/users/new
EARTHDATA_USERNAME=your_actual_username
EARTHDATA_PASSWORD=your_actual_password

# Or generate a persistent Earthdata Token at: https://urs.earthdata.nasa.gov/user_tokens
EARTHDATA_TOKEN=your_token_here

# ------------------------------------------------------------------------------
# 2. COPERNICUS DATASPACE ECOSYSTEM (Optional for Sentinel-1 Cross-Passes)
# ------------------------------------------------------------------------------
# Register at: https://dataspace.copernicus.eu/
CDSE_CLIENT_ID=your_cdse_client_id
CDSE_CLIENT_SECRET=your_cdse_client_secret
```

---

## 2. NASA Datasets: Direct Links, Parameters & Placement

### Dataset 1: NISAR L2 Surface Water Extent Product (GSW)
*The primary sensor product for this challenge.*

- **Data Provider:** NASA Jet Propulsion Laboratory (JPL) & Alaska Satellite Facility (ASF) DAAC
- **Portal Link:** [NASA Earthdata Search — NISAR Collection](https://search.earthdata.nasa.gov/search?q=NISAR)
- **Alternate ASF Vertex Portal:** [ASF Vertex Search](https://search.asf.alaska.edu/)
- **Product Short Name:** `NISAR_L2_GSW` (Global Surface Water) or `NISAR_L2_PR_GSW`
- **Spatial Coverage (Bounding Box):**
  - **Coordinates:** `[89.8, 25.5, 95.0, 28.0]` (Assam / Brahmaputra River Basin)
- **Temporal Filter (Observation Dates):**
  - **Pre-Flood Baseline:** `2024-06-01` to `2024-06-15`
  - **Monsoon Peak Inundation:** `2024-07-01` to `2024-07-15`
- **Instrument Parameters:**
  - **Sensor:** L-band Synthetic Aperture Radar (1.25 GHz, $\lambda = 24\text{ cm}$)
  - **Polarization:** Dual-Pol `VV + VH` (or Quad-Pol `HH + HV + VV + VH`)
  - **Pass Direction:** Ascending (Track 042, Frame 115)
- **File Format:** GeoTIFF or HDF5 (`.h5` / `.tif`)
- **Destination Folder:**
  ```text
  frontend/public/data/nisar/
  ```

---

### Dataset 2: OPERA Dynamic Surface Water Extent (DSWx)
*NASA JPL's high-resolution operational surface water product.*

- **Data Provider:** NASA PO.DAAC / JPL
- **Portal Link:** [NASA Earthdata Search — OPERA DSWx](https://search.earthdata.nasa.gov/search?q=OPERA_L3_DSWX-HLS)
- **Collection Concept ID:** `C2570077853-POCLOUD` (DSWx-HLS) or `C2570077854-POCLOUD` (DSWx-S1)
- **Parameters:**
  - **Tile (MGRS):** `46RDQ` and `46REQ` (covering Lower Brahmaputra, Assam)
  - **Date Range:** `2024-07-01` to `2024-07-15`
- **File Format:** Cloud-Optimized GeoTIFF (`.tif`)
- **Destination Folder:**
  ```text
  frontend/public/data/nisar/
  ```

---

### Dataset 3: Sentinel-1 High-Resolution Ground Range Detected (GRD)
*Supporting C-band radar observations for cross-validation.*

- **Data Provider:** European Space Agency (ESA) & Alaska Satellite Facility (ASF) DAAC
- **Portal Link:** [ASF Vertex — Sentinel-1 Search](https://search.asf.alaska.edu/#/?dataset=SENTINEL-1)
- **Query Parameters:**
  - **Dataset:** Sentinel-1
  - **Beam Mode:** `IW` (Interferometric Wide Swath)
  - **Product Type:** `GRD_HD` (Ground Range Detected High Resolution)
  - **Polarization:** `VV + VH`
  - **Geographic Area:** Bounding Box `[89.8, 25.5, 95.0, 28.0]`
  - **Dates:** `2024-07-08` to `2024-07-10`
- **File Format:** `.zip` or preprocessed GeoTIFF/GeoJSON
- **Destination Folder:**
  ```text
  frontend/public/data/nisar/
  ```

---

### Dataset 4: JRC Global Surface Water — Permanent Water Mask
*Essential baseline mask to subtract regular riverbeds from flood extents.*

- **Data Provider:** European Commission Joint Research Centre (JRC) / NASA SEDAC
- **Portal Link:** [JRC Global Surface Water Mapping Portal](https://global-surface-water.appspot.com/download)
- **Tile Coordinates:** `20N_090E` and `30N_090E`
- **Layer:** `Seasonality` or `Occurrence` (values $> 80\%$ define permanent perennial water)
- **File Format:** GeoTIFF or vectorized `.geojson`
- **Destination Folder:**
  ```text
  frontend/public/data/permanent-water/
  ```

---

### Dataset 5: ICAR / Copernicus Agricultural Land-Use Boundaries
*Required to estimate cropland exposure and food security impact.*

- **Data Provider:** Copernicus Global Land Service (CGLS) / GADM / Bhuvan ISRO
- **Portal Link:** [Copernicus Global Land Cover 100m](https://land.copernicus.eu/global/products/lc100)
- **Class Filter:** Class 40 (Cultivated and managed terrestrial areas / Cropland)
- **File Format:** Vector `.geojson`
- **Destination Folder:**
  ```text
  frontend/public/data/agriculture/
  ```

---

## 3. How to Convert & Ingest Downloaded Datasets

Once you download real raster satellite products (`.tif`), polygonize them into standard GeoJSON:

```bash
# Example using GDAL command-line to threshold and polygonize SAR backscatter:
gdal_calc.py -A S1_GRD_July08.tif --outfile=flood_mask.tif --calc="A <= -19.5" --NoDataValue=0
gdal_polygonize.py flood_mask.tif nisar_20240708_flood_extent.geojson -b 1 -f "GeoJSON"
```

Then simply update the manifest:
```bash
# From project root:
node scripts/data-indexer.js

# Or inside frontend:
npm run index-data
```
The application will immediately recognize the new observation and calculate the impact statistics.
