import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { FeedHeader } from "./components/FeedHeader";
import { FeedContent } from "@/components/feed/feed-content";
import { RightPanel } from "./components/RightPanel";
import { MobilePostButton } from "./components/MobilePostButton";

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
    <div className="grid grid-cols-[auto_1fr_auto] bg-background w-full max-w-screen-2xl mx-auto">
      {/* Sidebar para pantallas medianas y grandes - Fijo */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar />
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col min-h-screen">
        {/* Encabezado */}
        <FeedHeader />
        
        {/* Contenido del feed */}
        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-4">
            <FeedContent />
          </div>
        </main>
        
        {/* Botón flotante para postear en móvil */}
        <MobilePostButton />
      </div>
      
      {/* Panel derecho (solo visible en pantallas grandes) - Fijo */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <RightPanel />
      </div>
    </div>
  );
}