<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = "", children, ...restProps } = $props();
</script>

<div
  class={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
  {...restProps}
>
  {@render children?.()}
</div>
