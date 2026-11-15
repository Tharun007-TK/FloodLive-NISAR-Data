/**
 * FloodMap Live — Geospatial Data Service
 * Connects directly to backend API endpoints for real NISAR GCOV processing,
 * job orchestration, and provenance tracking.
 * ZERO synthetic data, ZERO fabricated 2024 dates.
 */

import { fetchJson, checkBackendHealth } from './apiClient';

/**
 * Fetch dynamic manifest of completed jobs
 */
export async function getManifest() {
  return await fetchJson('/api/v1/manifest');
}

/**
 * Fetch real NISAR observation catalog
 */
export async function getObservations() {
  return await fetchJson('/api/v1/observations');
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
 * Fetch provenance.json for a job
 */
export async function getJobProvenance(jobId) {
  return await fetchJson(`/api/v1/jobs/${jobId}/provenance`);
}

/**
 * Fetch classified episodic flood extent GeoJSON
 */
export async function getJobFloodExtent(jobId) {
  return await fetchJson(`/api/v1/jobs/${jobId}/flood-extent`);
}

/**
 * Fetch flooded vegetation double-bounce GeoJSON
 */
export async function getJobFloodedVegetation(jobId) {
  return await fetchJson(`/api/v1/jobs/${jobId}/flooded-vegetation`);
}

/**
 * Fetch multi-sector impact and zonal statistics
 */
export async function getJobImpact(jobId) {
  return await fetchJson(`/api/v1/jobs/${jobId}/impact`);
}

/**
 * Fetch verified NASA GPM IMERG rainfall time series
 */
export async function getRainfallTimeseries() {
  return await fetchJson('/api/v1/rainfall');
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
