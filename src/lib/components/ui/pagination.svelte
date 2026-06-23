<script lang="ts">
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-svelte";
  import Button from "./button.svelte";

  type Props = {
    page: number;
    size: number;
    totalRows: number;
    pageSizeOptions?: number[];
    onPageChange?: (page: number, size: number) => void;
  };

  let {
    page = $bindable(1),
    size = $bindable(25),
    totalRows,
    pageSizeOptions = [25, 50, 100, 250],
    onPageChange,
  }: Props = $props();

  let totalPages = $derived(Math.max(1, Math.ceil(totalRows / size)));
  let safePage = $derived(Math.max(1, Math.min(page, totalPages)));
  let showBar = $derived(totalRows > 0);

  function goToPage(newPage: number) {
    page = newPage;
    onPageChange?.(page, size);
  }

  function changeSize(newSize: number) {
    size = newSize;
    page = 1;
    onPageChange?.(page, size);
  }
</script>

{#if showBar}
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-1.5 border-t border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 shrink-0"
  >
    <div class="flex items-center gap-2 flex-wrap">
      <label class="sr-only" for="pagination-size">Linhas por página</label>
      <select
        id="pagination-size"
        value={size}
        onchange={(e) => changeSize(Number((e.currentTarget as HTMLSelectElement).value))}
        class="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 scheme-light transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 scheme-dark cursor-pointer"
      >
        {#each pageSizeOptions as opt}
          <option value={opt} class="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
            {opt}
          </option>
        {/each}
      </select>
      <span class="text-xs text-slate-600 dark:text-slate-300">
        linhas por página ·
        <span class="font-semibold text-slate-800 dark:text-slate-100 tabular-nums"
          >{totalRows}</span
        >
        {totalRows === 1 ? "registo" : "registos"}
      </span>
    </div>

    <div class="flex items-center justify-between sm:justify-end gap-2">
      <span class="text-xs text-slate-600 dark:text-slate-300 tabular-nums">
        Página
        <span class="font-semibold text-slate-800 dark:text-slate-100">{safePage}</span>
        de {totalPages}
      </span>
      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={safePage <= 1}
          onclick={() => goToPage(1)}
          aria-label="Primeira página"
          title="Primeira página"
          class="size-7 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 [&_svg]:size-3.5"
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={safePage <= 1}
          onclick={() => goToPage(Math.max(1, page - 1))}
          aria-label="Página anterior"
          title="Página anterior"
          class="size-7 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 [&_svg]:size-3.5"
        >
          <ChevronLeft />
        </Button>
        <div
          aria-current="page"
          class="inline-flex size-7 items-center justify-center rounded-md text-xs font-bold tabular-nums bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
        >
          {safePage}
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={safePage >= totalPages}
          onclick={() => goToPage(Math.min(totalPages, page + 1))}
          aria-label="Próxima página"
          title="Próxima página"
          class="size-7 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 [&_svg]:size-3.5"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={safePage >= totalPages}
          onclick={() => goToPage(totalPages)}
          aria-label="Última página"
          title="Última página"
          class="size-7 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 [&_svg]:size-3.5"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  </div>
{/if}
