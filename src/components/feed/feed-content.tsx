import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, Send } from "lucide-react";
import postService from "@/api/services/postService";
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
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar publicaciones
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getFeed();
        
        if (response.success && response.data) {
          setPosts(response.data);
        } else {
          setError("No se pudieron cargar las publicaciones");
        }
      } catch (err: any) {
        console.error("Error al cargar publicaciones:", err);
        setError(err.message || "Error al cargar las publicaciones");
        
        // Datos de prueba como fallback
        const mockPosts: Post[] = [
          {
            _id: "1",
            user_id: "1",
            username: "usuario1",
            content: "¡Hola mundo! Esta es mi primera publicación.",
            created_at: new Date().toISOString(),
            likes_count: 5,
            comments_count: 2,
            user_profile_pic: "https://i.pravatar.cc/150?img=1"
          },
          {
            _id: "2",
            user_id: "2",
            username: "usuario2",
            content: "Compartiendo algunos pensamientos interesantes sobre desarrollo web.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes_count: 10,
            comments_count: 3,
            user_profile_pic: "https://i.pravatar.cc/150?img=2"
          }
        ];
        
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Crear nueva publicación
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await postService.createPost({
        content: newPostContent
      });
      
      if (response.success && response.data) {
        // Añadir la nueva publicación al inicio del array
        setPosts(prevPosts => [response.data, ...prevPosts]);
        setNewPostContent(""); // Limpiar el campo
      } else {
        setError("No se pudo crear la publicación");
      }
    } catch (err: any) {
      console.error("Error al crear publicación:", err);
      setError(err.message || "Error al crear la publicación");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Formulario para crear nueva publicación */}
      {isAuthenticated && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profile_pic_url} alt={user?.username} />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-medium">¿Qué estás pensando?</span>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Comparte tus pensamientos..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              {/* Aquí podrían ir botones para adjuntar imágenes, etc. */}
            </div>
            <Button 
              onClick={handleCreatePost} 
              disabled={isSubmitting || !newPostContent.trim()}
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-10">
          <p>Cargando publicaciones...</p>
        </div>
      )}
      
      {/* Lista de publicaciones */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-10">
          <p>No hay publicaciones para mostrar.</p>
        </div>
      )}
      
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