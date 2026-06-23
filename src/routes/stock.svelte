<script>
  import StockNavbar from "@/lib/components/layout/stock-navbar.svelte";
  import FiltersBar from "@/lib/components/stock/filters-bar.svelte";
  import ProductGrid from "@/lib/components/stock/product-grid.svelte";
  import ProductDetailPanel from "@/lib/components/stock/product-detail-panel.svelte";
  import { settingsStore } from "@/lib/state/settings-store";
  import { getProductsPaginated, getProductsFilters, getFamilies, getProductById } from "@/lib/utils/stock-api";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { getStringParam, getNumberParam, writeSearchParams } from "@/lib/utils/url-sync.svelte";

  let panelPosition = $derived($settingsStore.panelPosition);
  let selectedProductId = $state(null);
  let cachedProduct = $state(null);

  let page = $state(getNumberParam("page", 1));
  let size = $state(getNumberParam("size", 32));
  let searchQuery = $state(getStringParam("search", ""));
  let filters = $state({
    familia: getStringParam("familia", "Todas"),
    disponibilidade: getStringParam("disponibilidade", "Todas"),
    cor: getStringParam("cor", "Todas"),
    tamanho: getStringParam("tamanho", "Todas"),
  });

  const familiesStore = createAsyncStore(getFamilies);
  const productsFiltersStore = createAsyncStore(getProductsFilters);

  let serverProducts = $state([]);
  let serverTotal = $state(0);
  let serverLoading = $state(false);

  function buildQueryParams(p, s) {
    return {
      page: p,
      limit: s,
      search: searchQuery || undefined,
      familia: filters.familia !== "Todas" ? filters.familia : undefined,
      disponibilidade: filters.disponibilidade !== "Todas" ? filters.disponibilidade : undefined,
      cor: filters.cor !== "Todas" ? filters.cor : undefined,
      tamanho: filters.tamanho !== "Todas" ? filters.tamanho : undefined,
    };
  }

  async function doFetch(p, s) {
    serverLoading = true;
    try {
      const result = await getProductsPaginated(buildQueryParams(p, s));
      serverProducts = result.products;
      serverTotal = result.total;
      page = p;
    } catch {
      serverProducts = [];
      serverTotal = 0;
    } finally {
      serverLoading = false;
    }
  }

  $effect(() => {
    searchQuery;
    JSON.stringify(filters);
    doFetch(1, size);
  });

  $effect(() => {
    writeSearchParams({
      page: page > 1 ? page : undefined,
      size: size !== 32 ? size : undefined,
      search: searchQuery || undefined,
      familia: filters.familia !== "Todas" ? filters.familia : undefined,
      disponibilidade: filters.disponibilidade !== "Todas" ? filters.disponibilidade : undefined,
      cor: filters.cor !== "Todas" ? filters.cor : undefined,
      tamanho: filters.tamanho !== "Todas" ? filters.tamanho : undefined,
    });
  });

  $effect(() => {
    const id = selectedProductId;
    if (id == null) return;
    const fresh = serverProducts.find((p) => p.id === id);
    if (fresh) cachedProduct = fresh;
  });

  let selectedProduct = $derived(
    selectedProductId != null && cachedProduct?.id === selectedProductId
      ? cachedProduct
      : null
  );

  async function refreshSelectedProduct() {
    if (selectedProductId == null) return;
    try {
      cachedProduct = await getProductById(selectedProductId);
    } catch {
      // ignore
    }
    doFetch(page, size);
  }

  let availableColors = $derived(
    (productsFiltersStore.data?.colors || []).map((c) => (typeof c === "string" ? c : c.name))
  );
  let availableSizes = $derived(
    (productsFiltersStore.data?.sizes || []).map((s) => (typeof s === "string" ? s : s.size))
  );
</script>

<div class="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
  <StockNavbar bind:searchQuery />
  <div class="flex flex-1 overflow-hidden min-h-0 gap-2">
    {#if panelPosition === "left" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={() => { selectedProductId = null; cachedProduct = null; }}
        onProductChange={refreshSelectedProduct}
      />
    {/if}

    <div class="flex flex-1 flex-col bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
      <FiltersBar
        families={familiesStore.data || []}
        {availableColors}
        {availableSizes}
        bind:filters
      />
      <ProductGrid
        products={serverProducts}
        totalRows={serverTotal}
        isLoading={serverLoading}
        bind:page
        bind:size
        bind:selectedId={selectedProductId}
        onPageChange={doFetch}
      />
    </div>

    {#if panelPosition === "right" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={() => { selectedProductId = null; cachedProduct = null; }}
        onProductChange={refreshSelectedProduct}
      />
    {/if}
  </div>
</div>
