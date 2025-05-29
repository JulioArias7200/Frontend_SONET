import React, { useEffect, useState } from "react";
import userService from "@/api/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserSearchBox } from "@/components/UserSearchBox";
import { useAuth } from "@/context/AuthContext";

interface RecommendedUser {
  _id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  bio?: string;
}

export function RightPanel() {
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getRecommendedUsers();
        
        if (response.success && response.data) {
          setRecommendedUsers(response.data);
          setError(null);
        } else {
          setError(response.message || "Error al cargar usuarios recomendados");
        }
      } catch (err: any) {
        setError("Error al cargar usuarios recomendados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, []);

  return (
    <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
      <UserSearchBox users={recommendedUsers} />
      <h2 className="text-xl font-bold mb-4 text-white">Usuarios Recomendados</h2>
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-center py-2">
          {error}
        </div>
      )}
      
      {!loading && recommendedUsers.length === 0 && !error && (
        <div className="text-gray-400 text-center py-2">
          No hay recomendaciones disponibles
        </div>
      )}
      
      <div className="space-y-3">
        {recommendedUsers.map((user) => (
          <Card key={user._id} className="p-3 bg-purple-900/30 border border-purple-500/30 hover:bg-purple-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-purple-500/50">
                <AvatarImage 
                  src={user.profile_pic_url || "https://via.placeholder.com/40"} 
                  alt={user.username}
                />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                {user.bio && (
                  <p className="text-xs text-gray-400 truncate">{user.bio}</p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-500/50 hover:bg-purple-500/20 text-purple-300"
              >
                Seguir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}