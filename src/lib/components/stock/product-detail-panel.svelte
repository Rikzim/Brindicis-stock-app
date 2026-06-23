<script lang="ts">
  import { X, FileText, Calendar, Plus, ShieldCheck, ChevronLeft } from "lucide-svelte";
  import { onMount } from "svelte";
  import Tooltip from "$lib/components/ui/tooltip.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import CreateReservationPanel from "./create-reservation-modal.svelte";
  import ProductReservationsPanel from "./product-reservations-panel.svelte";
  import ProductImageCarousel from "./product-image-carousel.svelte";
  import ProductVariantFilters from "./product-variant-filters.svelte";
  import ProductVariantsTable from "./product-variants-table.svelte";
  import ProductDataGrid from "./product-data-grid.svelte";

  let {
    product,
    onClose = () => {},
    onProductChange = () => {},
  }: { product: any; onClose?: () => void; onProductChange?: () => void } = $props();

  let view = $state("details");
  let mobileTab = $state("variants");
  let selectedColor = $state("");
  let selectedSize = $state("");
  let nameEl = $state<HTMLElement | null>(null);
  let descEl = $state<HTMLElement | null>(null);
  let nameOverflows = $state(false);
  let descOverflows = $state(false);

  let isMobile = $state(false);
  let saveDisabled = $state(true);
  let isSaving = $state(false);
  let onSave = $state(() => {});

  onMount(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    isMobile = mql.matches;
    const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  });

  $effect(() => {
    if (nameEl) nameOverflows = nameEl.scrollWidth > nameEl.clientWidth;
  });

  $effect(() => {
    if (descEl) descOverflows = descEl.scrollWidth > descEl.clientWidth;
  });

  $effect(() => {
    product.id;
    view = "details";
    mobileTab = "variants";
    selectedColor = "";
    selectedSize = "";
  });

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "—";
    }
  }

  let filteredVariants = $derived(
    (product.variants || []).filter((v: any) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    })
  );

  let totalStock = $derived(product.quantity - product.reserved);
  let filteredStock = $derived(
    filteredVariants.reduce((sum: number, v: any) => sum + (v.quantity - v.reserved), 0)
  );
  let displayQuantity = $derived(selectedColor || selectedSize ? filteredStock : totalStock);
</script>

<div
  class="flex h-full w-full md:w-[460px] md:shrink-0 md:border-2 md:border-slate-200 md:rounded-2xl md:shadow-sm flex-col overflow-hidden bg-white md:dark:border-slate-700 dark:bg-slate-900 relative"
