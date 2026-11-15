# FloodMap Live — Future Backend API Integration Guide
### Decoupled Service Contract & Microservice Specifications

FloodMap Live is designed with a **frontend-first, integration-ready architecture**. 
While the frontend operates independently on local indexed datasets, it is architecturally prepared to seamlessly switch to a Python/FastAPI geospatial processing microservice.

---

## 1. Environment Configuration

To connect FloodMap Live to an external or local backend service:

1. Create or edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```
2. Restart the frontend dev server (`npm run dev`).

When `VITE_API_BASE_URL` is set, `frontend/src/services/apiClient.js` routes all requests to the configured endpoint. If unset or empty, the frontend automatically falls back to local client-side dataset discovery using `/data/manifest.json`.

---

## 2. Expected REST API Endpoints

A future backend implementation (e.g. FastAPI / Flask / GDAL / GeoPandas) should implement the following endpoints:

### 1. Health & Telemetry
```http
GET /api/v1/health
```
**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "radar_engine": "NISAR-Processor-v2",
  "datasets_online": 14
}
```

### 2. Available Satellite Observations Catalog
```http
GET /api/v1/observations
```
**Response:** Array of observation objects matching the catalog schema defined in `docs/DATA_FORMATS.md`.

### 3. Classified Flood Extent
```http
GET /api/v1/flood-extent?observation_id={id}&format=geojson
```
**Response:** Standard GeoJSON `FeatureCollection` with classified flood polygon features.

### 4. Computed Multi-Sector Impact
```http
GET /api/v1/impact-analysis?observation_id={id}
```
**Response:**
```json
{
  "observation_id": "NISAR_L2_20240708T053412",
  "total_flooded_km2": 4821.6,
  "districts_affected": [
    {
      "district": "Morigaon",
      "flooded_area_km2": 428.7,
      "percent_affected": 27.6,
      "severity": "CRITICAL"
    }
  ],
  "villages_exposed_count": 2847,
  "cropland_inundated_km2": 1943.2
}
```

---

## 3. Important Architectural Distinction

> [!IMPORTANT]
> The frontend browser cannot automatically execute Python or C++ geospatial libraries (GDAL, Rasterio, SNAP, ISCE3) simply because files exist on the host file system. 
> A backend server must be started separately (e.g., `uvicorn app.main:app --port 8000`) and exposed over HTTP. FloodMap Live's API client handles the network connection and gracefully falls back to local data if the server is offline.
