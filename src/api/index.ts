import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/api';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar tokens de autenticación
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse): any => response.data,
  (error: AxiosError<ApiResponse<any>>) => {
    // Manejar errores específicos (401, 404, 500, etc.)
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
      
      // Manejar token expirado o no válido
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Redirigir a login si es necesario
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo ocurrió al configurar la solicitud
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;