<script lang="ts">
  import { Loader2 } from "lucide-svelte";
  import Pagination from "./pagination.svelte";

  type Column = {
    key: string;
    header: string;
    className?: string;
    headerClassName?: string;
  };

  type Props = {
    columns: Column[];
    data: any[];
    isLoading?: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
    rowKey?: (row: any) => any;
    onRowClick?: (row: any) => void;
    pageSize?: number;
    showPagination?: boolean;
    pageSizeOptions?: number[];
    cell?: any;
    totalRows: number;
    page?: number;
    size?: number;
    onPageChange?: (page: number, size: number) => void;
  };

  let {
    columns,
    data,
    isLoading = false,
    loadingMessage = "A carregar...",
    emptyMessage = "Sem dados disponíveis.",
    rowKey = (row: any) => row.id,
    onRowClick = undefined,
    pageSize = 25,
    showPagination = true,
    pageSizeOptions = [25, 50, 100, 250],
    cell = undefined,
    totalRows,
    page = $bindable(1),
    size = $bindable(pageSize),
    onPageChange,
  }: Props = $props();
</script>

<div
  class="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0"
>
  <div class="flex-1 overflow-y-auto overflow-x-auto min-h-0">
    <table class="w-full text-left border-collapse">
      <thead class="sticky top-0 z-10 bg-white dark:bg-slate-900">
        <tr
          class="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80"
        >
          {#each columns as col (col.key)}
            <th
              class="px-3 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 {col.headerClassName ??
                ''}"
            >
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
              <span class="text-sm font-medium text-slate-400 dark:text-slate-500"
                >{emptyMessage}</span
              >
            </td>
          </tr>
        {:else}
          {#each data as row, i (rowKey(row))}
            <tr
              class="border-b border-slate-100 last:border-0 transition-colors dark:border-slate-800/60 {onRowClick
                ? 'cursor-pointer'
                : ''} hover:bg-slate-50/30 active:bg-slate-50/50 dark:hover:bg-slate-800/10 dark:active:bg-slate-800/20 {i %
                2 ===
              0
                ? 'bg-white dark:bg-slate-900'
                : 'bg-slate-50/20 dark:bg-slate-800/5'}"
              onclick={() => onRowClick?.(row)}
              onkeydown={(e) => {
                if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
              role={onRowClick ? "button" : undefined}
              tabindex={onRowClick ? 0 : undefined}
            >
              {#each columns as col (col.key)}
                <td
                  class="px-3 sm:px-5 py-3 text-sm {col.className ??
                    'text-slate-800 dark:text-slate-200'}"
                >
                  {#if cell}{@render cell(row, col)}{/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  {#if showPagination}
    <Pagination bind:page bind:size {totalRows} {pageSizeOptions} {onPageChange} />
  {/if}
</div>
