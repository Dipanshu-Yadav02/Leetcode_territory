import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy forwards /api/* to http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
