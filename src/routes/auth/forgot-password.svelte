<script>
  import { navigateTo } from "@/lib/utils/navigate";
  import Card from "@/lib/components/ui/card.svelte";
  import AuthLayout from "./auth-layout.svelte";
  import ForgotPasswordForm from "./components/forgot-password-form.svelte";
</script>

<AuthLayout>
  <Card class="gap-4">
    <div class="flex flex-col gap-1.5 p-6 pb-0">
      <h2 class="text-lg font-semibold tracking-tight">
        Esqueci minha password
      </h2>
      <p class="text-sm text-muted-foreground">
        Digite o seu email e <br /> enviaremos um link para mudar a sua
        password.
      </p>
    </div>
    <div class="p-6 pt-0">
      <ForgotPasswordForm />
    </div>
    <div class="p-6 pt-0">
      <p class="text-muted-foreground mx-auto px-8 text-center text-sm text-balance">
        Lembrou-se da sua password?{" "}
        <a
          href="/sign-in"
          onclick={(e) => { e.preventDefault(); navigateTo("/sign-in"); }}
          class="hover:text-primary underline underline-offset-4"
        >
          Entrar
        </a>
        .
      </p>
    </div>
  </Card>
</AuthLayout>
