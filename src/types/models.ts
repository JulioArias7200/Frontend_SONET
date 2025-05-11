export interface User {
  _id?: string;
  id?: string;
  username: string;
  email?: string;
  bio?: string;
  profile_pic_url?: string;
  profile_image_url?: string; // Alias para compatibilidad
  is_private?: boolean;
  followers_count?: number;
  following_count?: number;
  created_at?: string;
  avatar?: string; // Alias para compatibilidad
}

export interface Post {
  _id?: string;
  id?: string;
  user_id?: string;
  author?: User;
  username?: string;
  content: string;
  media_urls?: string[];
  parent_post_id?: string | null;
  created_at?: string;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile_pic_url?: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  post_id: string;
  username: string;
  profile_pic_url?: string;
  text_comment: string;
  created_at?: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  user_id: string;
  message: string;
  created_at?: string;
  read?: boolean;
}