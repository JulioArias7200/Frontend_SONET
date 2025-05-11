// Funciones para manejar el token JWT en localStorage para mayor persistencia

export const saveToken = (token: string, expiresInDays = 1): void => {
  // Guardar en localStorage para persistencia entre recargas
  localStorage.setItem('auth_token', token);
  
  // También establecer una fecha de expiración
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expiresInDays);
  localStorage.setItem('token_expiry', expirationDate.toISOString());
};

export const getToken = (): string | null => {
  const token = localStorage.getItem('auth_token');
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
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_expiry');
};

export const hasToken = (): boolean => {
  return getToken() !== null;
};