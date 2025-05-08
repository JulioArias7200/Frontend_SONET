import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, CameraIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import userService from "@/api/services/userService";
import { User } from "@/types/models";

interface ProfileEditProps {
  user: User;
}

export function ProfileEdit({ user }: ProfileEditProps) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    bio: user?.bio || "",
    profile_image_url: user?.profile_image_url || ""
  });
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar si el usuario tiene un ID antes de hacer la petición
      if (!user._id) {
        throw new Error('No se puede actualizar el perfil: ID de usuario no disponible');
      }
      
      // Llamada al servicio para actualizar el perfil
      const userData = {
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        profile_image_url: profileData.profile_image_url
      };
      
      const response = await userService.updateUser(user._id, userData);
      
      if (response.success && response.data) {
        // Actualizar el usuario en el contexto de autenticación
        updateUser(response.data);
        setIsEditing(false);
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (err: any) {
      console.error('Error al guardar cambios:', err);
      setError(err.message || 'Ocurrió un error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData(prev => ({
            ...prev,
            avatar: event.target?.result as string
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setShowPhotoDialog(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="relative">
                <Avatar className="h-16 w-16 cursor-pointer">
                  <AvatarImage src={profileData.avatar} alt={profileData.username} />
                  <AvatarFallback>{profileData.username?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={() => setShowPhotoDialog(true)}
                >
                  <CameraIcon className="h-4 w-4" />
                </Button>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setShowPhotoDialog(true)}>Cambiar foto</ContextMenuItem>
              <ContextMenuItem onClick={() => setProfileData(prev => ({ ...prev, avatar: "" }))}>
                Eliminar foto
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <div>
            <h2 className="text-xl font-bold">{profileData.username || "Usuario"}</h2>
            <p className="text-sm text-muted-foreground">{profileData.email || "correo@ejemplo.com"}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={profileData.username} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Cambiar contraseña
                  </Button>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value="••••••••" 
                  disabled 
                />
              </div>
              <div>
                <Label htmlFor="bio">Biografía</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={profileData.bio} 
                  onChange={handleInputChange} 
                  placeholder="Cuéntanos sobre ti..." 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Nombre de usuario: <span className="font-normal">{profileData.username || "No definido"}</span></p>
              <p className="text-sm font-medium">Correo electrónico: <span className="font-normal">{profileData.email || "No definido"}</span></p>
              <p className="text-sm font-medium">Biografía:</p>
              <p className="text-sm">{profileData.bio || "Sin biografía"}</p>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Diálogo para cambiar contraseña */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y la nueva contraseña para actualizarla.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancelar</Button>
            <Button type="submit">Actualizar contraseña</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para cambiar foto */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar foto de perfil</DialogTitle>
            <DialogDescription>
              Selecciona una nueva imagen para tu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              id="avatar" 
              name="avatar" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}