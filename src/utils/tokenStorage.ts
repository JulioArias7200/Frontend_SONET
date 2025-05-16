// Nombre de la clave para el token
const TOKEN_KEY = 'auth_token';

// Guardar token en localStorage
export const saveToken = (token: string, expiresInDays = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expiresInDays);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('token_expiry', expirationDate.toISOString());
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem('token_expiry');
  
  // Verificar si el token ha expirado
  if (token && expiry) {
    const expiryDate = new Date(expiry);
    if (expiryDate > new Date()) {
      return token;
    } else {
      // Si el token ha expirado, eliminarlo
      removeToken();
      return null;
    }
  }
  
  return token;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('token_expiry');
};

export const hasToken = (): boolean => {
  return getToken() !== null;
};
