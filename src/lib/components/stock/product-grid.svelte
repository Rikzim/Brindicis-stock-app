<script lang="ts">
  import { Loader2 } from "lucide-svelte";
  import ProductCard from "./product-card.svelte";
  import Pagination from "$lib/components/ui/pagination.svelte";

  let {
    products = [] as any[],
    totalRows = 0,
    isLoading = false,
    selectedId = $bindable<number | null>(null),
    page = $bindable(1),
    size = $bindable(32),
    pageSizeOptions = [64, 96, 128],
    onPageChange = () => {},
  }: {
    products?: any[];
    totalRows?: number;
    isLoading?: boolean;
    selectedId?: number | null;
    page?: number;
    size?: number;
    pageSizeOptions?: number[];
    onPageChange?: (page: number, size: number) => void;
  } = $props();

  let showBar = $derived(totalRows > 0);
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
    <div
      class="flex-1 min-h-0 grid grid-cols-4 auto-rows-min gap-2 sm:gap-3 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      {#each products as product (product.id)}
        {@const colorNames = product.colors?.map((c: any) => c.name).join(", ") || ""}
        <ProductCard
          name={product.name}
          reference={product.ref}
          quantity={product.quantity - product.reserved}
          colors={colorNames || undefined}
          image={product.images?.[0]?.url}
          isSelected={selectedId === product.id}
          onClick={() => (selectedId = product.id)}
        />
      {/each}
    </div>
  {/if}

  {#if showBar && products.length > 0}
    <Pagination bind:page bind:size {totalRows} {pageSizeOptions} {onPageChange} />
  {/if}
</div>
