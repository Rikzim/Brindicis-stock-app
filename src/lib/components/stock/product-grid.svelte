<script>
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "@/lib/utils/icon-map";
  import Button from "@/lib/components/ui/button.svelte";
  import ProductCard from "./product-card.svelte";

  let {
    products = [],
    isLoading = false,
    selectedId = $bindable(null),
  } = $props();

  let page = $state(1);
  const ITEMS_PER_PAGE = 32;

  let totalPages = $derived(Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE)));
  let safePage = $derived(Math.min(page, totalPages));
  let start = $derived((safePage - 1) * ITEMS_PER_PAGE);
  let pageProducts = $derived(products.slice(start, start + ITEMS_PER_PAGE));
</script>

{#if isLoading}
  <div class="flex flex-1 items-center justify-center">
    <Loader2 class="size-8 animate-spin text-slate-400" />
  </div>
{:else if products.length === 0}
  <div class="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
    <p class="text-sm font-medium">Nenhum produto encontrado</p>
  </div>
{:else}
  <div class="flex flex-1 flex-col justify-between overflow-hidden animate-in fade-in duration-300">
    <div class="grid grid-cols-4 gap-3 p-6 overflow-y-auto">
      {#each pageProducts as product (product.id)}
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

    <div class="mt-auto flex items-center justify-end border-t-2 border-slate-200 px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex items-center gap-4">
        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">
          Página {safePage} de {totalPages}
        </span>
        <div class="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            disabled={safePage <= 1}
            onclick={() => page = 1}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronsLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={safePage <= 1}
            onclick={() => page = Math.max(1, page - 1)}
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
            onclick={() => page = Math.min(totalPages, page + 1)}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronRight class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={safePage >= totalPages}
            onclick={() => page = totalPages}
            class="size-9 border-slate-300 dark:border-slate-600"
          >
            <ChevronsRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}
