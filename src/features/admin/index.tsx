import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { StockNavbar } from "@/features/stock/components/stock-navbar";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Briefcase,
  Tags,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Stock",
    path: "/admin/stock",
    icon: Layers,
  },
  {
    name: "Reservas",
    path: "/admin/reservas",
    icon: FileText,
  },
  {
    name: "Fornecedores",
    path: "/admin/fornecedores",
    icon: Briefcase,
  },
  {
    name: "Famílias",
    path: "/admin/familias",
    icon: Tags,
  },
];

export function AdminLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
      {/* Top Navbar - reutiliza StockNavbar */}
      <StockNavbar searchQuery="" onSearchChange={() => {}} />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden min-h-0 gap-2">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between p-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Navegação
              </h3>
              <ul className="mt-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path || (item.path === "/admin" && currentPath === "/admin/");
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "text-amber-600 bg-amber-50/40 dark:text-amber-400 dark:bg-amber-950/20"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon className={`size-5 ${isActive ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="border-t-2 border-slate-200 dark:border-slate-700 my-2" />
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <ArrowLeft className="size-5 text-amber-600 dark:text-amber-400" />
              <span>Página Principal</span>
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AdminDashboard } from "./components/admin-dashboard";
export { AdminStock } from "./components/admin-stock";
export { AdminReservas } from "./components/admin-reservas";
export { AdminFornecedores } from "./components/admin-fornecedores";
export { AdminFamilias } from "./components/admin-familias";
