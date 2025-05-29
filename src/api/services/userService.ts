import apiClient from '../apiClient';
import Cookies from 'js-cookie';
interface User{
  user_id:string|null;
  username:string|null;
  email:string|null;
} 
// Definir getCurrentUser como función independiente
export const getCurrentUser = async () => {
  try {
    // Modificar esta línea para usar la ruta correcta del backend
    const token:string|undefined = await Cookies.get('auth_token');
    console.info("noooooooooooooooooooooooooo")

    const user:User|null = {
      user_id:localStorage.getItem('user_id'),
      username:localStorage.getItem('username'),
      email:localStorage.getItem('email')
    }
    
    return {
      success: true,
      data: user,
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
};

const userService = {
  // Referencia a la función independiente
  getCurrentUser,
  
  // Obtener usuario por ID
  getUserByUsername: async (username:any) => {
    try {

      const response = await apiClient.get(`/api/users/${username}`);
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
  // Esta función podría no tener un endpoint correspondiente en el backend
  getAllUsers: async (): Promise<any> => {
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
  updateUser: async (userData: Partial<any>): Promise<any> => {
    try {
      const response = await apiClient.put('/api/users/profile', userData);
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
  searchUsers: async (query: string): Promise<any> => {
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

/**
 * Obtiene usuarios recomendados para el usuario actual
 * @returns Lista de usuarios recomendados
 */
const getRecommendedUsers = async () => {
  try {
    const response = await apiClient.get('/api/users/recommend');
    
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Usuarios recomendados obtenidos correctamente'
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data.message || 'Error al obtener usuarios recomendados'
      };
    }
  } catch (error: any) {
    console.error('Error en getRecommendedUsers:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Error al obtener usuarios recomendados'
    };
  }
};

// Asegúrate de que getRecommendedUsers esté incluido en el export
export default {
  ...userService,
  getRecommendedUsers,
};