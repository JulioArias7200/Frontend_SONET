import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import authService from '@/api/services/authService';
import Aurora from '@/components/ui/Aurora';
import SpotlightCard from '@/components/ui/SpotlightCard';

// Esquema de validación
const loginSchema = z.object({
  username_or_email: z.string().min(1, 'Este campo es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username_or_email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(values);
      
      if (response.success && response.data) {
        // Guardar token y datos del usuario en el contexto
        login(response.data.token, response.data.user);
        // Success message is shown through navigation, removing setSuccess call
        
        // Esperar un momento antes de redirigir para mostrar el mensaje de éxito
        setTimeout(() => {
          navigate("/feed", { replace: true });
        }, 1500);
      } else {
        setError(response.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Ocurrió un error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Aurora
          colorStops={["#00D8FF", "#7CFF67", "#00D8FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <Card className="w-full max-w-md relative z-10 bg-card/60 backdrop-blur-md border-0 shadow-xl">
        <CardHeader>

          <CardTitle>
            Iniciar Sesión en 
            <br/>
             S O N E T
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username_or_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario o Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu usuario o email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ingresa tu contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/register')}>
            ¿No tienes cuenta? Regístrate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}