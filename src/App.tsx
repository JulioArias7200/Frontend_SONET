import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';

// Importación de páginas
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ProfilePage from '@/pages/profile';
import FeedPage from '@/pages/feed';

// Importación de componentes de autenticación
import PublicRoute from '@/components/auth/PublicRoute';
import PrivateRoute from '@/components/auth/PrivateRoute';

import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta principal que redirige a /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Página de inicio - accesible para todos */}
            <Route path="/home" element={<HomePage />} />
            
            {/* Rutas públicas - solo para usuarios no autenticados */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            
            {/* Rutas privadas - solo para usuarios autenticados */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            
            {/* Ruta de fallback para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
