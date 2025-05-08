import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { Post } from '@/types/models';

const postService = {
  getAllPosts: async (): Promise<ApiResponse<Post[]>> => {
    try {
      // Asegurarse de que se envían las cookies con la petición
      const response = await apiClient.get('/api/post/posts', {
        withCredentials: true // Esto es crucial para enviar las cookies
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener publicaciones',
        error: error.message
      };
    }
  },
  
  createPost: async (postData: any): Promise<ApiResponse<Post>> => {
    try {
      // También asegurarse de enviar cookies al crear posts
      const response = await apiClient.post('/api/post/posts', postData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la publicación',
        error: error.message
      };
    }
  },
};

export default postService;