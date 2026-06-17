<script>
  import StockNavbar from "@/lib/components/layout/stock-navbar.svelte";
  import FiltersBar from "@/lib/components/stock/filters-bar.svelte";
  import ProductGrid from "@/lib/components/stock/product-grid.svelte";
  import ProductDetailPanel from "@/lib/components/stock/product-detail-panel.svelte";
  import AddProductModal from "@/lib/components/stock/add-product-modal.svelte";
  import { settingsStore } from "@/lib/state/settings-store";
  import { getProducts, getFamilies } from "@/lib/utils/stock-api";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { Plus } from "@/lib/utils/icon-map";
  import Button from "@/lib/components/ui/button.svelte";

  let panelPosition = $derived($settingsStore.panelPosition);
  let selectedProductId = $state(null);
  let searchQuery = $state("");
  let showAddModal = $state(false);
  let filters = $state({
    familia: "Todas",
    disponibilidade: "Todas",
    cor: "Todas",
    tamanho: "Todas",
  });

  const productsStore = createAsyncStore(getProducts);
  const familiesStore = createAsyncStore(getFamilies);

  let selectedProduct = $derived(
    (productsStore.data || []).find((p) => p.id === selectedProductId) ?? null
  );

  let filteredProducts = $derived.by(() => {
    let result = productsStore.data || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.ref.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (filters.familia && filters.familia !== "Todas") {
      result = result.filter((p) => p.family?.name === filters.familia);
    }

    if (filters.cor && filters.cor !== "Todas") {
      result = result.filter((p) => p.colors?.some((c) => c.name === filters.cor));
    }

    if (filters.tamanho && filters.tamanho !== "Todas") {
      result = result.filter((p) => p.sizes?.some((s) => s.size === filters.tamanho));
    }

    if (filters.disponibilidade && filters.disponibilidade !== "Todas") {
      if (filters.disponibilidade === "Com Stock") {
        result = result.filter((p) => p.quantity > 0);
      } else if (filters.disponibilidade === "Esgotado") {
        result = result.filter((p) => p.quantity === 0);
      }
    }

    return result;
  });

  let availableColors = $derived.by(() => {
    const set = new Set();
    (productsStore.data || []).forEach((p) => p.colors?.forEach((c) => set.add(c.name)));
    return Array.from(set);
  });

  let availableSizes = $derived.by(() => {
    const set = new Set();
    (productsStore.data || []).forEach((p) => p.sizes?.forEach((s) => set.add(s.size)));
    return Array.from(set);
  });

  let fornecedores = $derived.by(() => {
    const set = new Set();
    (productsStore.data || []).forEach((p) => { if (p.type) set.add(p.type); });
    return Array.from(set);
  });
</script>

<div class="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
  <StockNavbar bind:searchQuery />
  <div class="flex flex-1 overflow-hidden min-h-0 gap-2">
    {#if panelPosition === "left" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={() => selectedProductId = null}
      />
    {/if}

    <div class="flex flex-1 flex-col bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
      <FiltersBar
        families={familiesStore.data || []}
        {availableColors}
        {availableSizes}
        bind:filters
      />
      <div class="relative flex-1 min-h-0 overflow-hidden">
        <ProductGrid
          products={filteredProducts}
          isLoading={productsStore.isLoading}
          bind:selectedId={selectedProductId}
        />
        <Button
          onclick={() => showAddModal = true}
          class="absolute bottom-5 right-5 h-12 px-5 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold shadow-lg rounded-xl active:scale-95 transition-all z-10"
        >
          <Plus class="size-5" />
          <span>Adicionar Produto</span>
        </Button>
      </div>
    </div>

    {#if panelPosition === "right" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={() => selectedProductId = null}
      />
    {/if}
  </div>
</div>

<AddProductModal
  open={showAddModal}
  onClose={() => showAddModal = false}
  onSuccess={() => productsStore.refetch()}
  {fornecedores}
/>
