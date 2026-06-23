<script lang="ts">
  import { z } from "zod";
  import { navigateTo } from "$lib/utils/navigate";
  import axios from "axios";
  import { toast } from "svelte-sonner";
  import { Loader2, LogIn } from "lucide-svelte";
  import { authStore, type AuthUser } from "$lib/state/auth-store";
  import { login as apiLogin, getMe } from "$lib/utils/auth-api";
  import { cn } from "$lib/utils";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import Label from "$lib/components/ui/label.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";

  const formSchema = z.object({
    email: z.string().min(1, "Por favor digite o seu email").email("Email inválido"),
    password: z
      .string()
      .min(1, "Por favor digite a sua password")
      .min(7, "A password deve ter pelo menos 7 caracteres"),
  });

  let { redirectTo = undefined, class: className = "" } = $props();

  let isLoading = $state(false);
  let email = $state("");
  let password = $state("");
  let errors = $state({ email: "", password: "" });

  async function onSubmit(e) {
    e.preventDefault();
    isLoading = true;
    errors = { email: "", password: "" };

    const result = formSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      errors = {
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      };
      isLoading = false;
      return;
    }

    try {
      const { accessToken } = await apiLogin(email, password);
      authStore.setAccessToken(accessToken);
      const user = await getMe<AuthUser>();
      authStore.setUser(user);

      const targetPath = redirectTo || "/stock";
      navigateTo(targetPath);

      toast.success(`Bem-vindo, ${user.name}!`);
    } catch (error: any) {
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
      isLoading = false;
    }
  }
</script>

<form onsubmit={onSubmit} class={cn("grid gap-3", className)}>
  <div class="flex flex-col gap-1.5">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="nome@exemplo.com" bind:value={email} />
    {#if errors.email}
      <span class="text-[0.8rem] font-medium text-destructive">{errors.email}</span>
    {/if}
  </div>

  <div class="relative flex flex-col gap-1.5">
    <Label for="password">Password</Label>
    <PasswordInput id="password" placeholder="********" bind:value={password} />
    {#if errors.password}
      <span class="text-[0.8rem] font-medium text-destructive">{errors.password}</span>
    {/if}
    <a
      href="/forgot-password"
      class="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75 min-h-touch inline-flex items-center"
    >
      Esqueceu a password?
    </a>
  </div>

  <Button type="submit" class="mt-2" disabled={isLoading}>
    {#if isLoading}
      <Loader2 class="animate-spin" />
    {:else}
      <LogIn />
    {/if}
    Entrar
  </Button>
</form>
