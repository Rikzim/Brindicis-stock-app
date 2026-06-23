<script lang="ts">
  import { page } from "$app/stores";
  import { LayoutDashboard, Layers, FileText, Briefcase, Tags } from "lucide-svelte";
  import StockNavbar from "$lib/components/layout/stock-navbar.svelte";
  import AdminSidebar from "$lib/components/layout/admin-sidebar.svelte";
  import { navigateTo } from "$lib/utils/navigate";

  let { children } = $props();

  let searchQuery = $state("");
  let sidebarCollapsed = $state(false);
  let mobileOpen = $state(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Stock", path: "/admin/stock", icon: Layers },
    { name: "Reservas", path: "/admin/reservas", icon: FileText },
    { name: "Fornecedores", path: "/admin/fornecedores", icon: Briefcase },
    { name: "Famílias", path: "/admin/familias", icon: Tags },
  ];

  let currentPath = $derived($page.url.pathname);

  function handleNav(path?: string) {
    mobileOpen = false;
    if (path) navigateTo(path);
  }

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }

  $effect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  });
</script>

<div
  class="flex h-dvh flex-col bg-[#F3F4F6] p-1.5 sm:p-2 gap-1.5 sm:gap-2 transition-colors duration-250 dark:bg-slate-950 overflow-hidden"
>
  <StockNavbar bind:searchQuery onMenuToggle={toggleMobile} />

  <div class="flex flex-1 overflow-hidden min-h-0 gap-1.5 sm:gap-2 relative">
    <AdminSidebar
      {navItems}
      {currentPath}
      onNavigate={handleNav}
      bind:collapsed={sidebarCollapsed}
      bind:mobileOpen
    />

    <main class="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
      {@render children?.()}
    </main>
  </div>
</div>
