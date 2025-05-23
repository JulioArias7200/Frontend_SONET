import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { FeedContent } from "@/components/feed/feed-content";
import { RightPanel } from "./components/RightPanel";
import { MobilePostButton } from "./components/MobilePostButton";
import Squares from '@/components/ui/Squares';
  

export default function FeedPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si la autenticación está cargando, esperamos
    if (loading) return;

    // Si no hay autenticación después de cargar, redirigimos al login
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostramos carga mientras el contexto de autenticación está cargando
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando feed...</span>
      </div>
    );
  }

  // Si no está autenticado, no renderizamos el contenido
  if (!isAuthenticated) {
    return null; // Esto evita un flash del contenido antes de la redirección
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Componente Squares como fondo fijo */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Squares 
          speed={0.1} 
          squareSize={80}
          direction='down'
          borderColor='#261893'
          hoverFillColor='#261893'
        />
      </div>
      
      {/* Contenedor principal con distribución específica */}
      <div className="fixed inset-0 z-10 mx-auto w-full max-w-full lg:max-w-[1980px] py-4">
        <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-3 sm:gap-4">
          {/* Sidebar - 25% */}
          <div className="hidden md:block bg-blue-900/10  rounded-xl shadow-xl p-3 h-full overflow-hidden border border-blue-500/30">
            <Sidebar />
          </div>
          
          {/* Contenido principal - 50% */}
          <div className="flex flex-col bg-indigo-800/15  rounded-xl shadow-xl p-3 border border-indigo-500/30 h-full overflow-hidden">
            {/* Contenido del feed con scroll */}
            <main className="flex-1 overflow-y-scroll overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-900/20">
              <FeedContent />
            </main>
          </div>
          
          {/* Panel derecho - 25% */}
          <div className="hidden md:block bg-purple-900/15  rounded-xl shadow-xl  h-full overflow-hidden border border-purple-500/30">
            <RightPanel />
          </div>
        </div>
        
        {/* Botón flotante para postear en móvil */}
        <MobilePostButton />
      </div>
    </div>
  );
}