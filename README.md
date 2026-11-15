# FLOODMAP LIVE
### Satellite-Based Flood Monitoring & Geospatial Impact Analysis Platform
**NASA Space Apps Challenge 2026 — Track: Dancing with the SARs**

![Mission Status](https://img.shields.io/badge/NISAR%20Radar-Ready-00D5FF?style=flat-square)
![Data Discovery](https://img.shields.io/badge/Manifest%20Indexer-Automated-35D39A?style=flat-square)
![Architecture](https://img.shields.io/badge/Frontend--First-Zero--Backend-FFB547?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 1. Project Overview

**FloodMap Live** is an advanced Earth-observation web platform designed to demonstrate how satellite radar observations (specifically the **NASA-ISRO Synthetic Aperture Radar — NISAR**) can be transformed into actionable flood extent maps, damage delineations, and multi-sector geographic impact information.

During major monsoon disasters, dense cloud cover and heavy rainfall blind optical satellites. Synthetic Aperture Radar (SAR) operates in the microwave spectrum, penetrating weather systems day and night to map water inundation through specular radar reflection.

### The Three Core Questions Answered:
1. **WHERE has flooding occurred?** Delineating episodic inundation polygons while distinguishing permanent water bodies.
2. **HOW MUCH land is affected?** Calculating total inundated area (km²), percentage of district territories affected, and crop loss overlap.
3. **WHICH communities are exposed?** Identifying exposed villages, affected population figures, and agricultural livelihoods at risk.

---

## 2. Key Architecture Principles

- **Frontend-First, Zero-Backend Implementation:** The frontend operates completely independently using a dynamic client-side data discovery system. No backend server code is implemented, keeping backend files reserved as zero-byte foundations for future server-side radar pipelines.
- **Automatic Data Discovery (Manifest-Driven):** Never edit React components to load new satellite passes. Drop compatible `.geojson`, `.json`, or `.csv` files into `frontend/public/data/`, run the indexer (`npm run index-data`), and the application dynamically recognizes them and recalculates all statistics.
- **No Hardcoded Scientific Values:** All KPI statistics (flooded area, affected districts, exposed settlements, cropland inundated) are calculated dynamically from the loaded datasets.
- **Scientific Credibility & Transparency:** FloodMap Live clearly communicates SAR physics, sub-canopy vegetation masking, urban corner reflections, and validation constraints. It is explicitly an **observational extent mapping platform**, NOT a flood forecast or prediction system.

---

## 3. Project Directory Structure

```text
FloodMap-Live/
├── frontend/                          ← Complete interactive React 18 + Vite application
│   ├── public/
│   │   ├── data/                      ← Local dataset repository scanned by indexer
│   │   │   ├── manifest.json          ← Auto-generated index of all discovered datasets
│   │   │   ├── nisar/                 ← SAR classified flood extents & baseline datasets
│   │   │   ├── boundaries/            ← Study area, district polygons & settlement points
│   │   │   ├── permanent-water/       ← Perennial river & wetland masks
│   │   │   ├── agriculture/           ← Cropland & agricultural land-use layers
│   │   │   └── reference-data/        ← Meteorological rainfall records (CSV)
│   │   └── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/             ← VillageTable, DistrictTable, FilterBar, ObservationDetail
│   │   │   ├── charts/                ← Recharts Area, Bar, and Donut visualizations
│   │   │   ├── common/                ← Badge, StatCard, EmptyState, DisclaimerBanner
│   │   │   ├── layout/                ← Collapsible Sidebar, TopNav, Header
│   │   │   └── maps/                  ← Leaflet FloodMap, LayerControl, MapLegend, FeatureInfoPanel
│   │   ├── pages/
│   │   │   ├── Dashboard/             ← Mission control overview with live calculated KPIs
│   │   │   ├── LiveMap/               ← Full-screen Leaflet map with layer toggles & inspection
│   │   │   ├── ImpactAnalysis/        ← District, village, and agriculture impact tables
│   │   │   ├── SatelliteData/         ← NISAR telemetry, radar catalog & limitations
│   │   │   ├── BeforeAfter/           ← Interactive bitemporal SAR change detection slider
│   │   │   ├── DataSources/           ← Manifest catalog browser & schema inspection
│   │   │   ├── Reports/               ← Printable briefings, CSV & JSON data export
│   │   │   └── About/                 ← SAR radar physics, NISAR profile & challenge details
│   │   ├── services/
│   │   │   ├── dataService.js         ← Dynamic GeoJSON loading & geospatial impact engine
│   │   │   ├── apiClient.js           ← Decoupled API layer with backend fallback logic
│   │   │   └── reportService.js       ← Client-side CSV/JSON report export routines
│   │   └── styles/
│   │       └── globals.css            ← NASA mission-control dark theme & animations
│   ├── package.json
│   └── vite.config.js
├── backend/                           ← Reserved for future development
│   ├── app/                           ← Zero-byte Python foundation files
│   │   ├── main.py                    ← Empty
│   │   ├── config.py                  ← Empty
│   │   ├── api/__init__.py            ← Empty
│   │   ├── services/__init__.py       ← Empty
│   │   ├── processing/__init__.py     ← Empty
│   │   ├── models/__init__.py         ← Empty
│   │   └── utils/__init__.py          ← Empty
│   ├── requirements.txt               ← Empty
│   ├── .env                           ← Empty
│   └── README.md                      ← Future backend integration specification
├── scripts/
│   └── data-indexer.js                ← Automated dataset indexing utility
├── docs/
│   ├── DATA_FORMATS.md                ← GeoJSON, JSON & CSV schemas
│   ├── DATA_LOADING.md                ← Ingestion & preprocessing guide
│   └── API_INTEGRATION.md             ← Future FastAPI/REST endpoint contracts
└── README.md
```

---

## 4. Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Data Indexer
Ensure all datasets in `frontend/public/data/` are indexed into `manifest.json`:
```bash
npm run index-data
# Or from root: node scripts/data-indexer.js
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 5. Automatic Data Ingestion Workflow

To ingest new satellite observations or spatial layers:
1. **Drop your dataset** into the corresponding folder:
   - `frontend/public/data/nisar/` — Classified flood GeoJSONs (`EPSG:4326`)
   - `frontend/public/data/boundaries/` — District polygons or village points
   - `frontend/public/data/permanent-water/` — Permanent river channel masks
   - `frontend/public/data/agriculture/` — Cropland vector boundaries
   - `frontend/public/data/reference-data/` — Rainfall CSV timeseries
2. **Execute the indexer:**
   ```bash
   npm run index-data
   ```
3. **Refresh the web application:** The new observations appear in the catalog, and all impact statistics recalculate automatically.

---

## 6. Future Backend Integration

When a server-side radar processing microservice (e.g. FastAPI / GDAL / SNAP) is ready:
1. Configure `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
2. Restart the frontend dev server. The API client (`src/services/apiClient.js`) will route all calls to the remote backend while gracefully falling back to local files if the server is offline.

---

## 7. Scientific Transparency Statement

- **Extent Mapping vs. Forecasting:** FloodMap Live maps detected surface water inundation from satellite observations. It does not model hydrological precipitation runoff or predict future flood levels.
- **Physical Radar Constraints:** Dense emergent vegetation, wind-roughened open water waves, and urban double-bounce reflections introduce detection uncertainties that require field validation.
- **Permanent Water Masking:** Newly flooded areas are isolated by subtracting perennial baseline water bodies from the observed radar footprint.

---

*Developed for the NASA Space Apps Challenge 2026 — Dancing with the SARs.*
