import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, LogIn } from "@/lib/icon-map";
import { useAuthStore } from "@/stores/auth-store";
import { login as apiLogin, getMe } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor digite o seu email")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Por favor digite a sua password")
    .min(7, "A password deve ter pelo menos 7 caracteres"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { accessToken } = await apiLogin(data.email, data.password);
      setAccessToken(accessToken);
      const user = await getMe();
      setUser(user);

      const targetPath = redirectTo || "/";
      navigate({ to: targetPath, replace: true });

      toast.success(`Bem-vindo, ${user.name}!`);
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const msg = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
        toast.error(msg);
      } else if (axios.isAxiosError(error) && !error.response) {
        toast.error("Erro de conexão ao servidor. Verifique se o backend está a correr.");
      } else {
        toast.error("Credenciais inválidas");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nome@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Esqueceu a password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Entrar
        </Button>
      </form>
    </Form>
  );
}
