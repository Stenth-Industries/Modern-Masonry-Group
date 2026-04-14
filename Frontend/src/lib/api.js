// Base URL for all API calls.
// In development: Vite proxy rewrites /api → localhost:5000 (via vite.config.js)
// In production (Vercel): VITE_API_URL must be set to your Railway backend URL
const rawBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, ''); // strip trailing slashes
const API_BASE = rawBase ? `${rawBase}/api` : '/api';

export default API_BASE;
