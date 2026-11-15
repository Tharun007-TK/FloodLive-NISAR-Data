/**
 * FloodMap Live — API Client & Integration Layer
 * 
 * Supports both standalone local dataset consumption and future backend server integration.
 * If VITE_API_BASE_URL is configured, requests will be routed to the backend microservice.
 * Otherwise, requests fall back to static datasets indexed in `public/data/manifest.json`.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const IS_BACKEND_CONFIGURED = Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);

/**
 * Robust fetch with JSON parsing and standardized error handling
 */
export async function fetchJson(endpoint, options = {}) {
  const url = IS_BACKEND_CONFIGURED ? `${API_BASE_URL}${endpoint}` : endpoint;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${options.timeout || 15000}ms for ${url}`);
    }
    throw error;
  }
}

/**
 * Text fetcher for CSV or plain text formats
 */
export async function fetchText(endpoint, options = {}) {
  const url = IS_BACKEND_CONFIGURED ? `${API_BASE_URL}${endpoint}` : endpoint;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Check backend connection status
 */
export async function checkBackendHealth() {
  if (!IS_BACKEND_CONFIGURED) {
    return {
      connected: false,
      configured: false,
      message: 'No backend API configured. Running in client-side data discovery mode.'
    };
  }

  try {
    const health = await fetchJson('/api/v1/health', { timeout: 3000 });
    return {
      connected: true,
      configured: true,
      status: health.status || 'OK',
      version: health.version || '1.0.0',
      message: 'Connected to FloodMap Live processing backend.'
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: err.message,
      message: `Configured backend at ${API_BASE_URL} is unreachable.`
    };
  }
}
