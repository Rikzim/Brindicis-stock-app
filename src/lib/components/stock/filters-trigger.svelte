<script lang="ts">
  import { Filter, ChevronDown } from "lucide-svelte";

  let { activeCount = 0, onOpen = () => {} }: { activeCount?: number; onOpen?: () => void } =
    $props();
</script>

<button
  type="button"
  onclick={onOpen}
  class="lg:hidden flex w-full items-center justify-between gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] transition-all min-h-touch dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  aria-label="Abrir filtros"
>
  <span class="flex items-center gap-2">
    <Filter class="size-4 text-slate-500 dark:text-slate-400" />
    <span>Filtros</span>
    {#if activeCount > 0}
      <span
        class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-extrabold text-[#1F2937]"
      >
        {activeCount}
      </span>
    {/if}
  </span>
  <ChevronDown class="size-4 text-slate-400" />
</button>
