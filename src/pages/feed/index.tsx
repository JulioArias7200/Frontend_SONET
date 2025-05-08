import * as React from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { FeedHeader } from "./components/FeedHeader";
import { FeedContent } from "@/components/feed/feed-content";
import { RightPanel } from "./components/RightPanel";
import { MobilePostButton } from "./components/MobilePostButton";

export default function FeedPage() {
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
        <main className="flex-1 overflow-y-scroll">
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