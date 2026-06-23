<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  type Size = "default" | "sm" | "lg" | "icon";

  type Props = {
    variant?: Variant;
    size?: Size;
    class?: string;
    children?: Snippet;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    form?: string;
    title?: string;
    "aria-label"?: string;
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
    role?: string;
    tabindex?: number | undefined;
  };

  let {
    variant = "default",
    size = "default",
    class: className = "",
    children,
    ...restProps
  }: Props = $props();

  const variants: Record<Variant, string> = {
    default:
      "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-[0_0_0_3px] hover:shadow-primary/25",
    destructive:
      "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:shadow-[0_0_0_3px] hover:shadow-destructive/25",
    outline:
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-[0_0_0_3px] hover:shadow-primary/25",
    secondary:
      "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-[0_0_0_3px] hover:shadow-primary/25",
    ghost:
      "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:shadow-[0_0_0_3px] hover:shadow-primary/25",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes: Record<Size, string> = {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-10",
  };

  let classes = $derived(
    cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      variants[variant],
      sizes[size],
      className
    )
  );
</script>

<button class={classes} {...restProps}>
  {#if children}{@render children()}{/if}
</button>
