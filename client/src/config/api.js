// API Configuration
// Uses environment variable for production, falls back to localhost for development

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Debug log in development
if (import.meta.env.DEV) {
  console.log('API_URL configured as:', API_URL);
}

export default API_URL;
