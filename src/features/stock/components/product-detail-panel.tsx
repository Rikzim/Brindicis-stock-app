import { useState } from "react";
import {
  Image,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Calendar,
  Plus,
} from "@/lib/icon-map";
import type { ProductStock } from "@/lib/stock-types";
import { CreateReservationPanel } from "./create-reservation-modal";
import { ProductReservationsPanel } from "./product-reservations-panel";


type ProductDetailPanelProps = {
  product: ProductStock;
  onClose: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "Esgotado", color: "text-red-600 dark:text-red-500" },
  1: { label: "Quase Esgotado", color: "text-amber-600 dark:text-amber-500" },
  2: { label: "Com Stock", color: "text-emerald-600 dark:text-emerald-500" },
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function ProductDetailPanel({ product, onClose }: ProductDetailPanelProps) {
  const [view, setView] = useState<"details" | "reserving" | "reservations">("details");
  const statusInfo = STATUS_MAP[product.status] ?? { label: "Desconhecido", color: "text-slate-500" };
  const firstImage = product.images?.[0];
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="flex h-full w-[460px] shrink-0 flex-col overflow-hidden bg-white border border-slate-200/60 rounded-2xl shadow-xs relative dark:bg-slate-900 dark:border-slate-800/80">
      {view === "reserving" ? (
        <CreateReservationPanel
          product={product}
          onClose={() => setView("details")}
        />
      ) : view === "reservations" ? (
        <ProductReservationsPanel
          product={product}
          onClose={() => setView("details")}
          onAddReservation={() => setView("reserving")}
        />
      ) : (
        <>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-450 hover:text-slate-650 hover:bg-slate-50 cursor-pointer shadow-3xs transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="size-3.5" />
          </button>

          <div className="flex-1 overflow-y-auto pb-24">
            <div className="relative flex aspect-[16/7] w-full flex-col items-center justify-center bg-slate-50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-850">
              {firstImage ? (
                <img
                  src={getImageUrl(firstImage.url)}
                  alt={product.name}
                  className="size-full object-contain"
                />
              ) : (
                <>
                  <Image className="text-slate-300 size-12 mb-1 dark:text-slate-600" />
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider dark:text-slate-500">
                    IMAGEM DO PRODUTO
                  </span>
                </>
              )}

              {hasImages && product.images.length > 1 && (
                <>
                  <button className="absolute left-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md transition-colors">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-lg bg-blue-650 hover:bg-blue-755 text-white cursor-pointer shadow-md transition-colors">
                    <ChevronRight className="size-4" />
                  </button>
                  <div className="absolute bottom-3 flex gap-1.5">
                    {product.images.map((_, i) => (
                      <div
                        key={i}
                        className={`size-1.5 rounded-full ${i === 0 ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                  REF. {product.ref}
                </span>
                <h2 className="text-xl font-bold text-slate-800 uppercase leading-tight dark:text-slate-100">
                  {product.name}
                </h2>
                {product.category && (
                  <p className="text-xs text-slate-500 font-medium dark:text-slate-400">
                    {product.category.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <div className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs dark:bg-blue-650">
                  {product.quantity} <span className="font-normal opacity-90 ml-1">unidades</span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {product.pvp.toFixed(2)} €{" "}
                  <span className="text-[10px] font-semibold text-slate-400 ml-0.5 dark:text-slate-500">PVP</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                      COR
                    </span>
                    <select className="flex h-8 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer shadow-3xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/50 appearance-none">
                      {product.colors.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                      TAMANHO
                    </span>
                    <select className="flex h-8 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer shadow-3xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/50 appearance-none">
                      {product.sizes.map((s) => (
                        <option key={s.size} value={s.size}>{s.size}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                    DISPONIBILIDADE
                  </span>
                  <span className="flex h-8 items-center text-xs font-semibold gap-1">
                    <span className={statusInfo.color}>{statusInfo.label}</span>
                    <span className="text-slate-400 font-normal text-[10px] dark:text-slate-500">
                      ({product.quantity} un.)
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">REFERÊNCIA</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.ref}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">CX.</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.cx || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">NOME</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">NÚMERO</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.number ?? "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">QUANTIDADE</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.quantity}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">FAMÍLIA</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.family?.name || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">GAVETA</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.drawer || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">P.C.</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.pc.toFixed(2)} €</span>
                </div>
              </div>

              {product.description && (
                <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <FileText className="size-4 shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">DESCRIÇÃO</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 font-medium dark:text-slate-500">
                <p>
                  Criado em{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {formatDate(product.createdAt)}
                  </span>
                </p>
                <p>
                  Atualizado em{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {formatDate(product.updatedAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 grid grid-cols-2 gap-3 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setView("reservations")}
              className="flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Calendar className="size-3.5 text-slate-500" />
              <span>Ver Reservas</span>
            </button>
            <button
              onClick={() => setView("reserving")}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-md transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Adicionar Reserva</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
