<script>
  import { X, Info, ShieldCheck, ChevronLeft, Plus } from "@/lib/utils/icon-map";
  import { toast } from "svelte-sonner";
  import { createReservation, getReservations, getCommercialUsers, getQuotes } from "@/lib/utils/stock-api";
  import { authStore } from "@/lib/state/auth-store";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import Button from "@/lib/components/ui/button.svelte";

  let {
    product,
    onClose = () => {},
    onSuccess = () => {},
  } = $props();

  const reservationsStore = createAsyncStore(() => getReservations());
  const commercialUsersStore = createAsyncStore(getCommercialUsers);
  const quotesStore = createAsyncStore(() => getQuotes({ limit: 200 }));

  let selectedColor = $state("");
  let selectedSize = $state("");
  let selectedQty = $state(0);
  let reservationLines = $state([]);
  let formState = $state({
    userId: "",
    mensagem: "",
    quoteId: "",
  });
  let isSubmitting = $state(false);

  // Set default user
  $effect(() => {
    const user = $authStore.user;
    if (user?.id && !formState.userId) {
      formState.userId = user.id.toString();
    }
  });

  // Reset selections when product changes
  $effect(() => {
    selectedColor = "";
    selectedSize = "";
    selectedQty = 0;
    reservationLines = [];
  });

  let colorOptions = $derived(
    [...new Set(product.variants?.map((v) => v.color) || [])]
      .map((c) => {
        const total = (product.variants || [])
          .filter((v) => v.color === c)
          .reduce((sum, v) => sum + (v.quantity - v.reserved), 0);
        return { value: c, label: `${c} (${total})` };
      })
  );

  let filteredSizes = $derived(
    (product.variants || []).filter((v) => v.color === selectedColor)
  );

  let sizeOptions = $derived(
    filteredSizes
      .map((v) => ({ value: v.size || "", label: `${v.size || "Único"} (${v.quantity - v.reserved})` }))
      .filter((v, i, a) => a.findIndex((x) => x.value === v.value) === i)
  );

  let selectedVariant = $derived(
    filteredSizes.find((v) => (v.size || "") === (selectedSize || "")) ?? null
  );

  let availableForSelection = $derived(
    selectedVariant
      ? selectedVariant.quantity - selectedVariant.reserved
      : selectedColor
        ? (product.variants || [])
            .filter((v) => v.color === selectedColor)
            .reduce((sum, v) => sum + (v.quantity - v.reserved), 0)
        : 0
  );

  let linesForVariant = $derived(
    reservationLines.filter(
      (l) => l.color === selectedColor && l.size === (selectedSize || null)
    )
  );

  let reservedForVariant = $derived(
    linesForVariant.reduce((s, l) => s + l.qty, 0)
  );

  let totalReservedQty = $derived(
    reservationLines.reduce((sum, l) => sum + l.qty, 0)
  );

  let userOptions = $derived(
    (commercialUsersStore.data || []).map((u) => ({ value: u.id.toString(), label: u.name }))
  );
  let quoteOptions = $derived(
    (quotesStore.data?.data || []).map((q) => ({ value: q.id.toString(), label: q.reference }))
  );

  function handleAddLine() {
    if (!selectedColor || selectedQty <= 0) return;
    if (!selectedVariant && product.variants?.length) return;

    if (selectedQty > availableForSelection - reservedForVariant) {
      toast.error(`Apenas ${availableForSelection - reservedForVariant} unidades disponíveis.`);
      return;
    }

    reservationLines = [
      ...reservationLines,
      { color: selectedColor, size: selectedSize || null, qty: selectedQty },
    ];
    selectedQty = 0;
  }

  function handleRemoveLine(index) {
    reservationLines = reservationLines.filter((_, i) => i !== index);
  }

  async function handleSave() {
    if (reservationLines.length === 0) {
      toast.error("Adicione pelo menos uma linha de reserva.");
      return;
    }
    if (!formState.userId) {
      toast.error("Selecione um comercial.");
      return;
    }

    isSubmitting = true;
    try {
      await Promise.all(reservationLines.map((line) =>
        createReservation({
          userId: parseInt(formState.userId),
          id_product: product.id,
          quantity: line.qty,
          color: line.color,
          size: line.size || undefined,
          message: formState.mensagem || undefined,
          quoteId: formState.quoteId ? parseInt(formState.quoteId) : undefined,
        })
      ));
      toast.success("Reservas criadas com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar reservas. Tente novamente.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200">
  <!-- Header -->
  <div class="flex items-start justify-between p-5 pb-3">
    <div class="flex flex-col">
      <span class="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">
        NOVA RESERVA
      </span>
      <h2 class="text-xl font-extrabold text-slate-850 dark:text-slate-100 leading-tight">
        Criar Reserva
      </h2>
    </div>
    <Button variant="ghost" size="icon" onclick={onClose} class="size-7">
      <X class="size-4" />
    </Button>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-5">
    <!-- Section: Selecionar Variante -->
    <div class="flex flex-col gap-3">
      <span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
        SELECIONAR VARIANTE
      </span>

      <div class="grid grid-cols-[1fr_1fr_80px] gap-3 items-end">
        <!-- Color -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Cor</span>
          <SearchableSelect
            bind:value={selectedColor}
            options={colorOptions}
            placeholder="Selecionar cor"
            searchPlaceholder="Procurar..."
            emptyMessage="Sem cores disponíveis."
          />
        </div>

        <!-- Size -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Tamanho</span>
          <SearchableSelect
            bind:value={selectedSize}
            options={sizeOptions}
            placeholder="Selecionar tamanho"
            searchPlaceholder="Procurar..."
            emptyMessage="Sem tamanhos."
          />
        </div>

        <!-- Qty -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Qtd</span>
          <Input
            type="number"
            min="0"
            max={Math.max(availableForSelection, 0)}
            bind:value={selectedQty}
            placeholder="0"
            class="h-9 text-center"
          />
        </div>
      </div>

      <Button
        onclick={handleAddLine}
        disabled={!selectedColor || selectedQty <= 0}
        class="w-full h-9 bg-amber-400 hover:bg-amber-500 text-[#1F2937] font-semibold shadow-none rounded-lg"
      >
        <Plus class="size-4" />
        <span>Adicionar linha</span>
      </Button>

      {#if selectedColor}
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-600">Disponível:</span>
          <span class="inline-flex items-center rounded-lg bg-[#FBBF24] px-2 py-0.5 text-sm font-bold text-[#1F2937] shadow-sm">
            {availableForSelection}
          </span>
          <span class="text-xs font-semibold text-slate-600">un.</span>
        </div>
      {/if}
    </div>

    <!-- Lines list -->
    {#if reservationLines.length > 0}
      <div class="flex flex-col gap-2">
        <span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
          Linhas a reservar ({totalReservedQty} un.)
        </span>
        <div class="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {#each reservationLines as line, i}
            <div class="flex items-center justify-between px-3 py-2.5">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {line.color}{line.size ? ` / ${line.size}` : ""}
              </span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-extrabold text-amber-600">{line.qty}</span>
                <button
                  type="button"
                  onclick={() => handleRemoveLine(i)}
                  class="size-8 flex items-center justify-center rounded-md text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remover"
                >
                  <X class="size-4" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="border-t border-slate-100/80 dark:border-slate-800/40"></div>

    <!-- Form Fields -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="comercial" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
          COMERCIAL
        </label>
        <SearchableSelect
          id="comercial"
          bind:value={formState.userId}
          options={userOptions}
          placeholder="Selecionar comercial"
          searchPlaceholder="Pesquisar comercial..."
          emptyMessage="Nenhum comercial encontrado."
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="quote" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
          ORÇAMENTO
        </label>
        <SearchableSelect
          id="quote"
          bind:value={formState.quoteId}
          options={quoteOptions}
          placeholder="Selecionar orçamento (opcional)"
          searchPlaceholder="Procurar por referência..."
          emptyMessage="Nenhum orçamento encontrado."
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="mensagem" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
          MENSAGEM
        </label>
        <textarea
          id="mensagem"
          aria-label="Mensagem"
          bind:value={formState.mensagem}
          placeholder="Adicionar mensagem..."
          class="h-22 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-700"
        ></textarea>
      </div>


    </div>

    <!-- Helper note -->
    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-600/90 dark:text-slate-600">
      <Info class="size-4 shrink-0 text-slate-600/80 dark:text-slate-650" />
      <span>As reservas são válidas por 8 dias úteis.</span>
    </div>
  </div>

  <!-- Footer Buttons -->
  <div class="absolute bottom-0 left-0 right-0 border-t-2 border-slate-200 bg-slate-50 px-6 py-3 flex items-center gap-3 dark:border-slate-700 dark:bg-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <Button variant="outline" onclick={onClose} class="h-11 px-5">
      <ChevronLeft class="size-4" />
      <span>Voltar</span>
    </Button>

    <Button variant="default" disabled={isSubmitting || reservationLines.length === 0} onclick={handleSave} class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-semibold active:scale-95">
      <ShieldCheck class="size-4" />
      <span>{isSubmitting ? "A guardar..." : "Reservar"}</span>
    </Button>
  </div>
</div>
