import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject Authorization token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses — clear stale token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear if we actually had a token (avoid loop on login page)
      const hadToken = localStorage.getItem('token');
      if (hadToken) {
        localStorage.removeItem('token');
        // Redirect to login — use window.location to force full reload of auth state
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
