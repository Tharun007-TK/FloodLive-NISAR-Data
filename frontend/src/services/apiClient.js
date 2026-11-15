/**
 * FloodMap Live — API Client & Communication Layer
 * Connects exclusively to the FastAPI scientific backend microservice.
 * ZERO silent fallbacks to local files: when the backend is offline or an endpoint fails,
 * throws an explicit, actionable error to surface honest error states in the UI.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

/**
 * Standard fetcher with timeout and explicit error handling
 */
export async function fetchJson(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutMs = options.timeout || 12000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let detail = response.statusText;
      try {
        const errorJson = await response.json();
        detail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
      } catch {
        // Fall back to text if json cannot be parsed
      }
      throw new Error(`API Error [HTTP ${response.status}]: ${detail}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`Backend request timed out after ${timeoutMs}ms (${url}).`);
    }

    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error(
        `Backend service offline or unreachable at ${API_BASE_URL}. Ensure the FastAPI service is running on port 8000.`
      );
    }

    throw error;
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth() {
  try {
    const data = await fetchJson('/api/v1/health', { timeout: 3500 });
    return {
      connected: true,
      data
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}
