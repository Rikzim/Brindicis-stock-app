<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { Filter, ChevronDown, X } from "lucide-svelte";
  import Button from "$lib/components/ui/button.svelte";
  import PageCard from "$lib/components/ui/page-card.svelte";

  let {
    title = "",
    activeCount = 0,
    hasPendingChanges = false,
    onApply = () => {},
    onClear = () => {},
    children,
  }: {
    title?: string;
    activeCount?: number;
    hasPendingChanges?: boolean;
    onApply?: () => void;
    onClear?: () => void;
    children?: Snippet;
  } = $props();

  let open = $state(false);

  function close() {
    open = false;
  }

  function apply() {
    onApply();
    close();
  }

  $effect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape" && open) close();
  }}
/>

<!-- Mobile trigger -->
<button
  type="button"
  onclick={() => (open = true)}
  class="lg:hidden flex w-full items-center justify-between gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] transition-all min-h-touch dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  aria-label="Abrir filtros"
>
  <span class="flex items-center gap-2">
    <Filter class="size-4 text-slate-500 dark:text-slate-400" />
    <span class="truncate">{title}</span>
    {#if activeCount > 0}
      <span
        class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-extrabold text-[#1F2937]"
      >
        {activeCount}
      </span>
    {/if}
  </span>
  <ChevronDown class="size-4 text-slate-400 shrink-0" />
</button>

<!-- Mobile drawer (bottom sheet) -->
{#if open}
  <button
    type="button"
    class="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-default"
    aria-label="Fechar"
    onclick={close}
    transition:fade={{ duration: 200 }}
  ></button>
  <div
    class="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl flex flex-col max-h-[85dvh] pb-safe"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    tabindex="-1"
    transition:fly={{ y: 400, duration: 280 }}
  >
    <div class="flex flex-col items-center pt-2 pb-1 shrink-0">
      <div class="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
    </div>
    <div
      class="flex items-center justify-between px-4 py-2 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"
    >
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <div class="flex items-center gap-2">
        {#if activeCount > 0}
          <button
            type="button"
            onclick={onClear}
            class="text-xs font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded min-h-touch dark:text-amber-400"
          >
            Limpar
          </button>
        {/if}
        <Button variant="ghost" size="icon" onclick={close} class="size-10" aria-label="Fechar">
          <X class="size-4" />
        </Button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <div class="flex flex-col gap-4">
        {@render children?.()}
      </div>
    </div>
    <div
      class="flex items-center gap-3 px-4 py-3 border-t-2 border-slate-100 dark:border-slate-700 shrink-0"
    >
      <Button
        onclick={apply}
        disabled={!hasPendingChanges}
        class="flex-1 h-12 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold shadow-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Aplicar
      </Button>
    </div>
  </div>
{/if}

<!-- Desktop inline -->
<div class="hidden lg:block">
  <PageCard class="p-2.5 sm:p-3 flex flex-col gap-1.5 shrink-0">
    <h1 class="text-sm sm:text-base font-bold text-slate-800 dark:text-white">{title}</h1>
    <div class="flex flex-col gap-1.5 sm:gap-2">
      {@render children?.()}
    </div>
    <div
      class="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60"
    >
      <div class="flex items-center gap-2">
        {#if activeCount > 0}
          <span class="text-[11px] text-slate-500 dark:text-slate-400">
            {activeCount}
            {activeCount === 1 ? "filtro ativo" : "filtros ativos"}
          </span>
          <button
            type="button"
            onclick={onClear}
            class="text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 min-h-touch inline-flex items-center"
          >
            Limpar
          </button>
        {:else}
          <span class="text-[11px] text-slate-400 dark:text-slate-500">Nenhum filtro ativo</span>
        {/if}
        {#if hasPendingChanges}
          <span
            class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"
          >
            <span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Alterações por aplicar
          </span>
        {/if}
      </div>
      <Button
        type="button"
        onclick={onApply}
        disabled={!hasPendingChanges}
        class="h-8 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-3 rounded-lg text-xs font-semibold shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Aplicar
      </Button>
    </div>
  </PageCard>
</div>
