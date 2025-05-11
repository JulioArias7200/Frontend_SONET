import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchIcon, UserIcon } from "lucide-react";
import { TrendingTopic } from "./TrendingTopic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userService from "@/api/services/userService";

// Definir la interfaz para el usuario
interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  bio?: string;
}

export function RightPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Intentar obtener usuarios de la API con el token JWT
        try {
          console.log('Obteniendo usuarios de la API con token JWT...');
          const token = localStorage.getItem('token'); // O como sea que almacenes tu token
          console.log('Token disponible:', !!token);
          
          // Verificar si el backend está disponible antes de hacer la solicitud
          try {
            await fetch('http://localhost:5000/api/health', { method: 'HEAD' });
          } catch (healthError) {
            console.error('El servidor backend no está disponible:', healthError);
            throw new Error('El servidor backend no está disponible');
          }
          
          const response = await userService.getAllUsers();
          
          if (response.success && response.data) {
            console.log('Usuarios obtenidos correctamente:', response.data.length);
            setUsers(response.data);
            setLoading(false);
            return;
          } else {
            console.error('Error en la respuesta de la API:', response.message);
            throw new Error(response.message || 'Error al obtener usuarios');
          }
        } catch (apiError: any) {
          console.error('Error al obtener usuarios de la API:', apiError);
          
          // Si el error es de autenticación (401), mostrar mensaje específico
          if (apiError.response && apiError.response.status === 401) {
            setError('No autorizado. Por favor, inicia sesión nuevamente.');
            setLoading(false);
            return;
          }
          
          // Continuar con los datos de prueba si falla la API por otras razones
          console.log('Usando datos de prueba para usuarios debido a error en la API');
          
          // Datos de prueba como fallback
          const mockUsers: User[] = [
            {
              _id: '1',
              username: 'usuario1',
              email: 'usuario1@ejemplo.com',
              profile_pic_url: 'https://i.pravatar.cc/150?img=1',
              bio: 'Desarrollador web'
            },
            {
              _id: '2',
              username: 'usuario2',
              email: 'usuario2@ejemplo.com',
              profile_pic_url: 'https://i.pravatar.cc/150?img=2',
              bio: 'Diseñador UX/UI'
            },
            {
              _id: '3',
              username: 'usuario3',
              email: 'usuario3@ejemplo.com',
              profile_pic_url: 'https://i.pravatar.cc/150?img=3',
              bio: 'Estudiante de informática'
            },
            {
              _id: '4',
              username: 'usuario4',
              email: 'usuario4@ejemplo.com',
              profile_pic_url: 'https://i.pravatar.cc/150?img=4',
              bio: 'Entusiasta de la tecnología'
            },
            {
              _id: '5',
              username: 'usuario5',
              email: 'usuario5@ejemplo.com',
              profile_pic_url: 'https://i.pravatar.cc/150?img=5',
              bio: 'Fotógrafo aficionado'
            }
          ];
          
          setUsers(mockUsers);
          // Cambiar el mensaje de error para que sea menos alarmante
          setError('Usando datos de ejemplo mientras se conecta al servidor.');
        }
      } catch (err: any) {
        console.error('Error general al cargar usuarios:', err);
        setError(err.message || 'Error al cargar la lista de usuarios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filtrar usuarios según la búsqueda
  const filteredUsers = searchQuery.trim() 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="hidden lg:block w-80 border-l h-full p-4 overflow-y-auto">
      <div className="flex mb-4">
        <Input  
          placeholder="Buscar usuarios..." 
          className="flex-1"
          value={searchQuery}
          onChange={handleSearchChange}
          icon={<SearchIcon className="h-4 w-4 ml-2" />}
        />
      </div>
      
      {/* Sección de usuarios */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <h2 className="font-bold text-lg mb-2 flex items-center">
          <UserIcon className="h-5 w-5 mr-2" />
          Usuarios
        </h2>
        
        {loading ? (
          <div className="text-center py-2 text-sm">Cargando usuarios...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-2 text-sm">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-2 text-sm">No se encontraron usuarios</div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.slice(0, 5).map(user => (
              <div key={user._id || user.id} className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={`/profile/${user._id || user.id}`}>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                          <AvatarImage src={user.profile_pic_url} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver perfil de {user.username}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${user._id || user.id}`} className="hover:underline">
                    <p className="font-medium text-sm truncate">{user.username}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 hover:bg-primary hover:text-primary-foreground"
                >
                  Seguir
                </Button>
              </div>
            ))}
            
            {filteredUsers.length > 5 && (
              <Button variant="ghost" className="w-full text-primary justify-start p-0 h-auto text-sm">
                Ver más usuarios
              </Button>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}