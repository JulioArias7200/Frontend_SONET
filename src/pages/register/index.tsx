import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import authService from "../../api/services/authService";
import { useAuth } from "@/context/AuthContext";
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
import { AlertCircle, Upload, User } from "lucide-react";

// Esquema de validación extendido para incluir la imagen de perfil
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
  profilePic: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: undefined,
    },
  });

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profilePic", file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar clic en el área de subida
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('bio', "");
      formData.append('is_private', 'false');
      
      // Agregar la imagen de perfil si existe
      if (values.profilePic) {
        formData.append('profile_pic_url', values.profilePic);
      }

      const response = await authService.signup(formData as any);
      
      if (response.success && response.data) {
        console.log('Usuario registrado:', response.data);
        
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          navigate("/feed");
        } else {
          navigate("/login");
        }
      } else {
        setError(response.error || "Ocurrió un error al registrar el usuario");
      }
    } catch (err: any) {
      console.error('Error al registrar:', err);
      
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
              {/* Sección de imagen de perfil */}
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="relative w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={handleUploadClick}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Haz clic para subir una foto de perfil
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {form.formState.errors.profilePic && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.profilePic.message}
                  </p>
                )}
              </div>

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
              
              <Button type="submit" className="w-full dark:text-white dark:bg-black dark:bg-[#1a1a1a] bg-gray-800 hover:bg-gray-700" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            ¿Ya tienes una cuenta?{" "}
            <Button variant="link" className="p-0 dark:text-white dark:bg-black dark:bg-[#1a1a1a] bg-gray-800 text-white " onClick={() => navigate("/login")}>
              Inicia sesión
            </Button>
          </div>
          <Button variant="link" className="w-full dark:text-white dark:bg-black dark:bg-[#1a1a1a] bg-gray-800 text-white" onClick={() => navigate("/")}>
            Continuar como invitado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}