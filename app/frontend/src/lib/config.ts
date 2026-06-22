import { assetPath } from '@/utils/assetPath';

// Runtime configuration
let runtimeConfig: {
  API_BASE_URL: string;
} | null = null;

// Configuration loading state
let configLoading = true;

// Default fallback configuration
const defaultConfig = {
  API_BASE_URL: 'http://127.0.0.1:8000', // Only used if runtime config fails to load
};

// Function to load runtime configuration
export async function loadRuntimeConfig(): Promise<void> {
  let timeout: number | undefined;
  try {
    console.log('🔧 DEBUG: Starting to load runtime config...');
    // Try to load configuration from a config endpoint
    const controller = new AbortController();
    timeout = window.setTimeout(() => controller.abort(), 1500);
    const configUrl = assetPath('/api/config');
    let response = await fetch(configUrl, { signal: controller.signal });
    let contentType = response.headers.get('content-type');
    if ((!response.ok || !contentType?.includes('application/json')) && configUrl !== '/api/config') {
      response = await fetch('/api/config', { signal: controller.signal });
      contentType = response.headers.get('content-type');
    }
    window.clearTimeout(timeout);
    timeout = undefined;
    if (response.ok) {
      // Only parse as JSON if the response is actually JSON
      if (contentType && contentType.includes('application/json')) {
        runtimeConfig = await response.json();
        console.log('Runtime config loaded successfully');
      } else {
        console.log(
          'Config endpoint returned non-JSON response, skipping runtime config'
        );
      }
    } else {
      console.log(
        '🔧 DEBUG: Config fetch failed with status:',
        response.status
      );
    }
  } catch (error) {
    console.log('Failed to load runtime config, using defaults:', error);
  } finally {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
    configLoading = false;
    console.log(
      '🔧 DEBUG: Config loading finished, configLoading set to false'
    );
  }
}

// Get current configuration
export function getConfig() {
  // If config is still loading, return default config to avoid using stale Vite env vars
  if (configLoading) {
    console.log('Config still loading, using default config');
    return defaultConfig;
  }

  // First try runtime config (for Lambda)
  if (runtimeConfig) {
    console.log('Using runtime config');
    return runtimeConfig;
  }

  // Then try Vite environment variables (for local development)
  if (import.meta.env.VITE_API_BASE_URL) {
    const viteConfig = {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    };
    console.log('Using Vite environment config');
    return viteConfig;
  }

  // Finally fall back to default
  console.log('Using default config');
  return defaultConfig;
}

// Dynamic API_BASE_URL getter - this will always return the current config
export function getAPIBaseURL(): string {
  const baseURL = getConfig().API_BASE_URL;
  // If the base URL is just '/', return empty string to avoid double slashes and incorrect http:// prefix
  if (baseURL === '/') {
    return '';
  }
  return baseURL;
}

// For backward compatibility, but this should be avoided
// Removed static export to prevent using stale config values
// export const API_BASE_URL = getAPIBaseURL();

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};
