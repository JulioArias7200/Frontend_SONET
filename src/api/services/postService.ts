import { Post } from '@/types/models';
import { getToken } from '@/utils/tokenStorage';
import apiClient from '../apiClient';

// Interfaz para comentarios
interface Comment {
  _id: string;
  post_id: string;
  username: string;
  profile_pic_url: string;
  text_comment: string;
  created_at: string;
}

// Interfaz simple para crear posts
interface CreatePostData {
  content: string;
  media_urls?: string[];
}

// Respuesta API simplificada
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Función para obtener el token de autenticación del localStorage
const getAuthToken = () => {
  // Usar la misma clave que en tokenStorage.ts
  return localStorage.getItem('auth_token');
};

// Función para obtener información de usuario por ID
const getUserById = async (userId: string) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    return null;
  }
};

// Función para subir imágenes
const uploadImage = async (file: File): Promise<string> => {
  try {
    // Crear un FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    
    // Usar el apiClient configurado pero con headers personalizados para la subida de archivos
    const response = await apiClient.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    // Devolver la URL de la imagen subida
    return response.data.url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

export const postService = {
  // Obtener todas las publicaciones
  getAllPosts: async (): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await apiClient.get('/api/posts/');
      console.log('Respuesta del servidor (getAllPosts):', response.data);
      
      // Verificar si la respuesta tiene la estructura esperada
      let posts = [];
      
      if (Array.isArray(response.data)) {
        posts = response.data;
      } else if (response.data && Array.isArray(response.data.posts)) {
        posts = response.data.posts;
      } else if (response.data && typeof response.data === 'object') {
        // Si es un objeto pero no tiene una propiedad 'posts', intentamos convertirlo a array
        posts = Object.values(response.data);
      }
      
      // Obtener información de usuario para cada post
      const formattedPosts = await Promise.all(posts.map(async (post: any) => {
        let userData = null;
        
        // Si el post tiene user_id, intentamos obtener la información del usuario
        if (post.user_id) {
          userData = await getUserById(post.user_id);
        }
        
        return {
          ...post,
          // Usar datos del usuario si están disponibles, o valores predeterminados
          username: userData?.username || 
                   typeof post.username === 'string' ? post.username : 
                   typeof post.user_name === 'string' ? post.user_name : 
                   typeof post.author === 'string' ? post.author : 'Usuario',
          user_profile_pic: userData?.profile_pic_url || 
                           post.user_profile_pic || 
                           post.profile_pic || 
                           post.avatar || 
                           null,
          // Incluir el objeto de usuario completo para acceder a más información
          user: userData
        };
      }));
      
      return {
        success: true,
        data: formattedPosts,
        message: 'Publicaciones obtenidas correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener publicaciones:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener publicaciones',
        message: 'Error al obtener publicaciones'
      };
    }
  },

  // Obtener feed de publicaciones
  getFeed: async (): Promise<ApiResponse<Post[]>> => {
    try {
      console.log('Obteniendo feed...');
      const token = getAuthToken();
      console.log('Token de autenticación:', token ? 'Presente' : 'No presente');
      
      // Usar apiClient en lugar de axios directamente para aprovechar los interceptores
      const response = await apiClient.get('/api/posts/');
      console.log('Respuesta del servidor (getFeed):', response);
      
      // Verificar si la respuesta tiene la estructura esperada
      let posts = [];
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        posts = response.data;
      } else if (response.data && Array.isArray(response.data.posts)) {
        posts = response.data.posts;
      } else if (response.data && typeof response.data === 'object') {
        // Si es un objeto pero no tiene una propiedad 'posts', intentamos convertirlo a array
        posts = Object.values(response.data);
      } else if (response.data && response.data.data) {
        // Si la respuesta tiene un campo data
        posts = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      }
      
      // Asegurarse de que los posts tengan los campos requeridos
      const formattedPosts = posts.map((post: any) => ({
        _id: post._id || post.id || Math.random().toString(36).substr(2, 9),
        user_id: post.user_id || post.userId || 'unknown',
        username: post.username || post.user?.username || 'Usuario',
        content: post.content || '',
        created_at: post.created_at || post.createdAt || new Date().toISOString(),
        likes_count: post.likes_count || post.likesCount || 0,
        comments_count: post.comments_count || post.commentsCount || 0,
        user_profile_pic: post.user_profile_pic || post.user?.profile_pic_url || ''
      }));
      
      console.log('Posts formateados:', formattedPosts);
      
      return {
        success: true,
        data: formattedPosts,
        message: 'Feed obtenido correctamente'
      };
    } catch (error: any) {
      console.error('Error detallado al obtener feed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener el feed',
        message: 'Error al obtener el feed'
      };
    }
  },

  // Crear una nueva publicación con soporte para imágenes
  createPost: async (postData: CreatePostData, files?: File[]): Promise<ApiResponse<Post>> => {
    try {
      const token = getToken();
      
      if (!token) {
        console.error('No hay token de autenticación disponible');
        return {
          success: false,
          error: 'No hay token de autenticación disponible. Por favor, inicia sesión nuevamente.',
          message: 'Error al crear publicación: No autenticado'
        };
      }
      
      const formData = new FormData();
      formData.append('content', postData.content);

      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('image', file);
        });
      }

      // Agregar configuración específica para FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await apiClient.post('/api/posts/', formData, config);
      
      return {
        success: true,
        data: response.data,
        message: 'Publicación creada correctamente'
      };
    } catch (error: any) {
      console.error('Error al crear publicación:', error);
      
      let errorMessage = 'Error al crear publicación';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'No estás autorizado para crear publicaciones. Por favor, inicia sesión nuevamente.';
        } else if (error.response.status === 400) {
           errorMessage = error.response.data?.message || 'Solicitud incorrecta. Verifica los datos enviados.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  },

  // Obtener publicación por ID
  getPostById: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}`);
      
      // Asegurarnos de que el post tenga un nombre de usuario como string
      const post = response.data;
      
      // Obtener información del usuario si el post tiene user_id
      let userData = null;
      if (post.user_id) {
        userData = await getUserById(post.user_id);
      }
      
      const formattedPost = {
        ...post,
        username: userData?.username || 
                 (typeof post.username === 'string' ? post.username : 
                 typeof post.user_name === 'string' ? post.user_name : 
                 typeof post.author === 'string' ? post.author : 'Usuario'),
        user_profile_pic: userData?.profile_pic_url || 
                         post.user_profile_pic || 
                         post.profile_pic || 
                         post.avatar || 
                         null,
        // Incluir el objeto de usuario completo
        user: userData
      };
      
      return {
        success: true,
        data: formattedPost,
        message: 'Publicación obtenida correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener publicación:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener publicación',
        message: 'Error al obtener publicación'
      };
    }
  },
  getComments: async (postId: string): Promise<ApiResponse<Comment[]>> => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comment`);
      return {
        success: true,
        data: response.data,
        message: 'Comentarios obtenidos correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener comentarios:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener comentarios',
        message: 'Error al obtener comentarios'
      };
    }
  },
  createComment: async (postId: string, text: string): Promise<ApiResponse<Comment>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación disponible',
          message: 'Error: No autenticado'
        };
      }

      const userData = await getUserById('me');
      const response = await apiClient.post(`/api/posts/${postId}/comment`, {
        username: userData?.username,
        profile_pic_url: userData?.profile_pic_url,
        text_comment: text
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Comentario creado correctamente'
      };
    } catch (error: any) {
      console.error('Error al crear comentario:', error);
      return {
        success: false,
        error: error.message || 'Error al crear comentario',
        message: 'Error al crear comentario'
      };
    }
  },

  // Función para verificar si el usuario actual ha dado like a un post
  checkLikeStatus: async (postId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación disponible',
          message: 'Error: No autenticado'
        };
      }
      const response = await apiClient.get(`/api/posts/${postId}/likeStatus`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data,
        message: 'Estado del like obtenido correctamente'
      };
    } catch (error: any) {
      console.error('Error al verificar like:', error);
      return {
        success: false,
        error: error.message || 'Error al verificar like',
        message: 'Error al verificar like'
      };
    }
  },

  likePost: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación disponible',
          message: 'Error: No autenticado'
        };
      }
      const response = await apiClient.post(`/api/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Respuesta del servidor (like):', response.data);
      
      // Aceptar la respuesta si tiene datos, sin validación estricta
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Post liked successfully'
        };
      }
      
      throw new Error('No se recibieron datos del servidor');
    } catch (error: any) {
      console.error('Error liking post:', error);
      return {
        success: false,
        error: error.message || 'Error liking post',
        message: 'Error liking post'
      };
    }
  },

  dislikePost: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación disponible',
          message: 'Error: No autenticado'
        };
      }
      const response = await apiClient.post(`/api/posts/${postId}/dislike`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Respuesta del servidor (dislike):', response.data);
      
      // Aceptar la respuesta si tiene datos, sin validación estricta
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Post disliked successfully'
        };
      }
      
      throw new Error('No se recibieron datos del servidor');
    } catch (error: any) {
      console.error('Error disliking post:', error);
      return {
        success: false,
        error: error.message || 'Error disliking post',
        message: 'Error disliking post'
      };
    }
  }
};

export default postService;
