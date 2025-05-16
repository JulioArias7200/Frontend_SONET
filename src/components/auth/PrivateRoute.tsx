import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rutas para usuarios autenticados
 * Redirige a /login si el usuario no está autenticado
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando...</span>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}