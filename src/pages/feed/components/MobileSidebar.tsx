import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedList from "@/components/ui/AnimatedList";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { NavItem } from "./NavItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileSidebar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Manejar cierre de sesión
  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  // Obtener iniciales del usuario para el avatar fallback
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.substring(0, 2).toUpperCase();
  };
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10']; 

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
  
            <AnimatedList
              items={items}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
            <NavItem icon={<HomeIcon className="mr-4 h-5 w-5" />} label="Inicio" to="/" />
            <NavItem icon={<SearchIcon className="mr-4 h-5 w-5" />} label="Explorar" to="/explore" />
            <NavItem icon={<BellIcon className="mr-4 h-5 w-5" />} label="Notificaciones" to="/notifications" />
            <NavItem icon={<MessageSquareIcon className="mr-4 h-5 w-5" />} label="Mensajes" to="/messages" />
            <NavItem icon={<UserIcon className="mr-4 h-5 w-5" />} label="Perfil" to="/profile" />
            <NavItem icon={<SettingsIcon className="mr-4 h-5 w-5" />} label="Configuración" to="/settings" />
          </nav>
          
          <Button 
            className="w-full mt-4"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/feed');
              } else {
                navigate('/home');
              }
            }}
          >
            Postear
          </Button>
          
          {/* Perfil de usuario en la parte inferior del sidebar móvil */}
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {loading ? (
                    <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse"></div>
                  ) : (
                    <Avatar>
                      <AvatarImage 
                        src={user?.profile_pic_url || user?.avatar || "https://i.pravatar.cc/150?img=3"} 
                        alt="Avatar" 
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div>
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-sm">{user?.username || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/profile');
                    } else {
                      navigate('/home');
                    }
                  }}
                  title="Ver y editar perfil"
                >
                  <UserIcon className="h-4 w-4" />
                </Button>
                {isAuthenticated && (
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
                    <LogOutIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}