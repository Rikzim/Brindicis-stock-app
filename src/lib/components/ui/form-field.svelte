<script>
  let {
    label = "",
    for: htmlFor = undefined,
    error = "",
    children,
  } = $props();
</script>

<div class="flex flex-col gap-1.5">
  <label for={htmlFor} class="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
  {@render children?.()}
  {#if error}
    <span class="text-xs text-red-500">{error}</span>
  {/if}
</div>
