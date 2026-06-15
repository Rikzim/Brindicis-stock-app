import { useState } from "react";
import { Logo } from "@/assets/logo";
import { Search, Settings, ShieldCheck, LogOut } from "@/lib/icon-map";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar-image";
import { AvatarFallback } from "@/components/ui/avatar-fallback";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useNavigate } from "@tanstack/react-router";

type StockNavbarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function StockNavbar({ searchQuery, onSearchChange }: StockNavbarProps) {
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.reset);
  const navigate = useNavigate();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { theme, panelPosition, toggleTheme, togglePanelPosition } = useSettingsStore();

  return (
    <nav className="relative flex h-16 items-stretch bg-white rounded-2xl border-2 border-slate-200 shadow-sm transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 pl-5 pr-6 shrink-0">
        <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2.5 cursor-pointer">
          <div className="flex size-8 items-center justify-center bg-[#FBBF24] rounded-lg shrink-0">
            <Logo className="h-5 w-auto" fill="#1F2937" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Brindicis <span className="text-amber-500 dark:text-amber-400">Stock</span>
          </span>
        </button>
      </div>

      {/* Search Section */}
      <div className="relative flex flex-1 items-center px-6">
        <div className="relative w-full">
          <Search className="text-slate-400 absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Pesquise..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border-slate-200/80 bg-slate-50/50 pl-10 pr-12 text-sm focus:bg-white focus-visible:ring-amber-400 shadow-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-950"
          />
          <Badge
            variant="outline"
            className="text-slate-400 border-slate-200/60 bg-white absolute top-1/2 right-2.5 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-normal shadow-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
          >
            <span className="text-xs mr-0.5">⌘</span>K
          </Badge>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-1 px-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin" })}
          className="text-slate-500 dark:text-slate-400 size-9"
          title="Área Administrativa"
        >
          <ShieldCheck className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="text-slate-500 dark:text-slate-400 size-9">
          <Settings className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowProfile(!showProfile)} className="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-500 transition-all size-9">
          <Avatar className="size-8">
            {user?.image_path ? (
              <AvatarImage src={getImageUrl(user.image_path)} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-slate-100 text-slate-705 text-xs font-semibold dark:bg-slate-800 dark:text-slate-350">
                {initial}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </div>

      {showSettings && (
        <>
          <div className="fixed inset-0 z-40" role="presentation" onClick={() => setShowSettings(false)} onKeyDown={(e) => e.key === "Escape" && setShowSettings(false)} />
          <div className="absolute right-4 top-[68px] z-50 w-64 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-lg transition-colors duration-250 dark:border-slate-700 dark:bg-slate-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest border-b-2 border-slate-100 pb-2 dark:border-slate-700 dark:text-slate-400">
              Configurações
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Modo Escuro</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Alterar tema do sistema</span>
              </div>
              <button
                type="button"
                aria-label="Alternar modo escuro"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none dark:border-transparent ${
                  theme === "dark" ? "bg-amber-400" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Painel à Esquerda</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Mudar posição do card</span>
              </div>
              <button
                type="button"
                aria-label="Alternar posição do painel"
                onClick={togglePanelPosition}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none dark:border-transparent ${
                  panelPosition === "left" ? "bg-amber-400" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out ${
                    panelPosition === "left" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}

      {showProfile && (
        <>
          <div className="fixed inset-0 z-40" role="presentation" onClick={() => setShowProfile(false)} onKeyDown={(e) => e.key === "Escape" && setShowProfile(false)} />
          <div className="absolute right-4 top-[68px] z-50 w-56 rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-colors duration-250 dark:border-slate-700 dark:bg-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-4 py-3.5 flex flex-col border-b-2 border-slate-100 dark:border-slate-700">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {user?.email || "admin@brindicis.local"}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                reset();
                setShowProfile(false);
                navigate({ to: "/sign-in" });
              }}
              className="flex w-full items-center gap-3 px-4 py-3 h-auto justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-none"
            >
              <LogOut className="size-4" />
              <span>Sair</span>
            </Button>
          </div>
        </>
      )}
    </nav>
  );
}
