import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/models';
import { saveToken, getToken, removeToken, hasToken } from '@/utils/tokenStorage';
import userService from '@/api/services/userService';
import authService from '@/api/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar si hay un token almacenado
        if (hasToken()) {
          console.log('Token encontrado, intentando recuperar sesión...');
          
          // Obtener información del usuario usando el token almacenado
          const response = await userService.getCurrentUser();
          
          if (response.success && response.data) {
            console.log('Sesión recuperada exitosamente');
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            console.log('Token inválido o expirado');
            // Si hay un token pero no se puede obtener el usuario, limpiar
            removeToken();
            setIsAuthenticated(false);
          }
        } else {
          console.log('No hay token almacenado');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        removeToken();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función para iniciar sesión
  const login = (token: string, userData: User) => {
    console.log('Guardando token y datos de usuario...');
    saveToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const logout = () => {
    console.log('Cerrando sesión...');
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};