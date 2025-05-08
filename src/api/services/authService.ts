import apiClient from '../apiClient';
import endpoints from '../endpoints';
import { ApiResponse, AuthResponse } from '@/types/api';

interface SignupData {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profile_pic_url?: string;
  is_private?: boolean;
}

interface LoginData {
  username_or_email: string;
  password: string;
}

const authService = {
  // Registro de usuario
  signup: async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post(endpoints.auth.signup, userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  },

  // Inicio de sesión
  login: async (credentials: LoginData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post(endpoints.auth.login, credentials);
      return {
        success: true,
        data: response.data,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Credenciales inválidas'
      };
    }
  }
};

export default authService;