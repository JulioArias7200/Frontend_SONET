import { useEffect, useState,useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, RefreshCw, X,ImageIcon as FileIcon } from "lucide-react";
import postService from "@/api/services/postService";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Importar DialogDescription
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Trash2, Edit } from "lucide-react"; // Importar iconos para editar y eliminar

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
  liked_by_me?: boolean; // Añadimos esta propiedad para saber si el usuario actual ha dado like
}

interface Comment {
  _id: string;
  post_id: string;
  username: string;
  profile_pic_url: string;
  text_comment: string; // Aseguramos que sea string
  created_at: string;
}

interface PostFormData {
  content: string;
  files: File[];
  previews: string[];
}
interface ApiResponse {
  success: boolean;
  message?: string;
  post?: any;
  error?: string;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Estados para el modal de comentarios
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState<string | null>(null); // ID del post que está recibiendo like

  // Estados para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Función para manejar la eliminación de una publicación
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await postService.deletePost(postToDelete);
      if (response.success) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
        setShowDeleteConfirm(false);
        setPostToDelete(null);
        console.log("Publicación eliminada exitosamente.");
      } else {
        console.error("Error al eliminar publicación:", response.error);
        setError(response.error || "No se pudo eliminar la publicación.");
      }
    } catch (err: any) {
      console.error("Error detallado al eliminar publicación:", err);
      setError(err.message || "Error al eliminar la publicación.");
    }
  };

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteConfirm = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  // Función para abrir el modal de edición
  const openEditModal = (post: Post) => {
    setPostToEdit(post);
    setEditedContent(post.content);
    setShowEditModal(true);
  };

  // Función para manejar la edición de una publicación
  const closeEditModal = () => {
    setPostToEdit(null);
    setEditedContent('');
    setShowEditModal(false);
  };
  const handleEditPost = async () => {
    if (!postToEdit) return;

    try {
      const response = await postService.editPost(postToEdit._id, editedContent);
      if (response.success) {

        setPosts(posts.map(post =>
          post._id === postToEdit._id ? { ...post, content: editedContent } : post
        ));
        closeEditModal();
      } else {
        console.error('Error editing post:', response.message);
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  // manejo de imagenes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PostFormData>({
    content: '',
    files: [],
    previews: []
  });

  const handleContentChange = (e:any) => {
    setFormData({ ...formData, content: e.target.value });
  };
  
  const handleFileChange = (e:any) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles],
        previews: [...formData.previews, ...newPreviews]
      });
    }
  };
  const removeFile = (index: number) => {
      const updatedFiles = [...formData.files];
      const updatedPreviews = [...formData.previews];
      
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
      
      setFormData({
        ...formData,
        files: updatedFiles,
        previews: updatedPreviews
      });
    };

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
        let postsData = response.data;

        if (!Array.isArray(postsData) && typeof postsData === 'object') {
          postsData = Object.values(postsData);
        }

        if (!Array.isArray(postsData)) {
          console.error('Formato de datos inesperado:', postsData);
          throw new Error('Formato de datos inesperado al cargar publicaciones');
        }

        const sortedPosts = [...postsData]
          .map(post => ({
            ...post,
            created_at: post.created_at || new Date().toISOString(),
            liked_by_me: post.liked_by_me || false
          }))
          .sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        // Fetch like status for each post if authenticated
        if (isAuthenticated && user) {
          const postsWithLikeStatus = await Promise.all(sortedPosts.map(async (post) => {
            try {
              const likeStatus = await postService.checkLikeStatus(post._id);
              return { ...post, liked_by_me: likeStatus.success && likeStatus.data ? likeStatus.data.liked : false };
            } catch (err) {
              console.error(`Error al verificar like para post ${post._id}:`, err);
              return { ...post, liked_by_me: false }; // Default to false on error
            }
          }));
          setPosts(postsWithLikeStatus);
        } else {
          setPosts(sortedPosts);
        }

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
  }, [isAuthenticated, user]); // Dependencias añadidas

  // Actualizar periódicamente (cada 30 segundos) solo si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      console.log("Actualizando feed automáticamente...");
      fetchPosts(false);
    }, 500000); // 30 segundos

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Función para actualizar manualmente
  const handleRefresh = () => {
    fetchPosts(false);
  };

  // Manejar selección de archivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  // Crear nueva publicación
  const handleCreatePost = async () => {
    try {
      setIsSubmitting(true);
      setError(null); // Limpiar errores anteriores
      
      const contentToPost = newPostContent;
      setNewPostContent("");

      const response = await postService.createPost(formData);

      console.log("Respuesta del servidor:", response);

      if (response.success) {
        setSelectedFiles([]);

        if (response.data) {
          console.log(user)
          const newPost: Post = {
            _id: response.data._id || Date.now().toString(),
            user_id: user?.user_id || 'temp-user-id',
            username: user?.username || 'Usuario',
            content: contentToPost,
            media_urls: response.data.media_urls, // Incluir URLs de medios de la respuesta
            created_at: new Date().toISOString(),
            likes_count: 0,
            comments_count: 0,
            user_profile_pic: user?.profile_pic_url || ''
          };

          setPosts(prevPosts => [newPost, ...prevPosts]);
          console.log("Post añadido temporalmente al feed");
        }

        setTimeout(() => {
          fetchPosts(false);
        }, 1000);
        setFormData({
          content: '',
          files: [],
          previews: []
        });


        console.log("Post creado exitosamente");
      } else {
        console.error("Error en la respuesta:", response);
        setError(response.message || "No se pudo crear la publicación. Intenta de nuevo más tarde.");
      }
    } catch (err: any) {
      console.error("Error detallado al crear publicación:", err);

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

  // Función para abrir el modal de comentarios
  const handleOpenComments = async (post: Post) => {
    setSelectedPost(post);
    setCommentsModalOpen(true);
    setLoadingComments(true);
    setComments([]);

    try {
      const response = await postService.getComments(post._id);
      if (response.success && response.data) {
        // Asegurarse de que text_comment sea string
        const formattedComments = response.data.map((comment: any) => ({
          ...comment,
          text_comment: typeof comment.text_comment === 'object' && comment.text_comment !== null
            ? comment.text_comment.text_comment // Acceder a la propiedad correcta si es un objeto
            : String(comment.text_comment) // Convertir a string si no es un objeto o es null/undefined
        }));
        setComments(formattedComments);
      } else {
        console.error('Error al cargar comentarios:', response.error);
        setComments([]); // Limpiar comentarios en caso de error
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setComments([]); // Limpiar comentarios en caso de error
    } finally {
      setLoadingComments(false);
    }
  };

  // Función para enviar un nuevo comentario
  const handleSubmitComment = async () => {
    if (!selectedPost || !newComment.trim() || !isAuthenticated) return;

    setSubmittingComment(true);
    try {
      const response = await postService.createComment(selectedPost._id, newComment, {
        username: user?.username || 'Usuario',
        profile_pic_url: user?.profile_pic_url || ''
      });
      if (response.success && response.data) {
        // Añadir el nuevo comentario a la lista, asegurando el formato
        const newAddedComment: Comment = {
          ...response.data,
          text_comment: typeof response.data.text_comment === 'object' && response.data.text_comment !== null
            ? response.data.text_comment.text_comment
            : String(response.data.text_comment)
        };
        setComments(prev => [newAddedComment, ...prev]);
        setNewComment("");

        // Actualizar el contador de comentarios en el post
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === selectedPost._id
              ? { ...post, comments_count: (post.comments_count || 0) + 1 }
              : post
          )
        );

        // Actualizar el post seleccionado en el estado local del modal
        setSelectedPost(prev =>
          prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : null
        );
      } else {
        console.error('Error al crear comentario:', response.error);
      }
    } catch (err) {
      console.error('Error al crear comentario:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Función para dar like o dislike a una publicación
  const handleLikePost = async (postId: string) => {
    if (!isAuthenticated) return;

    if (likingPost === postId) return;

    setLikingPost(postId);
    try {
      const currentPost = posts.find(post => post._id === postId);
      if (!currentPost) return;

      const response = currentPost.liked_by_me
        ? await postService.dislikePost(postId)
        : await postService.likePost(postId);

      if (response.success) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  likes_count:
                    post.liked_by_me
                      ? Math.max(0, (post.likes_count || 0) - 1)
                      : (post.likes_count || 0) + 1,
                  liked_by_me: !post.liked_by_me,
                }
              : post
          )
        );

        // Actualizar el post seleccionado si es el mismo
        setSelectedPost(prev =>
          prev && prev._id === postId
            ? {
                ...prev,
                likes_count:
                  prev.liked_by_me
                    ? Math.max(0, (prev.likes_count || 0) - 1)
                    : (prev.likes_count || 0) + 1,
                liked_by_me: !prev.liked_by_me,
              }
            : prev
        );
      } else {
        console.error('Error al dar like/dislike:', response.error);
      }
    } catch (err) {
      console.error('Error al dar like/dislike:', err);
    } finally {
      setLikingPost(null);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      {/* Sección para crear nueva publicación */}
      {isAuthenticated && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Crear nueva publicación</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="¿Qué estás pensando?"
              value={formData.content}
              onChange={handleContentChange}
              rows={4}
              className="mb-4"
            />
        
           <div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className=" text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center transition duration-200"
                >
                  <FileIcon className="mr-2"/> Subir archivos
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className=" hidden"
                  multiple
                  accept="image/*,video/*"
                />
              </div>
            </div>
            {formData.previews.length > 0 && (
                <div className="grid mt-2 grid-cols-3 gap-2">
                  {formData.previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleCreatePost}
              className="dark:text-white dark:bg-black dark:bg-[#1a1a1a] bg-gray-800 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Botón de refrescar */}
      <div className="flex justify-between items-center mb-4">

        <span className="text-sm text-gray-500 ">
          Última actualización: {formatDate(lastRefresh.toISOString())}
        </span>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Mostrar publicaciones */}
      {loading ? (
        <p>Cargando publicaciones...</p>
      ) : posts.length === 0 ? (
        <p>No hay publicaciones disponibles.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.user_profile_pic || "https://i.pravatar.cc/150"} alt={post.username} />
                    <AvatarFallback>{post.username?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/${post.username}`} className="font-semibold">{post.username || 'Usuario Desconocido'}</Link>
                    <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                {/* Opciones de post (ej: eliminar, editar) - Opcional */}
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                {/* Mostrar imágenes/videos si existen */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {post.media_urls.map((url, index) => (
                      <img key={index} src={url} alt={`Media ${index + 1}`} className="rounded-md object-cover w-full h-48" />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {/* Botón de Like */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post._id)}
                    disabled={!isAuthenticated || likingPost === post._id}
                    className={post.liked_by_me ? "text-red-500" : "text-gray-600"}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${post.liked_by_me ? 'fill-current' : ''}`} />
                    {post.likes_count || 0}
                  </Button>
                  {/* Botón de Comentarios */}
                  <Button variant="ghost" size="sm" onClick={() => handleOpenComments(post)}>
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {post.comments_count || 0}
                  </Button>

                </div>
                {isAuthenticated && user && user.user_id === post.user_id && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(post)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteConfirm(post)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Comentarios */}
      <Dialog open={commentsModalOpen} onOpenChange={setCommentsModalOpen}>
        <DialogContent className="sm:max-w-[700px] ">
          <DialogHeader>
            <DialogTitle>Comentarios</DialogTitle>
            {/* Añadir DialogDescription para resolver la advertencia */}
            <DialogDescription>
              Comentarios de la publicación de {selectedPost?.username || 'Usuario'}.
            </DialogDescription>
          </DialogHeader>

          {/* Contenido del post dentro del modal */}
          {selectedPost && (
            <div className="mb-4 border-b pb-4">
              <div className="flex items-center space-x-4 mb-2">
                <Avatar>
                  <AvatarImage src={selectedPost.user_profile_pic || "https://i.pravatar.cc/150"} alt={selectedPost.username} />
                  <AvatarFallback>{selectedPost.username?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedPost.username || 'Usuario Desconocido'}</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedPost.created_at)}</p>
                </div>
              </div>
              <p className="text-sm mb-2">{selectedPost.content}</p>
               {/* Mostrar imágenes/videos del post seleccionado si existen */}
                {selectedPost.media_urls && selectedPost.media_urls.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {selectedPost.media_urls.map((url, index) => (
                      <img key={index} src={url} alt={`Media ${index + 1}`} className="rounded-md object-cover w-full max-h-40" />
                    ))}
                  </div>
                )}
              <div className="flex items-center text-sm text-gray-600 mt-2">
                 <Heart className={`mr-1 h-4 w-4 ${selectedPost.liked_by_me ? 'fill-red-500 text-red-500' : ''}`} />
                 <span>{selectedPost.likes_count || 0}</span>
                 <MessageSquare className="ml-4 mr-1 h-4 w-4" />
                 <span>{selectedPost.comments_count || 0}</span>
              </div>
            </div>
          )}

          {/* Formulario para añadir comentario */}
          {isAuthenticated && selectedPost && (
            <div className="flex items-start space-x-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profile_pic_url || "https://i.pravatar.cc/150"} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <Textarea
                  placeholder="Añade un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="mb-2"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  size="sm"
                >
                  {submittingComment ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            </div>
          )}

          {/* Lista de comentarios */}
          <div className="max-h-60 overflow-y-auto bg-fuchsia-950/50 space-y-4 p-2 rounded-md"> {/* Añadido bg-gray-50, p-2 y rounded-md */}
            {loadingComments ? (
              <p className="text-center">Cargando comentarios...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500">Sé el primero en comentar.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profile_pic_url || "https://i.pravatar.cc/150"} alt={comment.username} />
                    <AvatarFallback>{comment.username?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow p-2 rounded-md">
                    <p className="font-semibold text-sm">{comment.username || 'Usuario Desconocido'}</p>
                    <p className="text-sm">{comment.text_comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentsModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Edit the content of your post.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your post content..."
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}