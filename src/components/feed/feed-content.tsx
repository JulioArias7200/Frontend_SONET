import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { HeartIcon, MessageSquareIcon, RepeatIcon, ShareIcon, ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import postService from "@/api/services/postService";
import { Post } from "@/types/models";

export function FeedContent() {
  const [postContent, setPostContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('Obteniendo posts...');
        const response = await postService.getAllPosts();
        console.log('Respuesta del servidor:', response);
        
        if (response.success && response.data?.posts) {
          setPosts(response.data.posts);
        } else {
          setError("No se pudieron cargar las publicaciones");
        }
      } catch (err: any) {
        console.error('Error al cargar publicaciones:', err);
        setError(err.message || "Error al cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const handlePost = async () => {
    if (!postContent.trim() || !isAuthenticated) return;
    
    setIsPosting(true);
    try {
      const postData = {
        content: postContent,
        media_urls: mediaUrls
      };
      
      const response = await postService.createPost(postData);
      
      if (response.success && response.data) {
        setPosts(prevPosts => [response.data, ...prevPosts]);
        setPostContent("");
        setMediaUrls([]);
      } else {
        throw new Error(response.message || 'Error al crear el post');
      }
    } catch (error: any) {
      console.error('Error al publicar:', error);
      setError(error.message || "Error al crear la publicación");
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Aquí deberías implementar la lógica para subir las imágenes a tu servidor
      // y obtener las URLs. Por ahora, simularemos URLs locales
      const newMediaUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setMediaUrls(prev => [...prev, ...newMediaUrls]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="mx-auto w-full rounded-md border border-blue-300 p-4">
            <div className="flex animate-pulse space-x-4">
              <div className="size-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                    <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-2 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profile_pic_url || user?.profile_image_url} alt="Tu avatar" />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "TU"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">¿Qué estás pensando?</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Comparte tus pensamientos..." 
              className="min-h-24"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mediaUrls.map((url, index) => (
                  <img 
                    key={index} 
                    src={url} 
                    alt={`Imagen ${index + 1}`} 
                    className="rounded-lg object-cover w-full h-32"
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <div>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            </div>
            <Button onClick={handlePost} disabled={isPosting || !postContent.trim()}>
              {isPosting ? "Publicando..." : "Publicar"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="mx-auto w-full rounded-md border border-blue-300 p-4">
              <div className="flex animate-pulse space-x-4">
                <div className="size-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-gray-200"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                      <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                    </div>
                    <div className="h-2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center p-4">No hay publicaciones disponibles</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post._id || post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage 
                      src={post.author?.profile_pic_url || post.profile_pic_url} 
                      alt={post.author?.username || post.username || "Usuario"} 
                    />
                    <AvatarFallback>
                      {(post.author?.username || post.username || "US").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author?.username || post.username || "Usuario"}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Fecha desconocida"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {post.media_urls.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex gap-1"
                  onClick={() => postService.likePost(post._id || post.id || '')}
                >
                  <HeartIcon className="h-4 w-4" />
                  <span>{post.likes_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex gap-1">
                  <MessageSquareIcon className="h-4 w-4" />
                  <span>{post.comments_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex gap-1">
                  <RepeatIcon className="h-4 w-4" />
                  <span>{post.reposts_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}