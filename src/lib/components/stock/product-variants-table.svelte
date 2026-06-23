<script lang="ts">
  type Variant = {
    id: number;
    color: string;
    size: string | null;
    quantity: number;
    reserved: number;
  };

  type Props = {
    variants: Variant[];
  };

  let { variants }: Props = $props();
</script>

{#if variants.length > 0}
  <div class="mx-5 my-3 rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
    <div
      class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 bg-slate-100 px-4 py-2.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider dark:bg-slate-800 dark:text-slate-300"
    >
      <span>Cor</span>
      <span>Tam.</span>
      <span class="text-right">Qtd.</span>
      <span class="text-right">Res.</span>
    </div>
    <div>
      {#each variants as v (v.id)}
        <div
          class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 px-4 py-2.5 text-sm transition-colors border-b border-slate-100 last:border-0 dark:border-slate-700/50 hover:bg-amber-50/50 dark:hover:bg-slate-700/30"
        >
          <span class="font-bold text-slate-800 dark:text-slate-200">{v.color}</span>
          <span class="text-slate-600 font-medium dark:text-slate-600">{v.size || "Único"}</span>
          <span class="font-extrabold text-right text-emerald-600">{v.quantity}</span>
          <span class="font-extrabold text-right text-amber-600">{v.reserved}</span>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center py-16 text-sm text-slate-400">
    Nenhuma variante encontrada
  </div>
{/if}
