// Funciones para gestionar el token JWT en cookies

// Guardar token en cookie
export const saveToken = (token: string, expirationDays = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
  // Formato: "token=valor; expires=fecha; path=/; secure; samesite=strict"
  document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
};

// Obtener token desde cookie
export const getToken = (): string | null => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  
  if (tokenCookie) {
    return tokenCookie.trim().substring('auth_token='.length);
  }
  
  return null;
};

// Eliminar token (logout)
export const removeToken = () => {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Verificar si hay un token (sesión activa)
export const hasToken = (): boolean => {
  return getToken() !== null;
};