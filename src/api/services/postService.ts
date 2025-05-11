import apiClient from '../apiClient';
import { ApiResponse } from '@/types/api';
import { Post } from '@/types/models';

const postService = {
  getAllPosts: async (): Promise<ApiResponse<{ posts: Post[] }>> => {
    try {
      const response = await apiClient.get('/api/posts');
      return {
        success: true,
        data: {
          posts: response.data.posts || []
        },
        message: 'Posts obtenidos correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener publicaciones',
        error: error.message
      };
    }
  },
  
  getFeed: async (): Promise<ApiResponse<{ posts: Post[] }>> => {
    try {
      const response = await apiClient.get('/api/feed');
      return {
        success: true,
        data: {
          posts: response.data.posts || []
        },
        message: 'Feed obtenido correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el feed',
        error: error.message
      };
    }
  },
  
  createPost: async (postData: any): Promise<ApiResponse<Post>> => {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return {
        success: true,
        data: response.data,
        message: 'Post creado correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la publicación',
        error: error.message
      };
    }
  },

  likePost: async (postId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/like`);
      return {
        success: true,
        message: response.data.message || 'Like agregado correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al dar like',
        error: error.message
      };
    }
  },

  commentPost: async (postId: string, commentData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comment`, commentData);
      return {
        success: true,
        data: response.data.data,
        message: 'Comentario agregado correctamente'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al comentar',
        error: error.message
      };
    }
  }
};

export default postService;