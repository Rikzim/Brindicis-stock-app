<script lang="ts">
  import { X } from "lucide-svelte";
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import MultiSearchableSelect from "$lib/components/ui/multi-searchable-select.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import { fly, fade } from "svelte/transition";

  type Filters = {
    familia: string;
    disponibilidade: string;
    cor: string;
    tamanho: string;
  };

  let {
    open = $bindable(false),
    pendingFilters = $bindable<Filters>({
      familia: "",
      disponibilidade: "Todas",
      cor: "",
      tamanho: "",
    }),
    families = [] as { name: string }[],
    availableColors = [] as string[],
    availableSizes = [] as string[],
    onApply = () => {},
    onClear = () => {},
  }: {
    open?: boolean;
    pendingFilters?: Filters;
    families?: { name: string }[];
    availableColors?: string[];
    availableSizes?: string[];
    onApply?: () => void;
    onClear?: () => void;
  } = $props();

  const availabilityOptions = [
    { value: "Todas", label: "Todas" },
    { value: "Com Stock", label: "Com Stock" },
    { value: "Esgotado", label: "Esgotado" },
  ];

  let familyOptions = $derived(families.map((f) => ({ value: f.name, label: f.name })));

  let colorOptions = $derived(availableColors.map((c) => ({ value: c, label: c })));

  let sizeOptions = $derived(availableSizes.map((s) => ({ value: s, label: s })));

  let activeCount = $derived(
    (pendingFilters.familia ? 1 : 0) +
      (pendingFilters.disponibilidade !== "Todas" ? 1 : 0) +
      (pendingFilters.cor ? 1 : 0) +
      (pendingFilters.tamanho ? 1 : 0)
  );

  function close() {
    open = false;
  }

  function apply() {
    onApply();
    close();
  }

  $effect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape" && open) close();
  }}
/>

{#if open}
  <button
    type="button"
    class="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-default"
    aria-label="Fechar filtros"
    onclick={close}
    transition:fade={{ duration: 200 }}
  ></button>

  <div
    class="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl flex flex-col max-h-[85dvh] pb-safe"
    role="dialog"
    aria-modal="true"
    aria-label="Filtros"
    tabindex="-1"
    transition:fly={{ y: 400, duration: 280 }}
  >
    <div class="flex flex-col items-center pt-2 pb-1 shrink-0">
      <div class="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
    </div>

    <div
      class="flex items-center justify-between px-4 py-2 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"
    >
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">Filtros</h3>
      <div class="flex items-center gap-2">
        {#if activeCount > 0}
          <button
            type="button"
            onclick={onClear}
            class="text-xs font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded min-h-touch dark:text-amber-400"
          >
            Limpar
          </button>
        {/if}
        <Button variant="ghost" size="icon" onclick={close} class="size-10" aria-label="Fechar">
          <X class="size-4" />
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Família</span>
          <MultiSearchableSelect
            bind:value={pendingFilters.familia}
            options={familyOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar família..."
            emptyMessage="Nenhuma família encontrada."
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300"
            >Disponibilidade</span
          >
          <SearchableSelect
            bind:value={pendingFilters.disponibilidade}
            options={availabilityOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhuma opção encontrada."
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Cor</span>
          <MultiSearchableSelect
            bind:value={pendingFilters.cor}
            options={colorOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar cor..."
            emptyMessage="Nenhuma cor encontrada."
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Tamanho</span>
          <MultiSearchableSelect
            bind:value={pendingFilters.tamanho}
            options={sizeOptions}
            placeholder="Todos"
            searchPlaceholder="Procurar tamanho..."
            emptyMessage="Nenhum tamanho encontrado."
          />
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-3 px-4 py-3 border-t-2 border-slate-100 dark:border-slate-700 shrink-0"
    >
      <Button
        onclick={apply}
        class="flex-1 h-12 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center"
      >
        Aplicar
      </Button>
    </div>
  </div>
{/if}
