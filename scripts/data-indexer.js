#!/usr/bin/env node
/**
 * FloodMap Live — Dataset Indexing Utility
 * 
 * Automatically scans frontend/public/data subdirectories for compatible geospatial
 * and tabular datasets (GeoJSON, JSON, CSV), extracts metadata (bounding boxes,
 * feature counts, schema, observation dates, SAR parameters), and generates
 * `frontend/public/data/manifest.json`.
 * 
 * Usage:
 *   node scripts/data-indexer.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target data directory (relative to project root)
const DATA_DIR = path.resolve(__dirname, '../frontend/public/data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

const CATEGORY_MAP = {
  'nisar': 'nisar',
  'boundaries': 'boundaries',
  'permanent-water': 'permanentWater',
  'agriculture': 'agriculture',
  'reference-data': 'referenceData'
};

/**
 * Calculates 2D bounding box from GeoJSON coordinates
 */
function extractBBox(geojson) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

  function traverse(coords) {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    } else {
      coords.forEach(traverse);
    }
  }

  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    for (const f of geojson.features) {
      if (f.geometry && f.geometry.coordinates) {
        traverse(f.geometry.coordinates);
      }
    }
  } else if (geojson.type === 'Feature' && geojson.geometry) {
    traverse(geojson.geometry.coordinates);
  }

  if (minLng === Infinity) return null;
  return [Number(minLng.toFixed(4)), Number(minLat.toFixed(4)), Number(maxLng.toFixed(4)), Number(maxLat.toFixed(4))];
}

/**
 * Parse a CSV line handling basic quotes
 */
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rowCount: 0 };
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return {
    headers,
    rowCount: lines.length - 1,
    sampleRows: lines.slice(1, 4).map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')))
  };
}

/**
 * Index a single file
 */
function indexFile(filePath, relativePath, categoryKey) {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath);
  const id = path.parse(filePath).name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const entry = {
    id,
    filename: baseName,
    path: `/data/${relativePath.replace(/\\/g, '/')}`,
    category: categoryKey,
    format: ext.replace('.', '').toUpperCase(),
    fileSizeBytes: stats.size,
    lastModified: stats.mtime.toISOString(),
    status: 'INDEXED',
    metadata: {}
  };

  try {
    if (ext === '.geojson' || (ext === '.json' && baseName.includes('extent') || baseName.includes('boundary') || baseName.includes('points') || baseName.includes('polygon'))) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);

      if (parsed.type === 'FeatureCollection' || parsed.type === 'Feature') {
        entry.format = 'GEOJSON';
        entry.featureCount = Array.isArray(parsed.features) ? parsed.features.length : 1;
        entry.bbox = extractBBox(parsed);

        // Extract metadata from collection properties or first feature
        const props = parsed.properties || (parsed.features && parsed.features[0]?.properties) || {};
        entry.observationDate = props.acquisition_date || props.date || props.observationDate || null;
        entry.satellite = props.satellite || props.platform || (baseName.includes('nisar') ? 'NISAR' : null);
        entry.polarization = props.polarization || (props.pols ? props.pols : null);
        entry.coverage = props.study_area || props.region || 'Assam, India';
        entry.description = parsed.description || props.description || null;
        entry.disclaimer = props.disclaimer || 'Indexed from local dataset';
        
        // Property schema inspection
        if (parsed.features && parsed.features.length > 0) {
          entry.propertyKeys = Object.keys(parsed.features[0].properties || {});
        }
      } else {
        entry.format = 'JSON';
        entry.metadata = Array.isArray(parsed) ? { itemCount: parsed.length } : { keys: Object.keys(parsed) };
        if (parsed.satellite) entry.satellite = parsed.satellite;
        if (parsed.acquisitionDate) entry.observationDate = parsed.acquisitionDate;
      }
    } else if (ext === '.json') {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      entry.format = 'JSON';
      if (Array.isArray(parsed)) {
        entry.itemCount = parsed.length;
        if (parsed[0]) entry.propertyKeys = Object.keys(parsed[0]);
      } else {
        entry.metadata = { keys: Object.keys(parsed) };
      }
    } else if (ext === '.csv') {
      const content = fs.readFileSync(filePath, 'utf8');
      const csvInfo = parseCSV(content);
      entry.format = 'CSV';
      entry.rowCount = csvInfo.rowCount;
      entry.columns = csvInfo.headers;
    } else if (ext === '.tif' || ext === '.tiff') {
      entry.format = 'GEOTIFF';
      entry.status = 'REQUIRES_PREPROCESSING';
      entry.notes = 'Browser raster display requires cloud-optimized GeoTIFF (COG) tiling or backend tile server integration.';
    }
  } catch (err) {
    entry.status = 'PARSE_ERROR';
    entry.error = err.message;
  }

  return entry;
}

/**
 * Scan directory recursively
 */
function scanDirectory(dirPath, categoryKey) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dirPath, ent.name);
    const relPath = path.relative(DATA_DIR, fullPath);

    if (ent.isDirectory()) {
      results.push(...scanDirectory(fullPath, categoryKey));
    } else if (ent.isFile() && ent.name !== 'manifest.json') {
      results.push(indexFile(fullPath, relPath, categoryKey));
    }
  }
  return results;
}

function run() {
  console.log('🛰️ FloodMap Live — Scanning dataset directory:', DATA_DIR);

  if (!fs.existsSync(DATA_DIR)) {
    console.error('Error: Data directory does not exist at', DATA_DIR);
    process.exit(1);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    generator: 'FloodMap Live Data Indexer v1.0',
    dataDir: '/data',
    formatVersion: '1.0.0',
    summary: {
      totalDatasets: 0,
      byCategory: {},
      byFormat: {}
    },
    datasets: []
  };

  for (const [folderName, categoryKey] of Object.entries(CATEGORY_MAP)) {
    const targetFolder = path.join(DATA_DIR, folderName);
    const datasets = scanDirectory(targetFolder, categoryKey);
    manifest.datasets.push(...datasets);
  }

  // Calculate summary
  manifest.summary.totalDatasets = manifest.datasets.length;
  for (const d of manifest.datasets) {
    manifest.summary.byCategory[d.category] = (manifest.summary.byCategory[d.category] || 0) + 1;
    manifest.summary.byFormat[d.format] = (manifest.summary.byFormat[d.format] || 0) + 1;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Indexed ${manifest.datasets.length} datasets across 5 categories.`);
  console.log(`📁 Manifest written to: ${MANIFEST_PATH}`);
}

run();
