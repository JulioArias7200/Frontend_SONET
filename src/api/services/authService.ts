import apiClient from '../apiClient';
import Cookies from "js-cookie"

interface LoginData {
  username_or_email: string;
  password: string;
}

const authService = {
  // Iniciar sesión
  login: async (data: LoginData): Promise<any> => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      const user = await response.data.user
      Cookies.set('auth_token',response.data.token);
      localStorage.setItem('user_id',user.id);
      localStorage.setItem('username',user.username);
      localStorage.setItem('email',user.email);
      return {
        success: true,
        data: response.data,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
        message: 'Error al iniciar sesión'
      };
    }
  },

  // Registrar usuario
  signup: async (data: FormData): Promise<any> => {
    try {
      const response = await apiClient.post('/api/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const user = await response.data.user;
      Cookies.set('auth_token',response.data.token);
      localStorage.setItem('user_id',user.id);
      localStorage.setItem('username',user.username);
      localStorage.setItem('email',user.email);
      return {
        success: true,
        data: response.data,
        message: 'Registro exitoso'
      };
    } catch (error: any) {
      console.error('Error en signup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario',
        message: 'Error al registrar usuario'
      };
    }
  },

  // Verificar token
  verifyToken: async () => {
      const token:string|undefined = await Cookies.get("auth_token");
      return token != undefined;
  }
};

export default authService;