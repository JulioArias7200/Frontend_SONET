import axios from 'axios';
import { getToken } from '@/utils/tokenStorage';

// Crear una instancia de axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar interceptor para añadir el token a todas las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores específicos como 401 (no autorizado)
    if (error.response && error.response.status === 401) {
      // Aquí podríamos redirigir al login o limpiar el token
      console.error('Error de autenticación:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;