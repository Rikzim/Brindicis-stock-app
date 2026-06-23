<script>
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";

  let {
    families = [],
    availableColors = [],
    availableSizes = [],
    filters = $bindable({
      familia: "Todas",
      disponibilidade: "Todas",
      cor: "Todas",
      tamanho: "Todas",
    }),
  } = $props();

  const availabilityOptions = [
    { value: "Todas", label: "Todas" },
    { value: "Com Stock", label: "Com Stock" },
    { value: "Esgotado", label: "Esgotado" },
  ];

  let familyOptions = $derived([
    { value: "Todas", label: "Todas" },
    ...families.map((f) => ({ value: f.name, label: f.name })),
  ]);

  let colorOptions = $derived([
    { value: "Todas", label: "Todas" },
    ...availableColors.map((c) => ({ value: c, label: c })),
  ]);

  let sizeOptions = $derived([
    { value: "Todas", label: "Todas" },
    ...availableSizes.map((s) => ({ value: s, label: s })),
  ]);

  function setFilter(key, value) {
    filters = { ...filters, [key]: value };
  }
</script>

<div class="bg-slate-50 border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-300">
  <div class="px-6 py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
          Família
        </span>
        <SearchableSelect
          bind:value={filters.familia}
          options={familyOptions}
          placeholder="Todas"
          searchPlaceholder="Procurar família..."
          emptyMessage="Nenhuma família encontrada."
        />
      </div>

      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
          Disponibilidade
        </span>
        <SearchableSelect
          bind:value={filters.disponibilidade}
          options={availabilityOptions}
          placeholder="Todas"
          searchPlaceholder="Procurar..."
          emptyMessage="Nenhuma opção encontrada."
        />
      </div>

      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
          Cor
        </span>
        <SearchableSelect
          bind:value={filters.cor}
          options={colorOptions}
          placeholder="Todas"
          searchPlaceholder="Procurar cor..."
          emptyMessage="Nenhuma cor encontrada."
        />
      </div>

      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
          Tamanho
        </span>
        <SearchableSelect
          bind:value={filters.tamanho}
          options={sizeOptions}
          placeholder="Todas"
          searchPlaceholder="Procurar tamanho..."
          emptyMessage="Nenhum tamanho encontrado."
        />
      </div>
    </div>
  </div>
</div>
