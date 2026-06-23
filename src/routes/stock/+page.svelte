<script lang="ts">
  import StockNavbar from "$lib/components/layout/stock-navbar.svelte";
  import FiltersBar from "$lib/components/stock/filters-bar.svelte";
  import FiltersTrigger from "$lib/components/stock/filters-trigger.svelte";
  import MobileFiltersSheet from "$lib/components/stock/mobile-filters-sheet.svelte";
  import ProductGrid from "$lib/components/stock/product-grid.svelte";
  import ProductDetailPanel from "$lib/components/stock/product-detail-panel.svelte";
  import MobileProductSheet from "$lib/components/stock/mobile-product-sheet.svelte";
  import { settingsStore } from "$lib/state/settings-store";
  import {
    getProductsPaginated,
    getProductsFilters,
    getFamilies,
    getProductById,
  } from "$lib/utils/stock-api";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import { getStringParam, getNumberParam, writeSearchParams } from "$lib/utils/url-sync.svelte";
  import { createDebounced } from "$lib/utils/debounce.svelte";

  let panelPosition = $derived($settingsStore.panelPosition);
  let selectedProductId = $state<number | null>(null);
  let cachedProduct = $state<any>(null);

  let isMobile = $state(false);
  let filtersSheetOpen = $state(false);

  $effect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => {
      isMobile = e.matches;
      if (!e.matches) filtersSheetOpen = false;
    };
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  });

  let page = $state(getNumberParam("page", 1));
  let size = $state(getNumberParam("size", 64));
  let searchQuery = $state(getStringParam("search", ""));

  const defaultFilters = () => ({
    familia: getStringParam("familia", ""),
    disponibilidade: getStringParam("disponibilidade", "Todas"),
    cor: getStringParam("cor", ""),
    tamanho: getStringParam("tamanho", ""),
  });

  let appliedFilters = $state(defaultFilters());
  let pendingFilters = $state(defaultFilters());

  const familiesStore = createAsyncStore(getFamilies);
  const productsFiltersStore = createAsyncStore(getProductsFilters);

  let serverProducts = $state<any[]>([]);
  let serverTotal = $state(0);
  let serverLoading = $state(false);

  function buildQueryParams(p, s) {
    return {
      page: p,
      limit: s,
      search: searchQuery || undefined,
      familia: appliedFilters.familia ? appliedFilters.familia.split(",") : undefined,
      disponibilidade:
        appliedFilters.disponibilidade !== "Todas" ? appliedFilters.disponibilidade : undefined,
      cor: appliedFilters.cor ? appliedFilters.cor.split(",") : undefined,
      tamanho: appliedFilters.tamanho ? appliedFilters.tamanho.split(",") : undefined,
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

  const debouncedSearch = createDebounced(() => searchQuery, 300);

  $effect(() => {
    debouncedSearch.current;
    appliedFilters.familia;
    appliedFilters.disponibilidade;
    appliedFilters.cor;
    appliedFilters.tamanho;
    doFetch(1, size);
  });

  $effect(() => {
    writeSearchParams({
      page: page > 1 ? page : undefined,
      size: size !== 64 ? size : undefined,
      search: searchQuery || undefined,
      familia: appliedFilters.familia || undefined,
      disponibilidade:
        appliedFilters.disponibilidade !== "Todas" ? appliedFilters.disponibilidade : undefined,
      cor: appliedFilters.cor || undefined,
      tamanho: appliedFilters.tamanho || undefined,
    });
  });

  $effect(() => {
    const id = selectedProductId;
    if (id == null) return;
    const fresh = serverProducts.find((p) => p.id === id);
    if (fresh) cachedProduct = fresh;
  });

  let selectedProduct = $derived(
    selectedProductId != null && cachedProduct?.id === selectedProductId ? cachedProduct : null
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

  function closeProduct() {
    selectedProductId = null;
    cachedProduct = null;
  }

  let availableColors = $derived(
    (productsFiltersStore.data?.colors || []).map((c) => (typeof c === "string" ? c : c.name))
  );
  let availableSizes = $derived(
    (productsFiltersStore.data?.sizes || []).map((s) => (typeof s === "string" ? s : s.size))
  );

  function countActive(f) {
    return (
      (f.familia ? 1 : 0) +
      (f.disponibilidade !== "Todas" ? 1 : 0) +
      (f.cor ? 1 : 0) +
      (f.tamanho ? 1 : 0)
    );
  }

  let activeFilterCount = $derived(countActive(appliedFilters));
  let pendingFilterCount = $derived(countActive(pendingFilters));
  let hasPendingChanges = $derived(
    pendingFilters.familia !== appliedFilters.familia ||
      pendingFilters.disponibilidade !== appliedFilters.disponibilidade ||
      pendingFilters.cor !== appliedFilters.cor ||
      pendingFilters.tamanho !== appliedFilters.tamanho
  );

  function syncAppliedToPending() {
    pendingFilters.familia = appliedFilters.familia;
    pendingFilters.disponibilidade = appliedFilters.disponibilidade;
    pendingFilters.cor = appliedFilters.cor;
    pendingFilters.tamanho = appliedFilters.tamanho;
  }

  function syncPendingToApplied() {
    appliedFilters.familia = pendingFilters.familia;
    appliedFilters.disponibilidade = pendingFilters.disponibilidade;
    appliedFilters.cor = pendingFilters.cor;
    appliedFilters.tamanho = pendingFilters.tamanho;
  }

  function applyFilters() {
    syncPendingToApplied();
    filtersSheetOpen = false;
  }

  function clearPending() {
    pendingFilters.familia = "";
    pendingFilters.disponibilidade = "Todas";
    pendingFilters.cor = "";
    pendingFilters.tamanho = "";
  }

  function clearAll() {
    clearPending();
    applyFilters();
  }

  function openFilters() {
    syncAppliedToPending();
    filtersSheetOpen = true;
  }
</script>

<div
  class="flex h-dvh flex-col bg-[#F3F4F6] p-1.5 sm:p-2 gap-1.5 sm:gap-2 transition-colors duration-250 dark:bg-slate-950"
>
  <StockNavbar bind:searchQuery />

  <div class="flex flex-1 overflow-hidden min-h-0 gap-1.5 sm:gap-2 relative">
    {#if !isMobile && panelPosition === "left" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={closeProduct}
        onProductChange={refreshSelectedProduct}
      />
    {/if}

    <div
      class="flex flex-1 flex-col bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700 min-w-0"
    >
      <div class="lg:hidden px-3 pt-3 pb-1 shrink-0">
        <FiltersTrigger activeCount={pendingFilterCount} onOpen={openFilters} />
      </div>

      <FiltersBar
        families={familiesStore.data || []}
        {availableColors}
        {availableSizes}
        bind:pendingFilters
        onApply={applyFilters}
        onClear={clearAll}
        {hasPendingChanges}
        activeCount={activeFilterCount}
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

    {#if !isMobile && panelPosition === "right" && selectedProduct}
      <ProductDetailPanel
        product={selectedProduct}
        onClose={closeProduct}
        onProductChange={refreshSelectedProduct}
      />
    {/if}

    {#if isMobile && selectedProduct}
      <MobileProductSheet onClose={closeProduct}>
        <ProductDetailPanel
          product={selectedProduct}
          onClose={closeProduct}
          onProductChange={refreshSelectedProduct}
        />
      </MobileProductSheet>
    {/if}
  </div>
</div>

<MobileFiltersSheet
  bind:open={filtersSheetOpen}
  bind:pendingFilters
  families={familiesStore.data || []}
  {availableColors}
  {availableSizes}
  onApply={applyFilters}
  onClear={clearPending}
/>
