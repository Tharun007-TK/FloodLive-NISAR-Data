# FloodMap Live — Geospatial & Radar Data Formats Specification
### NASA Space Apps Challenge 2026 — Dancing with the SARs

This specification defines the supported input formats, geometry schemas, and radar observation metadata structures utilized by **FloodMap Live**.

---

## 1. Supported Data Formats

| Format | Category | Direct Browser Support | Description |
| :--- | :--- | :--- | :--- |
| **GeoJSON (`.geojson`, `.json`)** | Vector Layers | ✅ Native | Classified flood polygons, administrative boundaries, river channels, and settlement points. |
| **CSV (`.csv`)** | Tabular Data | ✅ Native | Daily meteorological rainfall records, station time series, and census exposure lists. |
| **JSON (`.json`)** | Metadata Catalog | ✅ Native | SAR orbital acquisitions, platform telemetry, polarization channels, and swath metadata. |
| **Cloud-Optimized GeoTIFF (`.cog.tif`)** | Raster Backscatter | ⚠️ Preprocessing Required | Raw radar amplitude/backscatter rasters. Requires backend tile-server (e.g. TiTiler or GeoServer) or COG web worker tiling. |
| **HDF5 / NetCDF / SAFE** | Raw SAR L1 SLC | ⚠️ Preprocessing Required | Spacecraft instrument format (NISAR / Sentinel-1). Requires Python radar processing pipeline to produce Level-2 surface water products. |

---

## 2. GeoJSON Schemas

### A. NISAR Classified Flood Extent (`/data/nisar/*.geojson`)

Vector polygons representing detected surface water derived from thresholded SAR backscatter.

```json
{
  "type": "FeatureCollection",
  "name": "NISAR_Flood_Extent_20240708",
  "properties": {
    "observation_id": "NISAR_L2_20240708T053412",
    "satellite": "NISAR",
    "sensor": "Synthetic Aperture Radar (L-band)",
    "acquisition_date": "2024-07-08",
    "acquisition_time": "05:34:12 UTC",
    "pass_direction": "Ascending",
    "polarization": ["VV", "VH"],
    "incidence_angle_deg": 37.4,
    "resolution_m": 12.0,
    "processing_level": "Level-2 Classified Surface Water",
    "method": "Bitemporal SAR Backscatter Ratio & Otsu Adaptive Thresholding",
    "classification_confidence": 0.94,
    "disclaimer": "Reference NISAR L2 classified flood extent dataset"
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "FLD-MOR-01",
        "district": "Morigaon",
        "severity": "CRITICAL",
        "flooded_area_km2": 428.7,
        "flood_type": "Episodic Inundation",
        "mean_backscatter_db": -22.4,
        "classification": "Open Surface Floodwater",
        "depth_est_m": "1.5 - 3.2"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[92.12, 26.18], [92.52, 26.15], ...]]
      }
    }
  ]
}
```

### B. District Administrative Boundaries (`/data/boundaries/districts.geojson`)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "DIST-MOR",
        "district": "Morigaon",
        "headquarters": "Morigaon",
        "total_area_km2": 1551.0,
        "population": 957423,
        "cropland_area_km2": 890.5,
        "vulnerability_tier": "Very High"
      },
      "geometry": { "type": "Polygon", "coordinates": [...] }
    }
  ]
}
```

### C. Settlement Points (`/data/boundaries/villages.geojson`)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "VIL-001",
        "name": "Garamur",
        "district": "Majuli",
        "population": 7450,
        "elevation_m": 85,
        "primary_livelihood": "Agriculture"
      },
      "geometry": { "type": "Point", "coordinates": [94.152, 26.963] }
    }
  ]
}
```

### D. Permanent Water Body Mask (`/data/permanent-water/permanent_water_mask.geojson`)

Perennial river courses, oxbow lakes, and reservoirs. Must be subtracted from flood observations to isolate newly flooded terrain.

```json
{
  "type": "FeatureCollection",
  "properties": { "water_type": "Permanent / Perennial" },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "WATER-001",
        "name": "Brahmaputra Main Channel - Lower Reach",
        "area_km2": 420.5,
        "type": "Perennial River Channel"
      },
      "geometry": { "type": "Polygon", "coordinates": [...] }
    }
  ]
}
```

---

## 3. CSV Rainfall Time Series Schema (`/data/reference-data/*.csv`)

Standard precipitation records with comma-delimited columns:

```csv
date,station,precipitation_mm,cumulative_july_mm,anomaly_percent,alert_level
2024-07-06,Barpeta,182.4,1293.0,+210,RED_ALERT
2024-07-07,Morigaon,195.2,1488.2,+230,RED_ALERT
2024-07-08,Morigaon,174.6,1662.8,+195,RED_ALERT
```
