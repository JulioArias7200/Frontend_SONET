import React, { useEffect, useState } from "react";
import postService from "@/api/services/postService";

export function FeedContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await postService.getAllPosts();
      if (response.success) {
        setPosts(response.data);
        setError(null);
      } else {
        setError("No se pudieron cargar los posts.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Cargando posts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {posts.map((post: any) => (
        <div key={post._id} className="mb-4 p-4 border rounded">
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}