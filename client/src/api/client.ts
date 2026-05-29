import axios from 'axios';
import { getApiBaseUrl } from '@/config/api';

export const api = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use((config) => {
  // Đọc base URL động (localStorage có thể override env) trên từng request.
  config.baseURL = getApiBaseUrl();

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(err);
  }
);
