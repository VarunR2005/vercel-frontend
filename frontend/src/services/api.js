import axios from 'axios';

let baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
// Remove trailing slash if exists to avoid double slashes in requests
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ht_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ht_token');
      localStorage.removeItem('ht_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
