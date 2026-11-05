// Single source of truth for the backend URL.
// Set VITE_API_URL in Vercel (Project -> Settings -> Environment Variables)
// e.g. https://dineops-1iov.onrender.com/api
const DEFAULT_API_URL = "https://dineops-community-service-project-1.onrender.com/";

const rawUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim();

// Normalise: remove trailing slashes and make sure it ends with /api
let normalised = rawUrl.replace(/\/+$/, "");
if (!/\/api$/.test(normalised)) {
  normalised = `${normalised}/api`;
}

export const API_BASE_URL = normalised;
