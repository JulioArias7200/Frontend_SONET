import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/models';

interface LoginData {
  username_or_email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profile_pic_url?: string;
  is_private?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  // Iniciar sesión
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      return {
        success: true,
        data: response.data,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
        message: 'Error al iniciar sesión'
      };
    }
  },

  // Registrar usuario
  signup: async (data: FormData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/api/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Registro exitoso'
      };
    } catch (error: any) {
      console.error('Error en signup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario',
        message: 'Error al registrar usuario'
      };
    }
  },

  // Verificar token
  verifyToken: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/api/auth/verify');
      return {
        success: true,
        data: response.data.user,
        message: 'Token verificado'
      };
    } catch (error: any) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al verificar token',
        message: 'Error al verificar token'
      };
    }
  }
};

export default authService;