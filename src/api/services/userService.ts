import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/models';

const userService = {
  // Obtener usuario actual
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return {
        success: true,
        data: response.data,
        message: 'Perfil obtenido correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener perfil',
        message: 'Error al obtener perfil'
      };
    }
  },

  // Obtener usuario por ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Usuario obtenido correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener usuario',
        message: 'Error al obtener usuario'
      };
    }
  },

  // Obtener todos los usuarios
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get('/api/users');
      return {
        success: true,
        data: response.data,
        message: 'Usuarios obtenidos correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener usuarios',
        message: 'Error al obtener usuarios'
      };
    }
  },

  // Actualizar usuario
  updateUser: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuario actualizado correctamente'
      };
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar usuario',
        message: 'Error al actualizar usuario'
      };
    }
  },

  // Buscar usuarios
  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get(`/api/users/search?q=${query}`);
      return {
        success: true,
        data: response.data,
        message: 'Búsqueda completada'
      };
    } catch (error: any) {
      console.error('Error en la búsqueda:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error en la búsqueda',
        message: 'Error en la búsqueda'
      };
    }
  }
};

export default userService;