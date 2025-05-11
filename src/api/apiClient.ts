import axios from 'axios';
import { getToken } from '@/utils/tokenStorage';

// Crear instancia de axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Interceptor para añadir el token a todas las peticiones
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

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Redirigir al login o manejar token expirado
      console.error('Error de autenticación:', error);
      // Aquí podrías implementar un refresh token o redirigir al login
    }
    return Promise.reject(error);
  }
);

export default apiClient;