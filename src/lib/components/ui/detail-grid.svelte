<script>
  let {
    items = [],
    columns = 2,
  } = $props();
</script>

<div class="grid grid-cols-{columns} gap-4">
  {#each items as item, i}
    <div>
      <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</span>
      <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
    </div>
  {/each}
</div>
