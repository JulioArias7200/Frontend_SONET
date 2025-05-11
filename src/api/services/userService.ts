import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/models';

const userService = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return {
        success: true,
        data: {
          _id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || '',
          profile_pic_url: response.data.profile_pic_url || '',
          is_private: response.data.is_private || false,
          followers_count: response.data.followers_count || 0,
          following_count: response.data.following_count || 0,
        },
        message: 'Perfil obtenido correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil',
        error: error.message
      };
    }
  },

  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return {
        success: true,
        data: {
          _id: response.data.id,
          username: response.data.username,
          bio: response.data.bio || '',
          profile_pic_url: response.data.profile_pic_url || '',
          is_private: response.data.is_private || false,
          followers_count: response.data.followers_count || 0,
          following_count: response.data.following_count || 0,
        },
        message: 'Usuario obtenido correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener usuario',
        error: error.message
      };
    }
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put('/api/users/profile', userData);
      return {
        success: true,
        data: response.data.user,
        message: response.data.message || 'Perfil actualizado correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil',
        error: error.message
      };
    }
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get('/api/users');
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : response.data.users || [],
        message: 'Usuarios obtenidos correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener usuarios',
        error: error.message
      };
    }
  },

  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get(`/api/users/search?q=${query}`);
      return {
        success: true,
        data: response.data,
        message: 'Búsqueda completada'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error en la búsqueda',
        error: error.message
      };
    }
  }
};

export default userService;