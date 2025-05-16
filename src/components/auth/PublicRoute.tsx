import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rutas públicas
 * Redirige a /feed si el usuario ya está autenticado
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando...</span>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : null;
}