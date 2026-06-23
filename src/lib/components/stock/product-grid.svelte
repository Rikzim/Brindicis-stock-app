<script>
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "@/lib/utils/icon-map";
  import Button from "@/lib/components/ui/button.svelte";
  import ProductCard from "./product-card.svelte";

  let {
    products = [],
    totalRows = 0,
    isLoading = false,
    selectedId = $bindable(null),
    page = $bindable(1),
    size = $bindable(32),
    pageSizeOptions = [16, 32, 64, 128],
    onPageChange = () => {},
  } = $props();

  let totalPages = $derived(Math.max(1, Math.ceil(totalRows / size)));
  let safePage = $derived(Math.max(1, Math.min(page, totalPages)));
  let showBar = $derived(totalRows > 0);

  function goToPage(newPage) {
    page = newPage;
    onPageChange(page, size);
  }

  function changeSize(newSize) {
    size = newSize;
    page = 1;
    onPageChange(page, size);
  }
</script>

<div class="flex flex-1 flex-col overflow-hidden">
  {#if isLoading}
    <div class="flex flex-1 items-center justify-center">
      <Loader2 class="size-8 animate-spin text-slate-400" />
    </div>
  {:else if products.length === 0}
    <div class="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
      <p class="text-sm font-medium">Nenhum produto encontrado</p>
    </div>
  {:else}
    <div class="flex-1 min-h-0 grid grid-cols-4 auto-rows-min gap-3 p-6 overflow-y-auto animate-in fade-in duration-300">
      {#each products as product (product.id)}
        {@const colorNames = product.colors?.map((c) => c.name).join(", ") || ""}
        <ProductCard
          name={product.name}
          reference={product.ref}
          quantity={product.quantity - product.reserved}
          colors={colorNames || undefined}
          image={product.images?.[0]?.url}
          isSelected={selectedId === product.id}
          onClick={() => selectedId = product.id}
        />
      {/each}
    </div>
  {/if}

  {#if showBar && products.length > 0}
    <div class="flex shrink-0 items-center justify-between border-t-2 border-slate-200 px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
      <div class="flex items-center gap-2">
        <select
          value={size}
          onchange={(e) => changeSize(Number(e.target.value))}
          class="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
        >
          {#each pageSizeOptions as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
        <span class="text-xs text-slate-400 dark:text-slate-500">por página · {totalRows} registos</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">
          Página {safePage} de {totalPages}
        </span>
        <div class="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            disabled={safePage <= 1}
            onclick={() => goToPage(1)}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronsLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={safePage <= 1}
            onclick={() => goToPage(Math.max(1, page - 1))}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronLeft class="size-4" />
          </Button>
          <Button variant="default" size="icon" class="size-9 bg-amber-400 hover:bg-amber-500 text-[#1F2937] text-sm font-extrabold cursor-default shadow-sm">
            {safePage}
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={safePage >= totalPages}
            onclick={() => goToPage(Math.min(totalPages, page + 1))}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronRight class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={safePage >= totalPages}
            onclick={() => goToPage(totalPages)}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronsRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
