import apiClient from '../apiClient';
import endpoints from '../endpoints';
import { ApiResponse, User } from '@/types/api';

interface UpdateProfileData {
  username?: string;
  email?: string;
  bio?: string;
  profile_pic_url?: string;
}

interface UpdatePrivacyData {
  is_private?: boolean;
  show_email?: boolean;
  allow_mentions?: boolean;
}

interface UpdatePasswordData {
  current_password: string;
  new_password: string;
}

const userService = {
  // Obtener perfil del usuario autenticado
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get(endpoints.users.profile);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  },

  // Actualizar perfil
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put(endpoints.users.updateProfile, data);
      return {
        success: true,
        data: response.data,
        message: 'Perfil actualizado correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  },

  // Actualizar configuración de privacidad
  updatePrivacy: async (data: UpdatePrivacyData): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put(endpoints.users.updatePrivacy, data);
      return {
        success: true,
        data: response.data,
        message: 'Configuración de privacidad actualizada'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar privacidad'
      };
    }
  },

  // Cambiar contraseña
  updatePassword: async (data: UpdatePasswordData): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put(endpoints.users.updatePassword, data);
      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cambiar contraseña'
      };
    }
  },

  // Obtener perfil de usuario por nombre de usuario
  getUserByUsername: async (username: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get(endpoints.users.getByUsername(username));
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Usuario no encontrado'
      };
    }
  },

  // Seguir a un usuario
  followUser: async (username: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(endpoints.users.follow(username));
      return {
        success: true,
        message: 'Ahora sigues a este usuario'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al seguir usuario'
      };
    }
  },

  // Dejar de seguir a un usuario
  unfollowUser: async (username: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(endpoints.users.unfollow(username));
      return {
        success: true,
        message: 'Has dejado de seguir a este usuario'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al dejar de seguir usuario'
      };
    }
  }
};

export default userService;