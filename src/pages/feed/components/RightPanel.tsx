import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchIcon, UserIcon } from "lucide-react";
import { TrendingTopic } from "./TrendingTopic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Definir la interfaz para el usuario
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
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
        // Llamada a la API para obtener usuarios
        const response = await fetch('http://localhost:5000/api/users', {
          credentials: 'include' // Importante para enviar cookies
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setUsers(data.data);
        } else {
          setError('No se pudieron cargar los usuarios');
        }
      } catch (err: any) {
        console.error('Error al cargar usuarios:', err);
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
              <div key={user.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                  <Link to={`/profile/${user.id}`}>Ver</Link>
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
      
      {/* Sección de tendencias */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">Qué está pasando</h2>
        
        <div className="space-y-4">
          <TrendingTopic category="Deportes" topic="Tigres" posts="8.891" />
          <TrendingTopic category="Gaming" topic="Nintendo" posts="132 mil" />
          <TrendingTopic category="Deportes" topic="Bilbao" posts="110 mil" />
          <TrendingTopic category="Tendencias" topic="Kick" posts="111 mil" showSeparator={false} />
          
          <Button variant="ghost" className="w-full text-primary justify-start p-0 h-auto">
            Mostrar más
          </Button>
        </div>
      </div>
    </div>
  );
}