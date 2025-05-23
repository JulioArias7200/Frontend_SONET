import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileEdit } from "./profile-edit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Squares from '@/components/ui/Squares';

const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"perfil" | "editar">("perfil");

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

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando perfil...</span>
      </div>
    );
  }

  // Si no está autenticado, redirigir al inicio
  if (!isAuthenticated) {
    navigate('/home');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto">
      {/* Fondo con cuadrados animados */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Squares 
          speed={0.1} 
          squareSize={80}
          direction='down'
          borderColor='#261893'
          hoverFillColor='#261893'
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-4xl mx-auto bg-background/20 backdrop-blur-sm border border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border border-purple-500/50">
                  <AvatarImage 
                    src={user?.profile_pic_url || "https://i.pravatar.cc/150?img=3"} 
                    alt={user?.username || "Usuario"} 
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user?.username || "Usuario"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email || "correo@ejemplo.com"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate('/feed')} title="Volver al feed">
                  <UserIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleLogout} title="Cerrar sesión">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                {/* Botones de navegación */}
                <div className="grid w-full grid-cols-2 gap-2 mb-6 bg-background/30 rounded-lg p-1">
                  <Button 
                    variant={activeView === "perfil" ? "default" : "ghost"} 
                    onClick={() => setActiveView("perfil")}
                    className="rounded-md"
                  >
                    Perfil
                  </Button>
                  <Button 
                    variant={activeView === "editar" ? "default" : "ghost"} 
                    onClick={() => setActiveView("editar")}
                    className="rounded-md"
                  >
                    Editar Perfil
                  </Button>
                </div>
                
                {/* Contenido de la vista de perfil */}
                {activeView === "perfil" && (
                  <div className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-background/30 border border-purple-500/20">
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Información Personal</h3>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Nombre de usuario: <span className="font-normal">{user?.username || "No definido"}</span></p>
                            <p className="text-sm font-medium">Correo electrónico: <span className="font-normal">{user?.email || "No definido"}</span></p>
                            <p className="text-sm font-medium">Biografía:</p>
                            <p className="text-sm">{user?.bio || "Sin biografía"}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background/30 border border-purple-500/20">
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Estadísticas</h3>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-background/20 rounded-lg">
                              <p className="text-2xl font-bold">0</p>
                              <p className="text-sm text-muted-foreground">Publicaciones</p>
                            </div>
                            <div className="text-center p-3 bg-background/20 rounded-lg">
                              <p className="text-2xl font-bold">0</p>
                              <p className="text-sm text-muted-foreground">Seguidores</p>
                            </div>
                            <div className="text-center p-3 bg-background/20 rounded-lg">
                              <p className="text-2xl font-bold">0</p>
                              <p className="text-sm text-muted-foreground">Siguiendo</p>
                            </div>
                            <div className="text-center p-3 bg-background/20 rounded-lg">
                              <p className="text-2xl font-bold">0</p>
                              <p className="text-sm text-muted-foreground">Me gusta</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {/* Contenido de la vista de edición */}
                {activeView === "editar" && (
                  <div className="mt-6">
                    {user && <ProfileEdit user={user} />}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;