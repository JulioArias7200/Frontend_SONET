// Interfaces basadas en la documentación del backend BLIP

export interface User {
  _id: string;
  username: string;
  email: string;
  password_hash?: string;
  profile_image_url?: string;
  bio?: string;
  username_history?: string[];
  followers?: string[];
  following?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Post {
  _id: string;
  user_id: string | null;
  text: string;
  images: string[];
  created_at: Date;
  updated_at: Date;
  blips: string[];
  replies: string[];
  retweet_of: string | null;
}

export interface Blip {
  _id: string;
  author: string;
  content: string;
  created_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}