<script lang="ts">
  import { X } from "lucide-svelte";
  import Button from "./button.svelte";

  let { open = false, onClose, title = "", children, footer = undefined } = $props();
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/30 animate-in fade-in duration-200"
    onclick={onClose}
    onkeydown={(e) => {
      if (e.key === "Escape") onClose?.();
    }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="admin-modal-title"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="bg-white rounded-none sm:rounded-2xl border-0 sm:border-2 border-slate-200 shadow-lg w-full sm:max-w-lg sm:mx-4 sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 sm:dark:border-slate-700"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <div
        class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"
      >
        <h3
          id="admin-modal-title"
          class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100"
        >
          {title}
        </h3>
        <Button variant="ghost" size="icon" onclick={onClose} class="size-10" aria-label="Fechar">
          <X class="size-4" />
        </Button>
      </div>
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {@render children?.()}
      </div>
      {#if footer}
        <div
          class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-slate-100 dark:border-slate-700 shrink-0 pb-safe"
        >
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
