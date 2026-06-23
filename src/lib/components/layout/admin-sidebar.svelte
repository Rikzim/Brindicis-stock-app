<script lang="ts">
  import { ArrowLeft, PanelLeftClose, PanelLeftOpen, X } from "lucide-svelte";
  import { fade } from "svelte/transition";

  type NavItem = { name: string; path: string; icon?: any; isActive?: boolean };

  let {
    navItems = [] as NavItem[],
    currentPath = "/admin",
    onNavigate = () => {},
    collapsed = $bindable(false),
    mobileOpen = $bindable(false),
  }: {
    navItems?: NavItem[];
    currentPath?: string;
    onNavigate?: (path?: string) => void;
    collapsed?: boolean;
    mobileOpen?: boolean;
  } = $props();
</script>

{#if mobileOpen}
  <button
    type="button"
    class="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-default"
    aria-label="Fechar menu"
    onclick={() => (mobileOpen = false)}
    transition:fade={{ duration: 200 }}
  ></button>
{/if}

<aside
  class="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r-2 border-slate-200 shadow-lg flex flex-col justify-between p-4 dark:bg-slate-900 dark:border-slate-700 transition-transform duration-300 {mobileOpen
    ? 'translate-x-0'
    : '-translate-x-full'}"
  aria-label="Menu de navegação"
>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h3
        class="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400"
      >
        Navegação
      </h3>
      <button
        type="button"
        onclick={() => (mobileOpen = false)}
        class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-touch min-h-touch flex items-center justify-center"
        aria-label="Fechar menu"
      >
        <X class="size-4" />
      </button>
    </div>
    <ul class="flex flex-col gap-1">
      {#each navItems as item (item.name)}
        {@const isActive =
          currentPath === item.path || (item.path === "/admin" && currentPath === "/admin/")}
        <li>
          <button
            type="button"
            onclick={() => onNavigate(item.path)}
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left min-h-touch {isActive
              ? 'text-amber-600 bg-amber-50/40 dark:text-amber-400 dark:bg-amber-950/20'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}"
          >
            <item.icon
              class="size-5 shrink-0 {isActive
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-400 dark:text-slate-500'}"
            />
            <span>{item.name}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex flex-col gap-1">
    <div class="border-t-2 border-slate-200 dark:border-slate-700 my-2"></div>
    <button
      type="button"
      onclick={() => onNavigate("/stock")}
      class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer w-full text-left min-h-touch"
    >
      <ArrowLeft class="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>Página Principal</span>
    </button>
  </div>
</aside>

<aside
  class="{collapsed
    ? 'lg:w-[68px]'
    : 'lg:w-[280px]'} hidden lg:flex shrink-0 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex-col justify-between p-4 transition-all duration-250 dark:bg-slate-900 dark:border-slate-700"
>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      {#if !collapsed}
        <h3
          class="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400"
        >
          Navegação
        </h3>
      {/if}
      <button
        type="button"
        onclick={() => (collapsed = !collapsed)}
        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-touch min-h-touch flex items-center justify-center"
        aria-label="Alternar barra lateral"
        aria-expanded={!collapsed}
      >
        {#if collapsed}
          <PanelLeftOpen class="size-4" />
        {:else}
          <PanelLeftClose class="size-4" />
        {/if}
      </button>
    </div>
    <ul class="flex flex-col gap-1">
      {#each navItems as item (item.name)}
        {@const isActive =
          currentPath === item.path || (item.path === "/admin" && currentPath === "/admin/")}
        <li>
          <button
            type="button"
            onclick={() => onNavigate(item.path)}
            title={collapsed ? item.name : ""}
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left {isActive
              ? 'text-amber-600 bg-amber-50/40 dark:text-amber-400 dark:bg-amber-950/20'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}"
          >
            <item.icon
              class="size-5 shrink-0 {isActive
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-400 dark:text-slate-500'}"
            />
            {#if !collapsed}
              <span>{item.name}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex flex-col gap-1">
    <div class="border-t-2 border-slate-200 dark:border-slate-700 my-2"></div>
    <button
      type="button"
      onclick={() => onNavigate("/stock")}
      title={collapsed ? "Página Principal" : ""}
      class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer w-full text-left"
    >
      <ArrowLeft class="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      {#if !collapsed}
        <span>Página Principal</span>
      {/if}
    </button>
  </div>
</aside>
