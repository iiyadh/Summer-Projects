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
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry){
      originalRequest._retry = true;
      const { data } = await axios.post('/auth/refresh');
      originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;