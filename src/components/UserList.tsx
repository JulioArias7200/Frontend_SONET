import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '@/api/services/userService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        if (response.success && response.data) {
          setUsers(response.data);
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
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await userService.searchUsers(searchQuery);
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError('No se encontraron usuarios');
      }
    } catch (err: any) {
      console.error('Error en la búsqueda:', err);
      setError(err.message || 'Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = searchQuery.trim() 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <SearchIcon className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-4">No se encontraron usuarios</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(user => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{user.bio || "Sin biografía"}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/profile/${user.id}`}>Ver perfil</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;