<script>
  import StockNavbar from "@/lib/components/layout/stock-navbar.svelte";
  import { navigateTo } from "@/lib/utils/navigate";
  import {
    LayoutDashboard,
    Layers,
    FileText,
    Briefcase,
    Tags,
    ArrowLeft,
    PanelLeftClose,
    PanelLeftOpen,
  } from "lucide-svelte";

  import AdminDashboard from "@/routes/admin/admin-dashboard.svelte";
  import AdminStock from "@/routes/admin/admin-stock.svelte";
  import AdminReservas from "@/routes/admin/admin-reservas.svelte";
  import AdminFornecedores from "@/routes/admin/admin-fornecedores.svelte";
  import AdminFamilias from "@/routes/admin/admin-familias.svelte";

  let searchQuery = $state("");
  let sidebarCollapsed = $state(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Stock", path: "/admin/stock", icon: Layers },
    { name: "Reservas", path: "/admin/reservas", icon: FileText },
    { name: "Fornecedores", path: "/admin/fornecedores", icon: Briefcase },
    { name: "Famílias", path: "/admin/familias", icon: Tags },
  ];

  let currentPath = $state(window.location.pathname || "/admin");

  function onNavigate() {
    currentPath = window.location.pathname || "/admin";
  }
</script>

<svelte:window onpopstate={onNavigate} />

<div class="flex h-dvh flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
  <StockNavbar bind:searchQuery />

  <div class="flex flex-1 overflow-hidden min-h-0 gap-2">
    <aside class="{sidebarCollapsed ? 'w-[68px]' : 'w-[280px]'} hidden lg:flex shrink-0 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex-col justify-between p-4 transition-all duration-250 dark:bg-slate-900 dark:border-slate-700">
      <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between">
          {#if !sidebarCollapsed}
            <h3 class="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Navegação
            </h3>
          {/if}
          <button
            type="button"
            onclick={() => sidebarCollapsed = !sidebarCollapsed}
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {#if sidebarCollapsed}
              <PanelLeftOpen class="size-4" />
            {:else}
              <PanelLeftClose class="size-4" />
            {/if}
          </button>
        </div>
        <ul class="flex flex-col gap-1">
          {#each navItems as item (item.name)}
            {@const isActive = currentPath === item.path || (item.path === "/admin" && currentPath === "/admin/")}
            <li>
              <button
                type="button"
                onclick={() => navigateTo(item.path)}
                title={sidebarCollapsed ? item.name : ""}
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left {isActive
                  ? 'text-amber-600 bg-amber-50/40 dark:text-amber-400 dark:bg-amber-950/20'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}"
              >
                <item.icon class="size-5 shrink-0 {isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}" />
                {#if !sidebarCollapsed}
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
          onclick={() => navigateTo("/stock")}
          title={sidebarCollapsed ? "Página Principal" : ""}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer w-full text-left"
        >
          <ArrowLeft class="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          {#if !sidebarCollapsed}
            <span>Página Principal</span>
          {/if}
        </button>
      </div>
    </aside>

    <main class="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
      {#if currentPath === "/admin" || currentPath === "/admin/"}
        <AdminDashboard {searchQuery} />
      {:else if currentPath === "/admin/stock"}
        <AdminStock {searchQuery} />
      {:else if currentPath === "/admin/reservas"}
        <AdminReservas {searchQuery} />
      {:else if currentPath === "/admin/fornecedores"}
        <AdminFornecedores {searchQuery} />
      {:else if currentPath === "/admin/familias"}
        <AdminFamilias {searchQuery} />
      {:else}
        <AdminDashboard {searchQuery} />
      {/if}
    </main>
  </div>
</div>
