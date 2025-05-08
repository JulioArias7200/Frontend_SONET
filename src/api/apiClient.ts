import axios from 'axios';
import { getToken } from '@/utils/tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Ajusta esto a la URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Configuración global para enviar cookies en todas las peticiones
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;