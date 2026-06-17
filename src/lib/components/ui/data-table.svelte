<script>
  import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@/lib/utils/icon-map";
  import Button from "./button.svelte";

  let {
    columns = [],
    data = [],
    isLoading = false,
    loadingMessage = "A carregar...",
    emptyMessage = "Sem dados disponíveis.",
    rowKey = (row) => row.id,
    onRowClick = undefined,
    pageSize = 25,
    showPagination = true,
    pageSizeOptions = [25, 50, 100, 250],
    cell = undefined,
  } = $props();

  let page = $state(1);
  let size = $state(25);

  $effect(() => {
    size = pageSize;
  });

  let totalPages = $derived(Math.max(1, Math.ceil(data.length / size)));
  let safePage = $derived(Math.min(page, totalPages));
  let start = $derived((safePage - 1) * size);
  let pageData = $derived(data.slice(start, start + size));
  let showBar = $derived(showPagination && !isLoading && data.length > 0);
</script>

<div class="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
  <div class="flex-1 overflow-y-auto overflow-x-auto min-h-0">
    <table class="w-full text-left border-collapse">
      <thead class="sticky top-0 z-10 bg-white dark:bg-slate-900">
        <tr class="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80">
          {#each columns as col (col.key)}
            <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 {col.headerClassName ?? ''}">
              {col.header}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if isLoading}
          <tr>
            <td colspan={columns.length} class="px-6 py-16 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <Loader2 class="size-6 animate-spin text-amber-400" />
                <span class="text-sm text-slate-400 dark:text-slate-500">{loadingMessage}</span>
              </div>
            </td>
          </tr>
        {:else if data.length === 0}
          <tr>
            <td colspan={columns.length} class="px-6 py-24 text-center">
              <span class="text-sm font-medium text-slate-400 dark:text-slate-500">{emptyMessage}</span>
            </td>
          </tr>
        {:else}
          {#each pageData as row, i (rowKey(row))}
            <tr
              class="border-b border-slate-100 last:border-0 transition-colors dark:border-slate-800/60 {onRowClick ? 'cursor-pointer' : ''} hover:bg-slate-50/30 dark:hover:bg-slate-800/10 {i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/20 dark:bg-slate-800/5'}"
              onclick={() => onRowClick?.(row)}
            >
              {#each columns as col (col.key)}
                <td class="px-5 py-3 text-sm {col.className ?? 'text-slate-800 dark:text-slate-200'}">
                  {#if cell}
                    {@render cell(row, col)}
                  {:else if col.render}
                    {@html col.render(row)}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  {#if showBar}
    <div class="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 shrink-0">
      <div class="flex items-center gap-2">
        <select
          bind:value={size}
          onchange={() => { page = 1; }}
          class="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
        >
          {#each pageSizeOptions as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
        <span class="text-xs text-slate-400 dark:text-slate-500">linhas por página · {data.length} registos</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-slate-500 dark:text-slate-400 mr-2">
          Página {safePage} de {totalPages}
        </span>
        <Button variant="outline" size="icon" disabled={safePage <= 1} onclick={() => page = 1} class="size-7">
          <ChevronsLeft class="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" disabled={safePage <= 1} onclick={() => page = Math.max(1, page - 1)} class="size-7">
          <ChevronLeft class="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" class="size-7 bg-amber-400 text-[#1F2937] hover:bg-amber-500 border-none cursor-default text-xs font-bold">
          {safePage}
        </Button>
        <Button variant="outline" size="icon" disabled={safePage >= totalPages} onclick={() => page = Math.min(totalPages, page + 1)} class="size-7">
          <ChevronRight class="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" disabled={safePage >= totalPages} onclick={() => page = totalPages} class="size-7">
          <ChevronsRight class="size-3.5" />
        </Button>
      </div>
    </div>
  {/if}
</div>
