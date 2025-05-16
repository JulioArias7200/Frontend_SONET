export interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profile_pic_url?: string;
  is_private?: boolean;
  followers_count?: number;
  following_count?: number;
  created_at?: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  comments_count?: number;
  username?: string;
  user_profile_pic?: string;
}

export interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  user_profile_pic?: string;
}

export interface Notification {
  _id: string;
  user_id: string;
  type: string;
  content: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}