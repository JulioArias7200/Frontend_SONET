import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, RefreshCw } from "lucide-react";
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
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Add this line

  // Función para cargar publicaciones
  const fetchPosts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      setError(null); // Limpiar errores previos
      
      console.log('Iniciando carga de publicaciones...');
      const response = await postService.getFeed();
      console.log('Respuesta de getFeed:', response);
      
      if (response.success && response.data) {
        // Verificar si response.data es un array
        let postsData = response.data;
        
        // Si no es un array, intentar extraer los posts
        if (!Array.isArray(postsData) && typeof postsData === 'object') {
          postsData = Object.values(postsData);
        }
        
        if (!Array.isArray(postsData)) {
          console.error('Formato de datos inesperado:', postsData);
          throw new Error('Formato de datos inesperado al cargar publicaciones');
        }
        
        // Ordenar posts por fecha (más recientes primero)
        const sortedPosts = [...postsData]
          .map(post => ({
            ...post,
            // Asegurar que las fechas estén en formato correcto
            created_at: post.created_at || new Date().toISOString()
          }))
          .sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        
        console.log('Publicaciones ordenadas:', sortedPosts);
        setPosts(sortedPosts);
        setError(null);
        setLastRefresh(new Date());
      } else {
        console.error('Error en la respuesta del servidor:', response);
        setError(response.error || "No se pudieron cargar las publicaciones");
      }
    } catch (err: any) {
      console.error("Error detallado al cargar publicaciones:", {
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      
      const errorMessage = err.response?.data?.message || err.message || "Error al cargar las publicaciones";
      setError(errorMessage);
      
      // Mostrar mensaje más descriptivo en consola
      if (err.response) {
        console.error('Error del servidor:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      }
      
      // Datos de prueba como fallback solo si no hay posts y estamos en desarrollo
      if (posts.length === 0 && import.meta.env.DEV) {
        console.warn('Usando datos de prueba como fallback');
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
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar publicaciones inicialmente
  useEffect(() => {
    console.log("Estado de autenticación:", { isAuthenticated, user });
    fetchPosts();
  }, []);

  // Actualizar periódicamente (cada 30 segundos) solo si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const intervalId = setInterval(() => {
      console.log("Actualizando feed automáticamente...");
      fetchPosts(false);
    }, 30000); // 30 segundos
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Función para actualizar manualmente
  const handleRefresh = () => {
    fetchPosts(false);
  };

  // Crear nueva publicación
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null); // Limpiar errores anteriores

      console.log("Intentando crear post con contenido:", newPostContent);

      // Guardar el contenido antes de limpiarlo
      const contentToPost = newPostContent;

      // Limpiar el campo de texto inmediatamente para mejor UX
      setNewPostContent("");

      // Modificar esta línea para incluir los archivos seleccionados
      const response = await postService.createPost(
        { content: contentToPost },
        selectedFiles // Pass the selected files here
      );

      console.log("Respuesta del servidor:", response);

      if (response.success) {
        // Limpiar los archivos seleccionados después de una creación exitosa
        setSelectedFiles([]);

        // Crear un nuevo post temporal para mostrar inmediatamente
        if (response.data) {
          const newPost: Post = {
            _id: response.data._id || Date.now().toString(),
            user_id: user?._id || 'temp-user-id',
            username: user?.username || 'Usuario',
            content: contentToPost,
            created_at: new Date().toISOString(),
            likes_count: 0,
            comments_count: 0,
            user_profile_pic: user?.profile_pic_url || ''
          };

          // Añadir el nuevo post al principio del feed
          setPosts(prevPosts => [newPost, ...prevPosts]);

          console.log("Post añadido temporalmente al feed");
        }

        // Actualizar el feed completo después de un breve retraso
        setTimeout(() => {
          fetchPosts(false);
        }, 1000);

        console.log("Post creado exitosamente");
      } else {
        console.error("Error en la respuesta:", response);
        setError(response.message || "No se pudo crear la publicación. Intenta de nuevo más tarde.");
      }
    } catch (err: any) {
      console.error("Error detallado al crear publicación:", err);

      // Mostrar mensaje de error más específico
      if (err.response) {
        console.error("Detalles de la respuesta:", err.response.data);
        setError(`Error (${err.response.status}): ${err.response.data?.message || err.message || "Error al crear la publicación"}`);
      } else if (err.request) {
        setError("No se recibió respuesta del servidor. Verifica tu conexión a internet.");
      } else {
        setError(err.message || "Error al crear la publicación");
      }
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
      {/* Botón de actualización manual */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Última actualización: {formatDate(lastRefresh.toISOString())}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className={refreshing ? "animate-spin" : ""}
        >
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* Área para crear nueva publicación */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Crear nueva publicación</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="¿Qué estás pensando?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
            {/* Input para seleccionar archivos */}
            <input 
              type="file" 
              multiple 
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} // Add this line to handle file selection
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isSubmitting}
            />
             {/* Mostrar nombres de archivos seleccionados */}
             {selectedFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Archivos seleccionados: {selectedFiles.map(file => file.name).join(', ')}
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleCreatePost} disabled={!newPostContent.trim() || isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {/* Mostrar indicador de carga o publicaciones */}
      {loading ? (
        <div className="text-center py-8">Cargando publicaciones...</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post._id}>
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user_profile_pic || "https://i.pravatar.cc/150"} />
                <AvatarFallback>{post.username?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.username || 'Usuario Desconocido'}</p>
                <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {post.media_urls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Media ${index + 1}`} 
                      className="rounded-md object-cover w-full h-48"
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart size={16} /> {post.likes_count || 0}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageSquare size={16} /> {post.comments_count || 0}
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">No hay publicaciones disponibles.</div>
      )}
    </div>
  );
}