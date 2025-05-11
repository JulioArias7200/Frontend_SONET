import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Home, Users, MessageSquare, LogIn, UserPlus, Github, Twitter, Instagram, Mail } from 'lucide-react';
//Background waves y LetterGlitch
import Waves from '@/components/ui/waves';
import LetterGlitch from '@/components/ui/LetterGlitch';



export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col min-h-screen">
    
    <Waves
        lineColor="#261893"
        backgroundColor="rgba(0, 0, 0, 00)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        />
      {/* Header */}

      <header className="sticky top-0 z-10 bg-background/40 backdrop-blur-sm border-b py-3 px-4 shadow-sm rounded-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded">
              <MessageSquare size={20} />
            </div>
            <h1 className="text-xl font-bold">Red Social</h1>
          </div>
         
          
          <div className="flex ">
          {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button size="lg" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2" /> Iniciar Sesión
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2" /> Registrarse
                </Button>
              </div>
            ) : (
              <Button size="lg" onClick={() => navigate('/feed')}>
                <Home className="mr-2" /> Ir al Feed
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="z-20 text-4xl font-bold text-center">Bienvenido a nuestra Red Social</h1>
            <p className=" z-20 text-xl text-center text-muted-foreground max-w-2xl">
              Conecta con amigos, comparte momentos y descubre contenido interesante en nuestra plataforma.
            </p>



            <div className="grid  grid-cols-1 md:grid-cols-3 z-20 gap-6 w-full max-w-5xl mt-12">
              <Card className='bg-background/40'>
                <CardHeader >
                  <CardTitle>Conecta</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="h-12 w-12 mb-4 text-primary" />
                  <CardDescription>
                    Encuentra y conecta con amigos, familiares y colegas para mantenerte en contacto.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='bg-background/40 '>
                <CardHeader>
                  <CardTitle>Comparte</CardTitle>
                </CardHeader>
                <CardContent>
                  <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                  <CardDescription>
                    Comparte tus pensamientos, fotos y momentos importantes con tu red.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='bg-background/40'>
                <CardHeader>
                  <CardTitle>Descubre</CardTitle>
                </CardHeader>
                <CardContent>
                  <Home className="h-12 w-12 mb-4 text-primary" />
                  <CardDescription>
                    Explora contenido interesante y mantente al día con las últimas tendencias.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-8 max-w-2xl">
              <AlertTitle>¡Únete a nuestra comunidad!</AlertTitle>
              <AlertDescription>
                Millones de usuarios ya están compartiendo y conectando en nuestra plataforma. ¡No te quedes fuera!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Red Social</h3>
              <p className="text-sm text-muted-foreground">
                Conectando personas y compartiendo momentos desde 2023.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors" aria-label="Github">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Red Social. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Diseñado y desarrollado con ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}