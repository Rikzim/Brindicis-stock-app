<script>
  import { onMount } from "svelte";
  import StockNavbar from "@/lib/components/layout/stock-navbar.svelte";
  import { navigateTo } from "@/lib/utils/navigate";
  import {
    LayoutDashboard,
    Layers,
    FileText,
    Briefcase,
    Tags,
    ArrowLeft,
  } from "lucide-svelte";

  import AdminDashboard from "@/routes/admin/admin-dashboard.svelte";
  import AdminStock from "@/routes/admin/admin-stock.svelte";
  import AdminReservas from "@/routes/admin/admin-reservas.svelte";
  import AdminFornecedores from "@/routes/admin/admin-fornecedores.svelte";
  import AdminFamilias from "@/routes/admin/admin-familias.svelte";

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

  onMount(() => {
    window.addEventListener("popstate", onNavigate);
    return () => window.removeEventListener("popstate", onNavigate);
  });

  const ChildComponent = $derived.by(() => {
    if (currentPath === "/admin" || currentPath === "/admin/") return AdminDashboard;
    if (currentPath === "/admin/stock") return AdminStock;
    if (currentPath === "/admin/reservas") return AdminReservas;
    if (currentPath === "/admin/fornecedores") return AdminFornecedores;
    if (currentPath === "/admin/familias") return AdminFamilias;
    return AdminDashboard;
  });
</script>

<svelte:window onpopstate={onNavigate} />

<div class="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
  <StockNavbar searchQuery="" onSearchChange={() => {}} />

  <div class="flex flex-1 overflow-hidden min-h-0 gap-2">
    <aside class="w-[280px] shrink-0 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between p-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
      <div class="flex flex-col gap-6">
        <div>
          <h3 class="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Navegação
          </h3>
          <ul class="mt-3 flex flex-col gap-1">
            {#each navItems as item (item.name)}
              {@const isActive = currentPath === item.path || (item.path === "/admin" && currentPath === "/admin/")}
              <li>
                <button
                  type="button"
                  onclick={() => navigateTo(item.path)}
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left {isActive
                    ? 'text-amber-600 bg-amber-50/40 dark:text-amber-400 dark:bg-amber-950/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}"
                >
                  <item.icon class="size-5 {isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}" />
                  <span>{item.name}</span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="border-t-2 border-slate-200 dark:border-slate-700 my-2"></div>
        <button
          type="button"
          onclick={() => navigateTo("/stock")}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer w-full text-left"
        >
          <ArrowLeft class="size-5 text-amber-600 dark:text-amber-400" />
          <span>Página Principal</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
      <ChildComponent />
    </main>
  </div>
</div>
