<script>
  import { cn } from "@/lib/utils";
  import { getImageUrl } from "@/lib/utils";
  import { Package } from "@/lib/utils/icon-map";

  let {
    name = "",
    reference = "",
    quantity = 0,
    colors = undefined,
    image = undefined,
    isSelected = false,
    onClick = () => {},
  } = $props();

  let imgSrc = $derived(getImageUrl(image));
</script>

<button
  type="button"
  onclick={onClick}
  class={cn(
    "flex items-stretch rounded-2xl text-left w-full transition-all duration-200 border-2 animate-in fade-in duration-200 overflow-hidden cursor-pointer",
    isSelected
      ? "border-amber-400 shadow-md dark:border-amber-400"
      : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:hover:border-slate-600"
  )}
>
  <div class="flex w-[90px] shrink-0 items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500">
    {#if imgSrc}
      <img
        src={imgSrc}
        alt={name}
        class="size-full object-cover"
      />
    {:else}
      <Package class="size-8" />
    {/if}
  </div>
  <div class="flex-1 flex flex-col justify-center gap-0.5 px-4 py-3 bg-white dark:bg-slate-800">
    <p class="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">{reference}</p>
    <p class="truncate text-sm">
      <span class="text-slate-500 font-semibold dark:text-slate-400">Qtd: </span>
      <span class="text-amber-600 dark:text-amber-400 font-extrabold">{quantity}</span>
    </p>
    {#if colors}
      <p class="truncate text-xs">
        <span class="text-slate-500 font-semibold dark:text-slate-400">Cor: </span>
        <span class="text-slate-700 font-medium dark:text-slate-300">{colors}</span>
      </p>
    {/if}
  </div>
</button>
