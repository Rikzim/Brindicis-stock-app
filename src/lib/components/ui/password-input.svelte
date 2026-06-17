<script>
  import { Eye, EyeOff } from "@/lib/utils/icon-map";
  import { cn } from "@/lib/utils";
  import Input from "@/lib/components/ui/input.svelte";

  let {
    class: className = "",
    value = $bindable(""),
    ...restProps
  } = $props();

  let showPassword = $state(false);
</script>

<div class="relative">
  <Input
    type={showPassword ? "text" : "password"}
    class={cn("pe-9", className)}
    bind:value
    {...restProps}
  />
  <button
    type="button"
    onclick={() => showPassword = !showPassword}
    class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {#if showPassword}
      <EyeOff size={16} />
    {:else}
      <Eye size={16} />
    {/if}
  </button>
</div>
