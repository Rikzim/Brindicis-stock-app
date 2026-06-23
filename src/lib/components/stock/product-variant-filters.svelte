<script lang="ts">
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";

  type Props = {
    colors: Array<{ name: string }>;
    sizes: Array<{ size: string }>;
    selectedColor: string;
    selectedSize: string;
    displayQuantity: number;
    compact?: boolean;
  };

  let {
    colors,
    sizes,
    selectedColor = $bindable(""),
    selectedSize = $bindable(""),
    displayQuantity,
    compact = false,
  }: Props = $props();
</script>

<div class="px-5 py-3">
  <span
    class="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest mb-2.5 block dark:text-slate-600"
  >
    Filtrar Variantes
  </span>
  <div class="grid grid-cols-3 gap-3">
    {#if colors && colors.length > 0}
      <div class="flex flex-col gap-0.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cor</span>
        <SearchableSelect
          bind:value={selectedColor}
          options={[
            { value: "", label: "Todas" },
            ...colors.map((c) => ({ value: c.name, label: c.name })),
          ]}
          placeholder="Todas"
        />
      </div>
    {/if}
    {#if sizes && sizes.length > 0}
      <div class="flex flex-col gap-0.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tamanho</span>
        <SearchableSelect
          bind:value={selectedSize}
          options={[
            { value: "", label: "Todos" },
            ...sizes.map((s) => ({ value: s.size, label: s.size })),
          ]}
          placeholder="Todos"
        />
      </div>
    {/if}
    <div class="flex flex-col gap-0.5">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponível</span>
      <span
        class="inline-flex items-center w-fit rounded-lg px-2.5 py-1 text-sm font-bold shadow-sm {displayQuantity ===
        0
          ? 'bg-red-100 text-red-600'
          : 'bg-[#FBBF24] text-[#1F2937]'}"
      >
        {displayQuantity}
        <span class="font-semibold opacity-80 ml-1">un.</span>
      </span>
    </div>
  </div>
</div>
