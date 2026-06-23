<script>
  import {
    Image,
    ChevronLeft,
    ChevronRight,
    X,
    FileText,
    Calendar,
    Plus,
  } from "@/lib/utils/icon-map";
  import AuthedImage from "@/lib/components/ui/authed-image.svelte";
  import Tooltip from "@/lib/components/ui/tooltip.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";
  import CreateReservationPanel from "./create-reservation-modal.svelte";
  import ProductReservationsPanel from "./product-reservations-panel.svelte";

  let {
    product,
    onClose = () => {},
    onProductChange = () => {},
  } = $props();

  let view = $state("details");
  let selectedColor = $state("");
  let selectedSize = $state("");
  let currentImageIndex = $state(0);
  let nameEl = $state(null);
  let descEl = $state(null);
  let nameOverflows = $state(false);
  let descOverflows = $state(false);

  $effect(() => {
    if (nameEl) nameOverflows = nameEl.scrollWidth > nameEl.clientWidth;
  });

  $effect(() => {
    if (descEl) descOverflows = descEl.scrollWidth > descEl.clientWidth;
  });

  // Reset to detail view when switching products
  $effect(() => {
    product.id;
    view = "details";
    selectedColor = "";
    selectedSize = "";
    currentImageIndex = 0;
  });

  function formatDate(dateStr) {
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

  let filteredVariants = $derived.by(() => {
    const variants = product.variants || [];
    return variants.filter((v) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    });
  });

  let totalStock = $derived(product.quantity - product.reserved);
  let filteredStock = $derived(
    filteredVariants.reduce((sum, v) => sum + (v.quantity - v.reserved), 0)
  );
  let displayQuantity = $derived(selectedColor || selectedSize ? filteredStock : totalStock);

  let images = $derived(product.images || []);
  let currentImage = $derived(images[currentImageIndex] ?? null);
  let hasImages = $derived(images.length > 0);

  function goPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  }
  function goNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
  }

</script>