>
  {#if view === "reserving"}
    <CreateReservationPanel
      {product}
      onClose={() => (view = "details")}
      onSuccess={onProductChange}
      bind:saveDisabled
      bind:isSaving
      bind:onSave
    />
  {:else if view === "reservations"}
    <ProductReservationsPanel {product} onClose={() => (view = "details")} {onProductChange} />
  {:else}
    <Button
      variant="ghost"
      size="icon"
      onclick={onClose}
      class="absolute top-3 right-3 z-10 size-7 hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <X class="size-4" />
    </Button>

    {#if isMobile}
      <div
        class="lg:hidden shrink-0 flex border-b-2 border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700"
      >
        <button
          type="button"
          onclick={() => (mobileTab = "details")}
          class="flex-1 py-3 text-sm font-bold text-center transition-colors {mobileTab ===
          'details'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-slate-500 dark:text-slate-400'}"
        >
          Detalhes
        </button>
        <button
          type="button"
          onclick={() => (mobileTab = "variants")}
          class="flex-1 py-3 text-sm font-bold text-center transition-colors {mobileTab ===
          'variants'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-slate-500 dark:text-slate-400'}"
        >
          Variantes{filteredVariants.length > 0 ? ` (${filteredVariants.length})` : ""}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        {#if mobileTab === "details"}
          <div
            class="grid grid-cols-[auto_1fr] bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
          >
            <ProductImageCarousel images={product.images || []} name={product.name} />
            <div class="flex flex-col justify-between min-w-0 p-3">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400"
                  >REF. {product.ref}</span
                >
                <h2
                  class="text-lg font-extrabold text-slate-900 uppercase leading-tight dark:text-slate-50 truncate"
                >
                  {product.name}
                </h2>
                {#if product.category}
                  <p class="text-sm text-slate-600 font-semibold dark:text-slate-600">
                    {product.category.name}
                  </p>
                {/if}
              </div>
              <div class="flex items-center gap-3 mt-2">
                <div
                  class="inline-flex items-center rounded-lg bg-[#FBBF24] px-2.5 py-1 text-sm font-bold text-[#1F2937] shadow-sm"
                >
                  {product.quantity}
                  <span class="font-semibold opacity-80 ml-1">un.</span>
                </div>
                <span class="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {product.pvp.toFixed(2)} €<span
                    class="text-xs font-bold text-slate-600 ml-0.5 dark:text-slate-600">PVP</span
                  >
                </span>
              </div>
            </div>
          </div>
          <div class="px-3.5 py-3 space-y-4">
            <ProductDataGrid
              cx={product.cx}
              number={product.number}
              family={product.family?.name || null}
              drawer={product.drawer}
              pc={product.pc}
            />
            {#if product.description}
              <div>
                <h3
                  class="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest mb-1 dark:text-slate-600"
                >
                  Descrição
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300">
                  {product.description}
                </p>
              </div>
            {/if}
            <div class="flex items-center text-[10px] text-slate-500 font-semibold">
              <p class="flex-1">
                Criado em <span class="font-bold text-slate-600"
                  >{formatDate(product.createdAt)}</span
                >
              </p>
              <span class="text-slate-300 dark:text-slate-600 mx-2">|</span>
              <p class="flex-1 text-right">
                Atualizado em <span class="font-bold text-slate-600"
                  >{formatDate(product.updatedAt)}</span
                >
              </p>
            </div>
          </div>
        {:else}
          <div
            class="px-3 py-2.5 bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
          >
            <div class="flex items-center gap-2">
              {#if product.colors?.length}
                <div class="flex-1 min-w-0">
                  <SearchableSelect
                    bind:value={selectedColor}
                    options={[
                      { value: "", label: "Todas" },
                      ...product.colors.map((c: any) => ({ value: c.name, label: c.name })),
                    ]}
                    placeholder="Cor"
                    class="h-8 text-xs"
                  />
                </div>
              {/if}
              {#if product.sizes?.length}
                <div class="flex-1 min-w-0">
                  <SearchableSelect
                    bind:value={selectedSize}
                    options={[
                      { value: "", label: "Todos" },
                      ...product.sizes.map((s: any) => ({ value: s.size, label: s.size })),
                    ]}
                    placeholder="Tam."
                    class="h-8 text-xs"
                  />
                </div>
              {/if}
              <div class="shrink-0 text-center">
                <span
                  class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-0.5"
                  >Disp.</span
                >
                <span
                  class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold shadow-xs {displayQuantity ===
                  0
                    ? 'bg-red-100 text-red-600'
                    : 'bg-[#FBBF24] text-[#1F2937]'}"
                >
                  {displayQuantity}
                </span>
              </div>
            </div>
          </div>
          <ProductVariantsTable variants={filteredVariants} />
        {/if}
      </div>
    {:else}
      <div class="flex-1 flex flex-col overflow-hidden">
        <div
          class="shrink-0 flex bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
        >
          <ProductImageCarousel images={product.images || []} name={product.name} />
          <div class="flex-1 flex flex-col justify-between min-w-0 p-5">
            <div class="flex flex-col gap-1">
              <span
                class="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400"
                >REF. {product.ref}</span
              >
              <Tooltip content={nameOverflows ? product.name : ""} class="w-full">
                <h2
                  bind:this={nameEl}
                  class="text-xl font-extrabold text-slate-900 uppercase leading-tight dark:text-slate-50 truncate"
                >
                  {product.name}
                </h2>
              </Tooltip>
              {#if product.category}
                <p class="text-sm text-slate-600 font-semibold dark:text-slate-600">
                  {product.category.name}
                </p>
              {/if}
            </div>
            <div class="flex items-center gap-3 mt-2">
              <div
                class="inline-flex items-center rounded-lg bg-[#FBBF24] px-3 py-1 text-sm font-bold text-[#1F2937] shadow-sm"
              >
                {product.quantity}
                <span class="font-semibold opacity-80 ml-1">unidades</span>
              </div>
              <span class="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {product.pvp.toFixed(2)} €<span
                  class="text-xs font-bold text-slate-600 ml-0.5 dark:text-slate-600">PVP</span
                >
              </span>
            </div>
          </div>
        </div>

        <div
          class="shrink-0 bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
        >
          <ProductVariantFilters
            colors={product.colors || []}
            sizes={product.sizes || []}
            bind:selectedColor
            bind:selectedSize
            {displayQuantity}
          />
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-800/50">
          <ProductVariantsTable variants={filteredVariants} />
        </div>

        <div
          class="shrink-0 bg-white border-t-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
        >
          <ProductDataGrid
            cx={product.cx}
            number={product.number}
            family={product.family?.name || null}
            drawer={product.drawer}
            pc={product.pc}
          />
        </div>

        {#if product.description}
          <div
            class="shrink-0 bg-white border-t-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
          >
            <div class="px-5 py-2.5">
              <div class="flex items-center gap-1.5 mb-1">
                <FileText class="size-3.5 shrink-0 text-slate-600" />
                <span class="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest"
                  >Descrição</span
                >
              </div>
              <Tooltip content={descOverflows ? product.description : ""} class="w-full">
                <p
                  bind:this={descEl}
                  class="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300"
                >
                  {product.description}
                </p>
              </Tooltip>
            </div>
          </div>
        {/if}

        <div class="shrink-0 bg-white px-5 py-2 dark:bg-slate-800/50">
          <div class="flex items-center text-[10px] text-slate-500 font-semibold">
            <p class="flex-1">
              Criado em <span class="font-bold text-slate-600">{formatDate(product.createdAt)}</span
              >
            </p>
            <span class="text-slate-300 dark:text-slate-600 mx-2">|</span>
            <p class="flex-1 text-right">
              Atualizado em <span class="font-bold text-slate-600"
                >{formatDate(product.updatedAt)}</span
              >
            </p>
          </div>
        </div>
      </div>
    {/if}
  {/if}

  <div
    class="lg:shrink-0 border-t-2 border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 dark:border-slate-700 dark:bg-slate-800"
  >
    {#if view === "details"}
      <Button
        variant="outline"
        size="sm"
        onclick={() => (view = "reservations")}
        class="flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center"
      >
        <Calendar class="size-3.5" />
        <span class="text-sm">Ver Reservas</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        onclick={() => (view = "reserving")}
        class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center"
      >
        <Plus class="size-3.5" />
        <span class="text-sm">Adicionar Reserva</span>
      </Button>
    {:else if view === "reservations"}
      <Button
        variant="outline"
        size="sm"
        onclick={() => (view = "details")}
        class="flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center"
      >
        <ChevronLeft class="size-3.5" />
        <span class="text-sm">Voltar</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        onclick={() => (view = "reserving")}
        class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center"
      >
        <Plus class="size-3.5" />
        <span class="text-sm">Adicionar Reserva</span>
      </Button>
    {:else if view === "reserving"}
      <Button
        variant="outline"
        size="sm"
        onclick={() => (view = "details")}
        class="flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center"
      >
        <ChevronLeft class="size-3.5" />
        <span class="text-sm">Voltar</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        disabled={saveDisabled}
        onclick={() => onSave()}
        class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center"
      >
        <ShieldCheck class="size-3.5" />
        <span class="text-sm">{isSaving ? "A guardar..." : "Reservar"}</span>
      </Button>
    {/if}
  </div>
</div>
