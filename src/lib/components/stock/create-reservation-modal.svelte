<script>
  import { X, Info, ShieldCheck, ChevronLeft } from "@/lib/utils/icon-map";
  import { toast } from "svelte-sonner";
  import { createReservation, getReservations, getUsers } from "@/lib/utils/stock-api";
  import { authStore } from "@/lib/state/auth-store";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";
  import Button from "@/lib/components/ui/button.svelte";

  let {
    product,
    onClose = () => {},
  } = $props();

  const reservationsStore = createAsyncStore(() => getReservations());
  const usersStore = createAsyncStore(getUsers);

  let quantities = $state({});
  let formState = $state({
    comercial: "",
    encomenda: "—",
    mensagem: "",
    orcamento: false,
  });
  let isSubmitting = $state(false);

  // Initialize quantities
  $effect(() => {
    const initial = {};
    product.colors?.forEach((c) => {
      initial[c.name] = 0;
    });
    if (product.colors?.length === 0) {
      initial["default"] = 0;
    }
    quantities = initial;
  });

  // Set user name
  $effect(() => {
    const user = $authStore.user;
    if (user?.name && !formState.comercial) {
      formState.comercial = user.name;
    }
  });

  let comercialOptions = $derived.by(() => {
    const set = new Set();
    const user = $authStore.user;
    if (user?.name) set.add(user.name);
    (usersStore.data || []).forEach((u) => { if (u.name) set.add(u.name); });
    (reservationsStore.data || []).forEach((r) => { if (r.name) set.add(r.name); });
    return Array.from(set).map((name) => ({ value: name, label: name }));
  });

  let encomendaOptions = $derived.by(() => {
    const set = new Set();
    (reservationsStore.data || []).forEach((r) => { if (r.order) set.add(r.order); });
    return Array.from(set).map((order) => ({ value: order, label: order }));
  });

  function getAvailableForColor(colorName) {
    if (colorName === "default") return product.quantity - product.reserved;
    const colorVariants = product.variants?.filter((v) => v.color === colorName) || [];
    if (colorVariants.length > 0) {
      return colorVariants.reduce((sum, v) => sum + (v.quantity - v.reserved), 0);
    }
    return product.quantity - product.reserved;
  }

  function handleQuantityChange(color, delta) {
    const current = quantities[color] || 0;
    const next = Math.max(0, current + delta);
    const available = getAvailableForColor(color);
    if (next > available) {
      toast.error(`Apenas ${available} unidades disponíveis para a cor ${color}.`);
      return;
    }
    quantities = { ...quantities, [color]: next };
  }

  async function handleSave() {
    const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalQty === 0) {
      toast.error("Por favor, selecione pelo menos 1 unidade.");
      return;
    }

    if (!formState.comercial.trim()) {
      toast.error("O campo Comercial é obrigatório.");
      return;
    }

    isSubmitting = true;
    const reservationPromises = [];

    const variantByColor = new Map(product.variants?.map((v) => [v.color, v]));

    try {
      for (const [colorName, qty] of Object.entries(quantities)) {
        if (qty > 0) {
          const variant = variantByColor.get(colorName);

          const payload = {
            name: formState.comercial,
            id_product: product.id,
            quantity: qty,
            color: colorName === "default" ? "" : colorName,
            size: variant?.size || undefined,
            message: formState.mensagem || undefined,
            order: (formState.encomenda === "—" || !formState.encomenda) ? undefined : formState.encomenda,
            proposal: formState.orcamento ? 1 : 0,
          };

          reservationPromises.push(createReservation(payload));
        }
      }

      await Promise.all(reservationPromises);
      toast.success("Reserva criada com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar reserva. Tente novamente.");
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
    <!-- Section: Selecionar Quantidades -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
        SELECIONAR QUANTIDADES
      </span>

      <!-- Table Header -->
      <div class="flex justify-between text-[10px] font-bold text-slate-400/90 tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800/40">
        <span>Cor</span>
        <div class="flex gap-12 pr-2">
          <span>Quantidade</span>
          <span>Disponível</span>
        </div>
      </div>

      <!-- Rows -->
      <div class="flex flex-col max-h-[160px] overflow-y-auto pr-1">
        {#if product.colors && product.colors.length > 0}
          {#each product.colors as c (c.name)}
            {@const qty = quantities[c.name] || 0}
            {@const available = getAvailableForColor(c.name)}
            <div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0 dark:border-slate-800/40">
              <div class="flex items-center">
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {c.name}
                </span>
              </div>
              <div class="flex items-center gap-10">
                <div class="flex items-center h-8 rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
                  <button
                    type="button"
                    onclick={() => handleQuantityChange(c.name, -1)}
                    class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-medium dark:hover:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
                  >
                    —
                  </button>
                  <span class="w-10 text-center text-xs font-semibold text-slate-750 dark:text-slate-350">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onclick={() => handleQuantityChange(c.name, 1)}
                    class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-800"
                  >
                    +
                  </button>
                </div>
                <span class="w-12 text-right text-sm font-bold text-slate-800 dark:text-slate-300">
                  {available}
                </span>
              </div>
            </div>
          {/each}
        {:else}
          {@const qty = quantities["default"] || 0}
          {@const available = getAvailableForColor("default")}
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Geral</span>
            </div>
            <div class="flex items-center gap-10">
              <div class="flex items-center h-8 rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
                <button
                  type="button"
                  onclick={() => handleQuantityChange("default", -1)}
                  class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
                >
                  —
                </button>
                <span class="w-10 text-center text-xs font-semibold text-slate-750 dark:text-slate-350">
                  {qty}
                </span>
                <button
                  type="button"
                  onclick={() => handleQuantityChange("default", 1)}
                  class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-800"
                >
                  +
                </button>
              </div>
              <span class="w-12 text-right text-sm font-bold text-slate-800 dark:text-slate-300">
                {available}
              </span>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="border-t border-slate-100/80 dark:border-slate-800/40"></div>

    <!-- Form Fields -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="comercial" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          COMERCIAL
        </label>
        <SearchableSelect
          id="comercial"
          bind:value={formState.comercial}
          options={comercialOptions}
          placeholder="Selecionar comercial"
          searchPlaceholder="Pesquisar comercial..."
          emptyMessage="Nenhum comercial encontrado. Digite para adicionar."
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="encomenda" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          Nº ENCOMENDA
        </label>
        <SearchableSelect
          id="encomenda"
          bind:value={formState.encomenda}
          options={encomendaOptions}
          placeholder="Selecionar encomenda"
          searchPlaceholder="Pesquisar encomenda..."
          emptyMessage="Nenhuma encomenda encontrada. Digite para adicionar."
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="mensagem" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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

      <div class="flex items-center gap-2.5 py-1">
        <input
          type="checkbox"
          id="orcamento"
          bind:checked={formState.orcamento}
          class="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
        />
        <label
          for="orcamento"
          class="text-sm font-semibold text-slate-750 dark:text-slate-200 cursor-pointer select-none"
        >
          Orçamento
        </label>
      </div>
    </div>

    <!-- Helper note -->
    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400/90 dark:text-slate-500">
      <Info class="size-4 shrink-0 text-slate-400/80 dark:text-slate-650" />
      <span>As reservas são válidas por 5 dias.</span>
    </div>
  </div>

  <!-- Footer Buttons -->
  <div class="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <Button variant="outline" onclick={onClose} class="h-11 px-5">
      <ChevronLeft class="size-4" />
      <span>Voltar</span>
    </Button>

    <Button variant="default" disabled={isSubmitting} onclick={handleSave} class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-semibold active:scale-95">
      <ShieldCheck class="size-4" />
      <span>{isSubmitting ? "A guardar..." : "Reservar"}</span>
    </Button>
  </div>
</div>
