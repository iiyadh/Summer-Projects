import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const accessToken = useAuthStore.getState().token;
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
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