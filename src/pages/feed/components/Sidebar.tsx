import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  UserIcon, 
  BellIcon, 
  MessageSquareIcon, 
  SearchIcon, 
  SettingsIcon,
  XIcon,
  LogOutIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { NavItem } from "./NavItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  // Obtener iniciales del usuario para el avatar fallback
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="hidden md:flex flex-col w-64 border-r h-full">
      <div className="p-4 flex flex-col h-full">
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
        
        <nav className="space-y-1">
          <NavItem icon={<HomeIcon className="mr-3 h-5 w-5" />} label="Inicio" to="/" />
          <NavItem icon={<SearchIcon className="mr-3 h-5 w-5" />} label="Explorar" to="/explore" />
          <NavItem icon={<BellIcon className="mr-3 h-5 w-5" />} label="Notificaciones" to="/notifications" />
          <NavItem icon={<MessageSquareIcon className="mr-3 h-5 w-5" />} label="Mensajes" to="/messages" />
          <NavItem icon={<UserIcon className="mr-3 h-5 w-5" />} label="Perfil" to="/profile" />
          <NavItem icon={<SettingsIcon className="mr-3 h-5 w-5" />} label="Configuración" to="/settings" />
        </nav>
        
        <Button className="w-full mt-4">Postear</Button>
        
        {/* Perfil de usuario en la parte inferior del sidebar */}
        <div className=" bottom-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage 
                    src={user?.profile_pic_url || "https://i.pravatar.cc/150?img=3"} 
                    alt="Avatar" 
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-medium text-sm">{user?.username || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user?.bio || "Sin biografía"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  // Usar isAuthenticated en lugar de verificar user._id
                  if (isAuthenticated) {
                    navigate('/profile');
                  } else {
                    // Si no hay usuario autenticado, redirigir al login
                    navigate('/home');
                  }
                }}
                title="Ver y editar perfil"
              >
                <UserIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}