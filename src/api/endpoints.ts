// Definición de todas las rutas de la API según la documentación
const endpoints = {
  // Autenticación
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    profile: '/api/auth/profile',  // Añadir esta línea
  },
  
  // Usuarios
  users: {
    // Actualizar esta línea para usar la ruta correcta
    profile: '/api/auth/profile',
    updateProfile: '/api/users/profile',
    updatePrivacy: '/api/users/privacy',
    updateNotifications: '/api/users/notifications',
    updatePassword: '/api/users/password',
    getByUsername: (username: string) => `/api/users/${username}`,
    follow: (username: string) => `/api/users/${username}/follow`,
    unfollow: (username: string) => `/api/users/${username}/unfollow`,
  },
  
  // Publicaciones
  posts: {
    create: '/api/post/posts',
    getAll: '/api/post/posts',
    getById: (postId: string) => `/api/post/posts/${postId}`,
    update: (postId: string) => `/api/post/posts/${postId}`,
    delete: (postId: string) => `/api/post/posts/${postId}`,
    feed: '/api/post/feed',
    like: (postId: string) => `/api/post/posts/${postId}/like`,
  },
};

export default endpoints;