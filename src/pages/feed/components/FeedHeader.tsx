import React from "react";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";

export function FeedHeader() {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Botón de menú móvil */}
          <MobileSidebar />
          
        </div>
        
        <div className="flex items-center">
          {/* Espacio para otros elementos del header */}
        </div>
      </div>
      
      <div className="flex mt-4">
        <Button variant="ghost" className="flex-1 rounded-none border-b-2 border-primary">
          Siguiendo
        </Button>
        <Button variant="ghost" className="flex-1 rounded-none">
          Para ti
        </Button>
      </div>
    </header>
  );
}