<script lang="ts">
  import { navigateTo } from "$lib/utils/navigate";
  import Card from "$lib/components/ui/card.svelte";
  import AuthLayout from "$lib/components/auth/auth-layout.svelte";
  import OtpForm from "$lib/components/auth/otp-form.svelte";
</script>

<AuthLayout>
  <Card class="gap-4">
    <div class="flex flex-col gap-1.5 p-6 pb-0">
      <h2 class="text-base font-semibold tracking-tight">Digite o código de autenticação</h2>
      <p class="text-sm text-muted-foreground">
        Por favor, digite o código de autenticação. <br /> Enviamos o código de autenticação para o seu
        email.
      </p>
    </div>
    <div class="p-6 pt-0">
      <OtpForm />
    </div>
    <div class="p-6 pt-0">
      <p class="text-muted-foreground px-8 text-center text-sm">
        Não recebeu o código?{" "}
        <a
          href="/sign-in"
          onclick={(e) => {
            e.preventDefault();
            navigateTo("/sign-in");
          }}
          class="hover:text-primary underline underline-offset-4"
        >
          Reenviar um novo código.
        </a>
        .
      </p>
    </div>
  </Card>
</AuthLayout>
