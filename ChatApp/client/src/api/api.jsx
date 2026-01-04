import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/recovery/forgot',
  '/auth/logout',
  '/auth/refresh',
];

api.interceptors.request.use(config => {
  const isPublic = publicRoutes.some(route => config.url.includes(route));
  if (!isPublic) {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error?.response?.status;
    const isAuthRefresh = typeof originalRequest.url === 'string' && originalRequest.url.includes('/auth/refresh');

    if ((status === 401 || status === 403) && !originalRequest._retry && !isAuthRefresh) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        if (data?.token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
          useAuthStore.getState().setToken(data.token);
          return api(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;