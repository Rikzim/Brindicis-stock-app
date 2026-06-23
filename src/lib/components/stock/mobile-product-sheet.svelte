<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly, fade } from "svelte/transition";

  let { onClose = () => {}, children }: { onClose?: () => void; children?: Snippet } = $props();
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") onClose();
  }}
/>

<button
  type="button"
  class="lg:hidden absolute inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-default"
  aria-label="Fechar painel de produto"
  onclick={onClose}
  transition:fade={{ duration: 200 }}
></button>

<div
  class="lg:hidden absolute inset-0 z-50 w-full max-w-full md:max-w-md md:w-[480px] bg-white dark:bg-slate-900 shadow-xl flex flex-col overflow-hidden pb-safe"
  role="dialog"
  aria-modal="true"
  aria-label="Painel de produto"
  tabindex="-1"
  transition:fly={{ x: 320, duration: 250 }}
>
  {@render children?.()}
</div>
