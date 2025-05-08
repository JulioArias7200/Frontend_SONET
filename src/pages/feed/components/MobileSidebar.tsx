import React from "react";
import { 
  HomeIcon, 
  UserIcon, 
  BellIcon, 
  MessageSquareIcon, 
  SearchIcon, 
  SettingsIcon,
  XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { NavItem } from "./NavItem";

export function MobileSidebar() {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <UserIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col h-full py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <XIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Red Social</span>
              <span className="text-xs text-muted-foreground">Plataforma</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Plataforma</h3>
          </div>
          
          <nav className="space-y-1 text-2xl">
            <NavItem icon={<HomeIcon className="mr-4 h-5 w-5" />} label="Inicio" to="/" />
            <NavItem icon={<SearchIcon className="mr-4 h-5 w-5" />} label="Explorar" to="/explore" />
            <NavItem icon={<BellIcon className="mr-4 h-5 w-5" />} label="Notificaciones" to="/notifications" />
            <NavItem icon={<MessageSquareIcon className="mr-4 h-5 w-5" />} label="Mensajes" to="/messages" />
            <NavItem icon={<UserIcon className="mr-4 h-5 w-5" />} label="Perfil" to="/profile" />
            <NavItem icon={<SettingsIcon className="mr-4 h-5 w-5" />} label="Configuración" to="/settings" />
          </nav>
          
          <Button className="w-full mt-4">Postear</Button>
          
          {/* Perfil de usuario en la parte inferior del sidebar móvil */}
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={user?.avatar || "https://i.pravatar.cc/150?img=3"} 
                    alt="Avatar" 
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.username || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}