import Cookies from "js-cookie";

// Nombre de la clave para el token
const TOKEN_KEY = 'auth_token';

// Guardar token en localStorage
export const saveToken = (token: string, expiresInDays = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expiresInDays);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('token_expiry', expirationDate.toISOString());
};

export const getToken = (): string | undefined => {
  
  return Cookies.get('auth_token');
};

export const removeToken = (): void => {
  Cookies.remove('auth_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
};

export const hasToken = (): boolean => {
  return getToken() !== null;
};
