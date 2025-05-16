import * as React from "react";
import { useEffect, useState } from "react";
import { ProfileEdit } from "@/components/profile/profile-edit";
import { useAuth } from "@/context/AuthContext";
import userService from "@/api/services/userService";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/models"; // Asegúrate de que este import exista

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Si la autenticación está cargando, esperamos
    if (authLoading) return;

    // Si no hay usuario después de cargar, redirigimos al login
    if (!user && !authLoading) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      if (user && user._id) {
        try {
          const response = await userService.getUserById(user._id);
          if (response.success && response.data) {
            setProfileData(response.data);
          } else {
            setError("No se pudo cargar la información del perfil");
          }
        } catch (err) {
          console.error("Error al cargar el perfil:", err);
          setError("Error al cargar el perfil");
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay ID de usuario pero hay usuario, usamos los datos del contexto
        setProfileData(user);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, authLoading, navigate]);

  // Mostramos carga mientras el contexto de autenticación o los datos del perfil están cargando
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando perfil...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      {(profileData || user) && <ProfileEdit user={profileData || user as User} />}
    </div>
  );
}