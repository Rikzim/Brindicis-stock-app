<script lang="ts">
  import { navigateTo } from "$lib/utils/navigate";
  import { cn } from "$lib/utils";
  import Button from "$lib/components/ui/button.svelte";

  let otp = $state("");
  let isPending = $state(false);

  async function onSubmit(e) {
    e.preventDefault();
    isPending = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isPending = false;
    navigateTo("/stock");
  }
</script>

<form onsubmit={onSubmit} class={cn("grid gap-2")}>
  <div class="flex flex-col gap-1.5">
    <label class="sr-only" for="otp">Código de Verificação</label>
    <div class="flex items-center gap-1.5 sm:gap-2 justify-between">
      {#each Array(6) as _, i}
        <input
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border-y border-r border-input text-base sm:text-lg font-semibold shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:z-10 ring-ring text-center"
          value={otp[i] || ""}
          oninput={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const val = el.value.replace(/\D/g, "");
            if (val) {
              const newOtp = otp.split("");
              newOtp[i] = val;
              otp = newOtp.join("").slice(0, 6);
              if (i < 5) {
                (el.parentElement?.children[i + 1] as HTMLInputElement | undefined)?.focus();
              }
            } else {
              const newOtp = otp.split("");
              newOtp.splice(i, 1);
              otp = newOtp.join("");
              if (i > 0) {
                (el.parentElement?.children[i - 1] as HTMLInputElement | undefined)?.focus();
              }
            }
          }}
          onkeydown={(e) => {
            if (e.key === "Backspace" && !otp[i] && i > 0) {
              const el = e.currentTarget as HTMLInputElement;
              (el.parentElement?.children[i - 1] as HTMLInputElement | undefined)?.focus();
            }
          }}
        />
      {/each}
    </div>
    {#if otp.length > 0 && otp.length < 6}
      <span class="text-[0.8rem] font-medium text-destructive">
        Por favor, digite o código de 6 dígitos.
      </span>
    {/if}
  </div>
  <Button type="submit" class="mt-2" disabled={otp.length < 6 || isPending}>Verificar</Button>
</form>
