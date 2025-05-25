import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import authService from "../../api/services/authService";
import { useAuth } from "@/context/AuthContext"; // Importar useAuth

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Esquema de validación para el formulario
const formSchema = z.object({
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "La confirmación de contraseña debe tener al menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtener la función login del contexto
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Definir el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Función que se ejecuta al enviar el formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Crear objeto FormData para enviar datos como form-data
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      // Incluir campos opcionales, incluso si están vacíos o con valores predeterminados
      formData.append('bio', ""); // O el valor real si tuvieras un campo para bio
      formData.append('is_private', 'false'); // O el valor real si tuvieras un campo para is_private
      // Si tuvieras un input de tipo file para la imagen de perfil, lo añadirías aquí:
      // const profilePicFile = document.getElementById('profile_pic_input').files[0];
      // if (profilePicFile) {
      //   formData.append('profile_pic', profilePicFile);
      // }

      // Llamar al servicio de autenticación para registrar al usuario con FormData
      // Asegúrate de que authService.signup pueda aceptar FormData
      const response = await authService.signup(formData as any); // Puede que necesites ajustar el tipo en authService
      
      if (response.success && response.data) {
        console.log('Usuario registrado:', response.data);
        
        // Opcionalmente, iniciar sesión automáticamente
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          navigate("/feed");
        } else {
          // Redirigir al login después del registro exitoso
          navigate("/login");
        }
      } else {
        setError(response.error || "Ocurrió un error al registrar el usuario");
      }
    } catch (err: any) {
      console.error('Error al registrar:', err);
      
      // Manejar específicamente el error 409 (conflicto)
      if (err.response?.status === 409) {
        setError("El nombre de usuario o correo electrónico ya está en uso. Por favor, intenta con otro.");
      } else {
        setError(err.response?.data?.message || "Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-100 overflow-hidden items-center justify-center bg-background p-4">
      <div className="absolute top-5 right-4">
        <ModeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">
            Regístrate para conectar con tus amigos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario123" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este será tu nombre público en la plataforma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@ejemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usaremos este correo para verificar tu cuenta.
                    </FormDescription>
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
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usa al menos 6 caracteres.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            ¿Ya tienes una cuenta?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
              Inicia sesión
            </Button>
          </div>
          <Button variant="link" className="w-full" onClick={() => navigate("/")}>
            Continuar como invitado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}