<div class="flex h-full w-full md:w-[460px] shrink-0 flex-col overflow-hidden bg-white border-2 border-slate-200 rounded-2xl shadow-sm relative dark:bg-slate-900 dark:border-slate-700">
  {#if view === "reserving"}
    <CreateReservationPanel
      {product}
      onClose={() => view = "details"}
      onSuccess={onProductChange}
    />
  {:else if view === "reservations"}
    <ProductReservationsPanel
      {product}
      onClose={() => view = "details"}
      onAddReservation={() => view = "reserving"}
      onProductChange={onProductChange}
    />
  {:else}
    <Button variant="ghost" size="icon" onclick={onClose} class="absolute top-3 right-3 z-10 size-7 hover:bg-slate-200 dark:hover:bg-slate-700">
      <X class="size-4" />
    </Button>

    <div class="flex-1 flex flex-col overflow-hidden min-h-0">
      <div class="flex-1 flex flex-col min-h-0">

        <!-- HEADER - Imagem + Nome -->
        <div class="flex bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0 min-h-[150px]">
          <!-- Imagem -->
          <div class="relative w-[140px] shrink-0 bg-slate-100 border-r border-slate-200 dark:bg-slate-950 dark:border-slate-700 overflow-hidden">
            <div class="flex flex-col">
              <div class="aspect-square">
                {#if currentImage}
                  <AuthedImage path={currentImage.url} width={400} alt={product.name} class="absolute inset-0 size-full object-contain" />
                {:else}
                  <div class="absolute inset-0 flex items-center justify-center">
                    <Image class="text-slate-300 size-9 mb-0.5 dark:text-slate-600" />
                    <span class="text-[9px] font-bold text-slate-600 tracking-wider absolute bottom-2 dark:text-slate-600">
                      SEM IMAGEM
                    </span>
                  </div>
                {/if}
              </div>

              {#if hasImages && images.length > 1}
                <div class="absolute left-1 top-1/2 -translate-y-1/2 z-10">
                  <Button variant="secondary" size="icon" onclick={goPrevImage} class="size-6 opacity-80 hover:opacity-100">
                    <ChevronLeft class="size-3.5" />
                  </Button>
                </div>
                <div class="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                  <Button variant="secondary" size="icon" onclick={goNextImage} class="size-6 opacity-80 hover:opacity-100">
                    <ChevronRight class="size-3.5" />
                  </Button>
                </div>
                <div class="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-10">
                  {#each images as _, i}
                    <div
                      class="size-1.5 rounded-full transition-all duration-300 {i === currentImageIndex ? 'bg-amber-400 dark:bg-amber-400 w-3' : 'bg-slate-300 dark:bg-slate-700'}"
                    ></div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <!-- Nome e Badges -->
          <div class="flex-1 flex flex-col justify-between min-w-0 p-5">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">
                REF. {product.ref}
              </span>
              <Tooltip content={nameOverflows ? product.name : ""} class="w-full">
                <h2 bind:this={nameEl} class="text-xl font-extrabold text-slate-900 uppercase leading-tight dark:text-slate-50 truncate">
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
              <div class="inline-flex items-center rounded-lg bg-[#FBBF24] px-3 py-1 text-sm font-bold text-[#1F2937] shadow-sm">
                {product.quantity} <span class="font-semibold opacity-80 ml-1">unidades</span>
              </div>
              <span class="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {product.pvp.toFixed(2)} €{" "}
                <span class="text-xs font-bold text-slate-600 ml-0.5 dark:text-slate-600">PVP</span>
              </span>
            </div>
          </div>
        </div>

        <!-- FILTROS - Cor / Tamanho / Disponibilidade -->
        <div class="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
          <div class="px-5 py-4">
            <span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest mb-3 block dark:text-slate-600">
              Filtrar Variantes
            </span>
            <div class="grid grid-cols-3 gap-3">
              {#if product.colors && product.colors.length > 0}
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                    Cor
                  </span>
                  <SearchableSelect
                    bind:value={selectedColor}
                    options={[
                      { value: "", label: "Todas" },
                      ...product.colors.map((c) => ({ value: c.name, label: c.name })),
                    ]}
                    placeholder="Todas"
                    searchPlaceholder="Procurar..."
                    emptyMessage="Nenhuma cor."
                  />
                </div>
              {/if}

              {#if product.sizes && product.sizes.length > 0}
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                    Tamanho
                  </span>
                  <SearchableSelect
                    bind:value={selectedSize}
                    options={[
                      { value: "", label: "Todos" },
                      ...product.sizes.map((s) => ({ value: s.size, label: s.size })),
                    ]}
                    placeholder="Todos"
                    searchPlaceholder="Procurar..."
                    emptyMessage="Nenhum tamanho."
                  />
                </div>
              {/if}

              <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                  Disponível
                </span>
                <span class="inline-flex items-center w-fit rounded-lg px-2 py-0.5 text-sm font-bold shadow-sm {displayQuantity === 0 ? 'bg-red-100 text-red-600' : 'bg-[#FBBF24] text-[#1F2937]'}">
                  {displayQuantity} <span class="font-semibold opacity-80 ml-1">un.</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- TABELA DE VARIANTES -->
        {#if filteredVariants.length > 0}
          <div class="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 flex-1 min-h-0 overflow-hidden flex flex-col">
            <div class="px-5 py-3 shrink-0">
              <span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest mb-2 block dark:text-slate-600">
                Variantes ({filteredVariants.length})
              </span>
            </div>
            <div class="mx-5 mb-4 rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700 flex-1 min-h-0 flex flex-col">
              <div class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 bg-slate-100 px-4 py-2.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider shrink-0 dark:bg-slate-800 dark:text-slate-300">
                <span>Cor</span>
                <span>Tam.</span>
                <span class="text-right">Qtd.</span>
                <span class="text-right">Res.</span>
              </div>
              <div class="flex-1 min-h-0 overflow-y-auto">
                {#each filteredVariants as v (v.id)}
                  <div
                    class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 px-4 py-2.5 text-sm transition-colors duration-150 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50 hover:bg-amber-50/50 dark:hover:bg-slate-700/30"
                  >
                    <span class="font-bold text-slate-800 dark:text-slate-200">{v.color}</span>
                    <span class="text-slate-600 font-medium dark:text-slate-600">{v.size || "Único"}</span>
                    <span class="font-extrabold text-right text-emerald-600">{v.quantity}</span>
                    <span class="font-extrabold text-right text-amber-600">{v.reserved}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- DADOS DO PRODUTO -->
        <div class="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
          <div class="px-5 py-2.5">
            <span class="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest mb-2 block dark:text-slate-600">
              Dados do Produto
            </span>
            <div class="grid grid-cols-3 gap-x-4 gap-y-1">
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-600">CX.</span>
                <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.cx || "—"}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-600">NÚMERO</span>
                <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.number ?? "N/A"}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-600">FAMÍLIA</span>
                <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.family?.name || "—"}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-600">GAVETA</span>
                <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.drawer || "—"}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:text-slate-600">P.C.</span>
                <span class="text-xs font-extrabold text-amber-600 dark:text-amber-400">{product.pc.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DESCRIÇÃO -->
        {#if product.description}
          <div class="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
            <div class="px-5 py-2.5">
              <div class="flex items-center gap-1.5 mb-1">
                <FileText class="size-3.5 shrink-0 text-slate-600 dark:text-slate-600" />
                <span class="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest dark:text-slate-600">Descrição</span>
              </div>
              <Tooltip content={descOverflows ? product.description : ""} class="w-full">
                <p bind:this={descEl} class="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300 line-clamp-2">
                  {product.description}
                </p>
              </Tooltip>
            </div>
          </div>
        {/if}

        <!-- DATAS -->
        <div class="bg-white px-5 py-2 dark:bg-slate-800/50 shrink-0">
          <div class="flex items-center">
            <p class="flex-1 text-[10px] text-slate-600 font-semibold dark:text-slate-600">
              Criado em{" "}
              <span class="font-bold text-slate-600 dark:text-slate-300">
                {formatDate(product.createdAt)}
              </span>
            </p>
            <span class="text-slate-300 dark:text-slate-600">|</span>
            <p class="flex-1 text-[10px] text-slate-600 font-semibold dark:text-slate-600 text-right">
              Atualizado em{" "}
              <span class="font-bold text-slate-600 dark:text-slate-300">
                {formatDate(product.updatedAt)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t-2 border-slate-200 bg-slate-50 px-6 py-3 flex items-center gap-3 dark:border-slate-700 dark:bg-slate-800 shrink-0">
      <Button variant="outline" size="sm" onclick={() => view = "reservations"} class="flex-1 h-[45.5px] border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center">
        <Calendar class="size-3.5" />
        <span class="text-[14px]">Ver Reservas</span>
      </Button>
      <Button variant="default" size="sm" onclick={() => view = "reserving"} class="flex-1 h-[45.5px] bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center">
        <Plus class="size-3.5" />
        <span class="text-[14px]">Adicionar Reserva</span>
      </Button>
    </div>
  {/if}
</div>
