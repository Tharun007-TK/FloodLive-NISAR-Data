/**
 * FloodMap Live — Geospatial Data Service
 * Loads real, verified NISAR GCOV datasets and ancillary layers directly from /data.
 * ZERO seed data, ZERO mock data, ZERO fabricated 2024 dates.
 */

import { fetchJson, checkBackendHealth } from './apiClient';

/**
 * Robust loader that loads from the /data directory first
 */
async function loadDataResource(dataPath, apiPath) {
  try {
    const res = await fetch(dataPath, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // If static fetch fails, attempt API
  }

  if (apiPath) {
    return await fetchJson(apiPath);
  }

  throw new Error(`Data resource not found at ${dataPath}`);
}

/**
 * Fetch dynamic manifest of completed jobs from /data/manifest.json
 */
export async function getManifest() {
  return await loadDataResource('/data/manifest.json', '/api/v1/manifest');
}

/**
 * Fetch real NISAR observation catalog from /data/observations.json
 */
export async function getObservations() {
  return await loadDataResource('/data/observations.json', '/api/v1/observations');
}

/**
 * Fetch provenance.json for a job from /data/nisar/provenance.json
 */
export async function getJobProvenance(jobId) {
  return await loadDataResource('/data/nisar/provenance.json', jobId ? `/api/v1/jobs/${jobId}/provenance` : null);
}

/**
 * Fetch classified episodic flood extent GeoJSON from /data/nisar/nisar_flood_extent.geojson
 */
export async function getJobFloodExtent(jobId) {
  return await loadDataResource('/data/nisar/nisar_flood_extent.geojson', jobId ? `/api/v1/jobs/${jobId}/flood-extent` : null);
}

/**
 * Fetch flooded vegetation double-bounce GeoJSON from /data/nisar/nisar_flooded_vegetation.geojson
 */
export async function getJobFloodedVegetation(jobId) {
  return await loadDataResource('/data/nisar/nisar_flooded_vegetation.geojson', jobId ? `/api/v1/jobs/${jobId}/flooded-vegetation` : null);
}

/**
 * Fetch multi-sector impact and zonal statistics from /data/impact_summary.json
 */
export async function getJobImpact(jobId) {
  return await loadDataResource('/data/impact_summary.json', jobId ? `/api/v1/jobs/${jobId}/impact` : null);
}

/**
 * Fetch verified NASA GPM IMERG rainfall time series from /data/reference-data/daily_rainfall_timeseries.json
 */
export async function getRainfallTimeseries() {
  return await loadDataResource('/data/reference-data/daily_rainfall_timeseries.json', '/api/v1/rainfall');
}

/**
 * Fetch verified district boundaries from /data/boundaries/districts.geojson
 */
export async function getDistrictBoundaries() {
  return await loadDataResource('/data/boundaries/districts.geojson', null);
}

/**
 * Fetch verified settlement points from /data/boundaries/villages.geojson
 */
export async function getVillages() {
  return await loadDataResource('/data/boundaries/villages.geojson', null);
}

/**
 * Trigger an asynchronous NISAR processing job
 */
export async function createJob(params = {}) {
  return await fetchJson('/api/v1/jobs', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * Poll execution status of a processing job
 */
export async function getJobStatus(jobId) {
  return await fetchJson(`/api/v1/jobs/${jobId}`);
}

/**
 * Query real NASA / ASF DAAC for granules
 */
export async function searchEarthdata(query) {
  return await fetchJson('/api/v1/search-earthdata', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export { checkBackendHealth };
