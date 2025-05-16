import axios from 'axios';
import { Post } from '@/types/models';
import { getToken } from '@/utils/tokenStorage';

// URL base del backend
const API_URL = 'http://127.0.0.1:2020'; // Puerto correcto 2020

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

// Cliente HTTP con autenticación dinámica
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    
    // Configurar headers específicos para la subida de archivos
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    };
    
    // Enviar la solicitud para subir la imagen
    const response = await axios.post(`${API_URL}/api/upload/image`, formData, config);
    
    // Devolver la URL de la imagen subida
    return response.data.url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

const postService = {
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
      const formattedPosts = await Promise.all(posts.map(async post => {
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
      const response = await apiClient.get('/api/posts/');
      console.log('Respuesta del servidor (getFeed):', response.data);
      
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
      const formattedPosts = await Promise.all(posts.map(async post => {
        let userData = null;
        
        // Si el post tiene user_id, intentamos obtener la información del usuario
        if (post.user_id) {
          userData = await getUserById(post.user_id);
        }
        
        return {
          ...post,
          // Usar datos del usuario si están disponibles, o valores predeterminados
          username: userData?.username || 
                   (typeof post.username === 'string' ? post.username : 
                   typeof post.user_name === 'string' ? post.user_name : 
                   typeof post.author === 'string' ? post.author : 'Usuario'),
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
        message: 'Feed obtenido correctamente'
      };
    } catch (error: any) {
      console.error('Error al obtener feed:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener feed',
        message: 'Error al obtener feed'
      };
    }
  },

  // Crear una nueva publicación con soporte para imágenes
  createPost: async (postData: CreatePostData, files?: File[]): Promise<ApiResponse<Post>> => {
    try {
      // Obtener el token usando la función importada
      const token = getToken();
      
      if (!token) {
        console.error('No hay token de autenticación disponible');
        return {
          success: false,
          error: 'No hay token de autenticación disponible. Por favor, inicia sesión nuevamente.',
          message: 'Error al crear publicación: No autenticado'
        };
      }
      
      // Si hay archivos, subirlos primero
      let media_urls: string[] = [];
      
      if (files && files.length > 0) {
        // Subir cada imagen y obtener sus URLs
        const uploadPromises = files.map(file => uploadImage(file));
        media_urls = await Promise.all(uploadPromises);
      }
      
      // Añadir las URLs de las imágenes a los datos del post
      const postWithMedia = {
        ...postData,
        media_urls: [...(postData.media_urls || []), ...media_urls]
      };
      
      // Configurar headers con el token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Crear el post con las imágenes
      const response = await axios.post(`${API_URL}/api/posts/`, postWithMedia, config);
      
      return {
        success: true,
        data: response.data,
        message: 'Publicación creada correctamente'
      };
    } catch (error: any) {
      console.error('Error al crear publicación:', error);
      
      // Mensaje de error más detallado
      let errorMessage = 'Error al crear publicación';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'No estás autorizado para crear publicaciones. Por favor, inicia sesión nuevamente.';
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
  }
};

export default postService;