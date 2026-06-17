<script>
  import { X } from "@/lib/utils/icon-map";
  import Button from "./button.svelte";

  let {
    open = false,
    onClose,
    title = "",
    children,
    footer = undefined,
  } = $props();
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl border-2 border-slate-200 shadow-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-700">
      <div class="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <Button variant="ghost" size="icon" onclick={onClose} class="size-7">
          <X class="size-4" />
        </Button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {@render children?.()}
      </div>
      {#if footer}
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-100 dark:border-slate-700">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
