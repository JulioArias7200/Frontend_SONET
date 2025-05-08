// Interfaces para los modelos de datos

export interface Blip {
  _id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profile_image_url?: string;
  bio?: string;
  username_history: string[];
  followers: string[];
  following: string[];
  created_at: string;
  updated_at: string;
}

export interface Post {
  _id: string;
  user_id: string;
  text: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  blips?: string[];
  replies?: string[];
  retweet_of?: string;
}

// Interfaces para las solicitudes

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateBlipRequest {
  author: string;
  content: string;
}

export interface CreatePostRequest {
  text: string;
  user_id?: string;
  username?: string;
}

// Interfaces para las respuestas

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}