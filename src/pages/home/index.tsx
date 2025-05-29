import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Home, Users, MessageSquare, LogIn, UserPlus, Github, Twitter, Instagram, Mail } from 'lucide-react';
//Background waves y LetterGlitch
import Waves from '@/components/ui/Waves';
import PixelCard from '@/components/ui/PixelCard';
import RotatingText from '@/components/ui/RotatingText'




export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col min-h-screen overflow-y-auto">
    {/* Fondo con ondas */}
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
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
    </div>
      {/* Header */}

      <header className={`fixed top-3 left-20 right-20 z-50 bg-background/10  backdrop-blur-sm border-b shadow-sm transition-all duration-300 ease-in-out ${scrolled ? 'py-0.5 px-1' : 'py-2 px-3'}`}>
        <div className={`container mx-auto flex justify-between items-center transition-all duration-300 ease-in-out ${scrolled ? 'py-1' : 'py-2'}`}>
          <div className="flex items-center gap-2">
           
            <h1 className="text-xl font-bold">S O N E T</h1>
          </div>
         
          
          <div className="flex ">
          {!isAuthenticated ? (
              <div className="flex  flex-col sm:flex-row gap-4 ">
                <Button size="lg" className='dark:text-white dark:bg-[#1a1a1a] bg-white  text-gray-800'variant="outline"  onClick={() => navigate('/login')}>
                  <LogIn className=" mr-2" /> Iniciar Sesión
                </Button>
                <Button size="lg" className='dark:text-white dark:bg-[#1a1a1a] bg-white' variant="outline" onClick={() => navigate('/register')}>
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
      <main className="flex-grow pt-16"> {/* Añadimos pt-16 para dar espacio al header fijo */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className='z-10'>
                <div className='flex justify-center items-center grid-cols-1 md:grid-cols-2 h-screen w-full -mt-30'>
                    <h1 className="z-20 text-4xl md:text-5xl font-bold text-center flex items-center justify-center">
                        Únete y
                        <span className="ml-2">
                        <RotatingText
                            texts={['Comenta', 'Postea', 'Descubre', 'Listo!']}
                            mainClassName="text-4xl md:text-5xl px-2 sm:px-2 md:px-3 bg-white text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                            staggerFrom={"last"}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                        </span>
                    </h1>
                </div>
                <p className="font-bold z-10 text-xl text-center text-muted-foreground ">
                    Conecta con amigos, comparte momentos y descubre.
                </p>
            
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 z-10 gap-6 w-full max-w-5xl mx-auto">
                <PixelCard variant="pink" className="relative">
                  <Card className="z-30 bg-background/40 absolute inset-0 flex flex-col m-4 h-[calc(100%-2rem)]">
                    <CardHeader>
                      <CardTitle>Conecta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Encuentra y conecta con amigos, familiares y colegas para mantenerte en contacto.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </PixelCard>

                <PixelCard variant="pink" className="relative">
                  <Card className="bg-background/40 absolute inset-0 flex flex-col m-4 h-[calc(100%-2rem)]">
                    <CardHeader>
                      <CardTitle>Comparte</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Comparte tus pensamientos, fotos y momentos importantes con tu red.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </PixelCard>

                <PixelCard variant="pink" className="relative">
                  <Card className="bg-background/40 absolute inset-0 flex flex-col m-4 h-[calc(100%-2rem)]">
                    <CardHeader>
                      <CardTitle>Descubre</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Explora contenido interesante y mantente al día con las últimas tendencias.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </PixelCard>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}