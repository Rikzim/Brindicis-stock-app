<script lang="ts">
  import Card from "$lib/components/ui/card.svelte";
  import AuthLayout from "$lib/components/auth/auth-layout.svelte";
  import UserAuthForm from "$lib/components/auth/user-auth-form.svelte";
</script>

<AuthLayout>
  <Card class="gap-4">
    <div class="flex flex-col gap-1.5 p-6 pb-0">
      <h2 class="text-lg font-semibold leading-none tracking-tight">Entrar</h2>
      <p class="text-sm text-muted-foreground">
        Digite o seu email e password abaixo para <br />
        acessar a sua conta
      </p>
    </div>
    <div class="p-6 pt-0">
      <UserAuthForm />
    </div>
  </Card>
</AuthLayout>
