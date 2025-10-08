import axios from 'axios';

// In development, support both a local Express server (http://localhost:5001)
// and the Firebase Functions emulator (http://127.0.0.1:5001/<project>/us-central1/api).
// Prefer overriding via REACT_APP_FUNCTIONS_URL.
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const envUrl = process.env.REACT_APP_FUNCTIONS_URL;
let baseURL = '';

if (isDev) {
  if (envUrl) {
    baseURL = envUrl; // e.g. http://127.0.0.1:5001/my-project/us-central1/api
  } else {
    // Default to local express server started by functions/index.js (npm start)
    // Prefer 127.0.0.1 to avoid IPv6/hosts resolution issues with "localhost".
    baseURL = 'http://127.0.0.1:5001';
  }
} else {
  // production: same-origin; hosting rewrite will map /api/** to the function
  baseURL = '';
}

const api = axios.create({ baseURL });

// Debug: show where requests are going
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('InclusiveBudget API baseURL =>', baseURL || 'same-origin');
}

// If baseURL already includes "/api" (e.g., emulator URL ends with /api),
// avoid sending requests to /api/api/... by stripping the duplicate prefix.
api.interceptors.request.use((config) => {
  try {
    const baseHasApi = (baseURL || '').endsWith('/api');
    if (baseHasApi && typeof config.url === 'string' && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api\//, '/');
    }
  } catch (_) {}
  return config;
});

export default api;


