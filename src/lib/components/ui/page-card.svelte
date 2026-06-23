<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = "", children, ...restProps } = $props();
</script>

<div
  class={cn(
    "bg-white rounded-2xl border-2 border-slate-200 shadow-sm transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
