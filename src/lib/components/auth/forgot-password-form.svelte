<script lang="ts">
  import { z } from "zod";
  import { navigateTo } from "$lib/utils/navigate";
  import { ArrowRight, Loader2 } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { sleep, cn } from "$lib/utils";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import Label from "$lib/components/ui/label.svelte";

  const formSchema = z.object({
    email: z.string().min(1, "Por favor, digite seu email").email("Email inválido"),
  });

  let isPending = $state(false);
  let email = $state("");
  let errors = $state({ email: "" });

  async function onSubmit(e) {
    e.preventDefault();
    errors = { email: "" };

    const result = formSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      errors = { email: fieldErrors.email?.[0] || "" };
      return;
    }

    isPending = true;
    toast.promise(sleep(2000), {
      loading: "A enviar email...",
      success: () => {
        navigateTo("/otp");
        return `Email enviado para ${email}`;
      },
      error: "Error",
    });
    isPending = false;
  }
</script>

<form onsubmit={onSubmit} class={cn("grid gap-2")}>
  <div class="flex flex-col gap-1.5">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="nome@exemplo.com" bind:value={email} />
    {#if errors.email}
      <span class="text-[0.8rem] font-medium text-destructive">{errors.email}</span>
    {/if}
  </div>
  <Button type="submit" class="mt-2" disabled={isPending}>
    Continuar
    {#if isPending}
      <Loader2 class="animate-spin" />
    {:else}
      <ArrowRight />
    {/if}
  </Button>
</form>
