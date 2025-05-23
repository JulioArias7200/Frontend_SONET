import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import userService from "@/api/services/userService";

interface ProfileEditProps {
  user: User;
}

export function ProfileEdit({ user }: ProfileEditProps) {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    profile_pic_url: user.profile_pic_url || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateUser(user._id, formData);
      
      if (response.success) {
        // Actualizar el contexto de autenticación con los nuevos datos
        updateUser(response.data);
        toast.success("Perfil actualizado correctamente");
      } else {
        toast.error(response.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-background/30 border border-purple-500/20 ">
      <CardHeader>
        <h3 className="text-lg font-semibold">Editar Perfil</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nombre de usuario"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              disabled
            />
            <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile_pic_url">URL de imagen de perfil</Label>
            <Input
              id="profile_pic_url"
              name="profile_pic_url"
              value={formData.profile_pic_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={4}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}