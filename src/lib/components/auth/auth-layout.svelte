<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="min-h-dvh flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-slate-950 p-4 gap-4"
>
  <div class="flex items-center gap-2">
    <span class="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white"
      >Brindicis Stock</span
    >
  </div>
  {@render children?.()}
</div>
