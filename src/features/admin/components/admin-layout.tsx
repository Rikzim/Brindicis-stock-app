import { useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import { Logo } from "@/assets/logo";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Briefcase,
  Tags,
  ArrowLeft,
  Search,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar-image";
import { AvatarFallback } from "@/components/ui/avatar-fallback";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

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
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.reset);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { theme, toggleTheme } = useSettingsStore();

  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    reset();
    setShowProfile(false);
    navigate({ to: "/sign-in" });
  };

  return (
    <div className="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
      {/* Top Navbar */}
      <nav className="relative flex h-16 items-center justify-between bg-white px-6 rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <div className="flex w-[280px] shrink-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center bg-[#1D58F6] rounded-lg shrink-0">
            <Logo className="h-5 w-auto" fill="#FFFFFF" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Brindicis Stock
          </span>
        </div>

        <div className="relative flex flex-1 justify-center max-w-5xl">
          <div className="relative w-full max-w-4xl">
            <Search className="text-slate-400 absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Pesquise..."
              className="h-10 w-full rounded-lg border-slate-200/80 bg-slate-50/50 pl-10 pr-12 text-sm focus:bg-white focus-visible:ring-blue-500 shadow-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-950"
            />
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-200/60 bg-white absolute top-1/2 right-2.5 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-normal shadow-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
            >
              <span className="text-xs mr-0.5">⌘</span>K
            </Badge>
          </div>
        </div>

        <div className="flex w-[280px] shrink-0 items-center justify-end gap-3">
          <button
            type="button"
            className="text-blue-600 hover:bg-slate-50 rounded-lg p-2 transition-colors cursor-pointer dark:text-blue-400 dark:hover:bg-slate-800"
            title="Modo Admin Ativo"
          >
            <ShieldCheck className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg p-2 transition-colors cursor-pointer dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
          >
            <Settings className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="rounded-full cursor-pointer focus:outline-none ring-1 ring-slate-100 dark:ring-slate-800"
          >
            <Avatar className="size-8">
              {user?.image_path ? (
                <AvatarImage src={getImageUrl(user.image_path)} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-slate-100 text-slate-705 text-xs font-semibold dark:bg-slate-800 dark:text-slate-350">
                  {initial}
                </AvatarFallback>
              )}
            </Avatar>
          </button>
        </div>

        {/* Dropdowns */}
        {showSettings && (
          <>
            <div className="fixed inset-0 z-45" role="presentation" onClick={() => setShowSettings(false)} />
            <div className="absolute right-6 top-18 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-250 dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-100 border-b border-slate-100 pb-2 dark:border-slate-800/80">
                Configurações
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Modo Escuro</span>
                  <span className="text-[10px] text-slate-400">Alterar tema do sistema</span>
                </div>
                <button
                  type="button"
                  aria-label="Alternar modo escuro"
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none dark:border-transparent ${
                    theme === "dark" ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white transition duration-250 ease-in-out ${
                      theme === "dark" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}

        {showProfile && (
          <>
            <div className="fixed inset-0 z-45" role="presentation" onClick={() => setShowProfile(false)} />
            <div className="absolute right-6 top-18 z-50 w-56 rounded-xl border border-slate-200/60 bg-white transition-colors duration-250 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <div className="px-4 py-3.5 flex flex-col border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-sm font-bold text-slate-850 dark:text-slate-100">
                  {user?.name || "Admin"}
                </span>
                <span className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">
                  {user?.email || "admin@brindicis.local"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-50/40 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sair</span>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden min-h-0 gap-2">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200/60 flex flex-col justify-between p-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
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
                            ? "text-blue-600 bg-blue-50/40 dark:text-blue-400 dark:bg-blue-950/20"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon className={`size-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="h-px bg-slate-100 dark:bg-slate-805 my-2" />
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <ArrowLeft className="size-5 text-blue-600 dark:text-blue-400" />
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
