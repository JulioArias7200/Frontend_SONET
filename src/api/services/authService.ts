import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/models';
import { saveToken, removeToken } from '@/utils/tokenStorage';

interface LoginCredentials {
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
  message?: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      
      if (response.data.token) {
        // Guardar el token con una duración de 1 día
        saveToken(response.data.token, 1);
        
        console.log('Token guardado correctamente');
      }
      
      return {
        success: true,
        data: {
          token: response.data.token,
          user: {
            _id: response.data.user.id || response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            bio: response.data.user.bio || '',
            profile_pic_url: response.data.user.profile_pic_url || '',
          }
        },
        message: response.data.message || 'Inicio de sesión exitoso'
      };
    } catch (error: any) {
      console.error('Error de login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
        error: error.message
      };
    }
  },

  signup: async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      
      if (response.data.token) {
        // Guardar el token con una duración de 1 día
        saveToken(response.data.token, 1);
      }
      
      return {
        success: true,
        data: {
          token: response.data.token,
          user: {
            _id: response.data.user_id || response.data.user.id,
            username: userData.username,
            email: userData.email,
            bio: userData.bio || '',
            profile_pic_url: userData.profile_pic_url || '',
          }
        },
        message: response.data.message || 'Registro exitoso'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
        error: error.message
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    // Eliminar el token almacenado
    removeToken();
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  }
};

export default authService;