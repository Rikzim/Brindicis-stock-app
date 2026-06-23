<script lang="ts">
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import MultiSearchableSelect from "$lib/components/ui/multi-searchable-select.svelte";
  import Button from "$lib/components/ui/button.svelte";

  type Filters = {
    familia: string;
    disponibilidade: string;
    cor: string;
    tamanho: string;
  };

  let {
    families = [] as { name: string }[],
    availableColors = [] as string[],
    availableSizes = [] as string[],
    pendingFilters = $bindable<Filters>({
      familia: "Todas",
      disponibilidade: "Todas",
      cor: "",
      tamanho: "",
    }),
    onApply = () => {},
    onClear = () => {},
    hasPendingChanges = false,
    activeCount = 0,
  }: {
    families?: { name: string }[];
    availableColors?: string[];
    availableSizes?: string[];
    pendingFilters?: Filters;
    onApply?: () => void;
    onClear?: () => void;
    hasPendingChanges?: boolean;
    activeCount?: number;
  } = $props();

  const availabilityOptions = [
    { value: "Todas", label: "Todas" },
    { value: "Com Stock", label: "Com Stock" },
    { value: "Esgotado", label: "Esgotado" },
  ];

  let familyOptions = $derived(families.map((f) => ({ value: f.name, label: f.name })));

  let colorOptions = $derived(availableColors.map((c) => ({ value: c, label: c })));

  let sizeOptions = $derived(availableSizes.map((s) => ({ value: s, label: s })));
</script>

<div
  class="hidden lg:block bg-slate-50 border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-300"
>
  <div class="px-4 sm:px-6 py-2">
    <div class="flex flex-col lg:flex-row lg:items-end gap-2">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 min-w-0">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300"> Família </span>
          <MultiSearchableSelect
            bind:value={pendingFilters.familia}
            options={familyOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar família..."
            emptyMessage="Nenhuma família encontrada."
            class="h-8"
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
            Disponibilidade
          </span>
          <SearchableSelect
            bind:value={pendingFilters.disponibilidade}
            options={availabilityOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhuma opção encontrada."
            class="h-8"
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300"> Cor </span>
          <MultiSearchableSelect
            bind:value={pendingFilters.cor}
            options={colorOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar cor..."
            emptyMessage="Nenhuma cor encontrada."
            class="h-8"
          />
        </div>

        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300"> Tamanho </span>
          <MultiSearchableSelect
            bind:value={pendingFilters.tamanho}
            options={sizeOptions}
            placeholder="Todos"
            searchPlaceholder="Procurar tamanho..."
            emptyMessage="Nenhum tamanho encontrado."
            class="h-8"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <div class="flex items-center gap-2">
          {#if activeCount > 0}
            <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {activeCount}
              {activeCount === 1 ? "filtro ativo" : "filtros ativos"}
            </span>
            <button
              type="button"
              onclick={onClear}
              class="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 min-h-touch inline-flex items-center"
            >
              Limpar
            </button>
          {:else}
            <span class="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap"
              >Nenhum filtro ativo</span
            >
          {/if}
          {#if hasPendingChanges}
            <span
              class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap"
            >
              <span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Alterações por aplicar
            </span>
          {/if}
        </div>
        <Button
          type="button"
          onclick={onApply}
          disabled={!hasPendingChanges}
          class="h-8 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-4 rounded-lg text-xs font-semibold shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Aplicar Filtros</span>
        </Button>
      </div>
    </div>
  </div>
</div>
