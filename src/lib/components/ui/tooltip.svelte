<script lang="ts">
  let { content = "", children, class: className = "" } = $props();
</script>

<div class="group relative inline-flex {className}">
  {@render children?.()}
  {#if content}
    <div
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 dark:bg-slate-700"
    >
      {content}
    </div>
  {/if}
</div>
