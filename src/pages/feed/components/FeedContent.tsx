import React, { useEffect, useState } from "react";
import postService from "@/api/services/postService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
  _id: string;
  user_id: string;
  username?: string;
  content: string;
  media_urls?: string[];
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  user_profile_pic?: string;
}

export function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(15000); // 15 segundos por defecto

  const fetchPosts = async () => {
    try {
      // Esta función llama a /api/posts/ (con barra al final)
      const response = await postService.getAllPosts(); 
      console.log("Respuesta de posts:", response);
      
      if (response.success && response.data) {
        setPosts(response.data);
        setError(null);
      } else {
        setError(response.message || "No se pudieron cargar los posts."); // Usar response.message si existe
      }
    } catch (err: any) {
      console.error("Error al cargar publicaciones:", err);
      setError(err.message || "Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para la carga inicial
  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, []);

  // Efecto para la actualización periódica
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Actualizando feed...");
      fetchPosts();
    }, refreshInterval);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      return "fecha desconocida";
    }
  };

  if (loading && posts.length === 0) return <div className="text-center py-10">Cargando posts...</div>;
  if (error && posts.length === 0) return <div className="bg-red-100 text-red-800 p-3 rounded-md">{error}</div>;
  if (!posts || posts.length === 0) return <div className="text-center py-10">No hay publicaciones para mostrar.</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user_profile_pic} alt={post.username} />
                <AvatarFallback>{post.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.username || "Usuario"}</div>
                <div className="text-xs text-muted-foreground">{formatDate(post.created_at)}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{post.content}</p>
            
            {/* Mostrar imágenes si existen */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="mt-3 grid gap-2 grid-cols-1">
                {post.media_urls.map((url, index) => (
                  <img 
                    key={index} 
                    src={url} 
                    alt={`Imagen ${index + 1}`} 
                    className="rounded-md max-h-96 w-auto object-cover"
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-3">
            <div className="flex justify-between w-full">
              <Button variant="ghost" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes_count || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments_count || 0}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}