import './App.css'
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import FeedPage from "./pages/feed";
/*import ProfilePage from "@/pages/profile/profile";*}*/
import LoginPage from "./pages/login";
import RegisterPage from './pages/register';
import ProfilePage from "./pages/profile"; // <--- Añadido

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
