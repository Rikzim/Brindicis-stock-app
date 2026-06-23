<script lang="ts">
  import { cn } from "$lib/utils";

  let { variant = "default", class: className = "", children, ...restProps } = $props();

  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow-sm",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
    outline: "text-foreground",
  };
</script>

<span
  class={cn(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variants[variant],
    className
  )}
  {...restProps}
>
  {@render children?.()}
</span>
