import { useState, useMemo } from "react";
import {
  Image,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Calendar,
  Plus,
} from "@/lib/icon-map";
import type { ProductStock, ProductVariantStock } from "@/lib/stock-types";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredVariants: ProductVariantStock[] = useMemo(() => {
    const variants = product.variants || [];
    return variants.filter((v) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    });
  }, [product.variants, selectedColor, selectedSize]);

  const filteredAvailable = useMemo(() => {
    return filteredVariants.reduce((sum, v) => sum + (v.quantity - v.reserved), 0);
  }, [filteredVariants]);

  const TABLE_ROW_H = 28;
  const tableNeedsScroll = filteredVariants.length > 0 &&
    (26 + filteredVariants.length * TABLE_ROW_H) > 160;

  const images = product.images || [];
  const currentImage = images[currentImageIndex] ?? null;
  const hasImages = images.length > 0;

  const goPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const goNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const statusInfo = STATUS_MAP[product.status] ?? { label: "Desconhecido", color: "text-slate-500" };

  return (
    <div className="flex h-full w-[460px] shrink-0 flex-col overflow-hidden bg-white border border-slate-200/60 rounded-2xl shadow-xs relative dark:bg-slate-900 dark:border-slate-800/80 animate-in fade-in slide-in-from-right-2 duration-300">
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
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3 z-10 size-6">
            <X className="size-3.5" />
          </Button>

          <div className="flex-1 overflow-hidden">
            <div className="p-5 flex flex-col gap-5 h-full">
              <div className="flex gap-4 pb-4 border-b border-slate-100 shrink-0 dark:border-slate-800/60">
                <div className="relative flex aspect-square w-[120px] shrink-0 items-center justify-center bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-950">
                  {currentImage ? (
                    <img
                      src={getImageUrl(currentImage.url)}
                      alt={product.name}
                      className="size-full object-contain"
                    />
                  ) : (
                    <>
                      <Image className="text-slate-300 size-8 mb-0.5 dark:text-slate-600" />
                      <span className="text-[8px] font-semibold text-slate-400 tracking-wider absolute bottom-2 dark:text-slate-500">
                        IMAGEM
                      </span>
                    </>
                  )}

                  {hasImages && images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={goPrevImage}
                        className="absolute left-1 top-1/2 -translate-y-1/2 size-6 opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="size-3.5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={goNextImage}
                        className="absolute right-1 top-1/2 -translate-y-1/2 size-6 opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="size-3.5" />
                      </Button>
                      <div className="absolute bottom-1.5 flex gap-1">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`size-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-blue-600 dark:bg-blue-500 w-3" : "bg-slate-200 dark:bg-slate-800"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                      REF. {product.ref}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 uppercase leading-tight dark:text-slate-100 line-clamp-2">
                      {product.name}
                    </h2>
                    {product.category && (
                      <p className="text-xs text-slate-500 font-medium dark:text-slate-400">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="inline-flex items-center rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white shadow-2xs dark:bg-blue-650">
                      {product.quantity} <span className="font-normal opacity-90 ml-1">unidades</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {product.pvp.toFixed(2)} €{" "}
                      <span className="text-[10px] font-semibold text-slate-400 ml-0.5 dark:text-slate-500">PVP</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/60 shrink-0">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                      COR
                    </span>
                    <SearchableSelect
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                      options={[
                        { value: "", label: "Todas as cores" },
                        ...product.colors.map((c) => ({ value: c.name, label: c.name })),
                      ]}
                      placeholder="Todas as cores"
                      searchPlaceholder="Procurar cor..."
                      emptyMessage="Nenhuma cor encontrada."
                    />
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                      TAMANHO
                    </span>
                    <SearchableSelect
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      options={[
                        { value: "", label: "Todos os tamanhos" },
                        ...product.sizes.map((s) => ({ value: s.size, label: s.size })),
                      ]}
                      placeholder="Todos os tamanhos"
                      searchPlaceholder="Procurar tamanho..."
                      emptyMessage="Nenhum tamanho encontrado."
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 dark:text-slate-500">
                    DISPONIBILIDADE
                  </span>
                  <span className="flex flex-col items-start text-xs font-semibold gap-0.5">
                    <span className={statusInfo.color}>{statusInfo.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white shadow-2xs">
                        {filteredAvailable}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">un. disponíveis</span>
                    </div>
                    {(selectedColor || selectedSize) && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {selectedColor && !selectedSize ? "para esta cor" : ""}
                        {selectedSize && !selectedColor ? "para este tamanho" : ""}
                        {selectedColor && selectedSize ? "para esta combinação" : ""}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {filteredVariants.length > 0 && (
                <div
                  className={`flex flex-col ${tableNeedsScroll ? 'flex-1 min-h-0 overflow-y-auto' : ''}`}
                >
                  <div className="grid grid-cols-[1.2fr_1fr_0.8fr] text-[10px] font-bold text-slate-400/90 tracking-wider shrink-0 pb-1.5 border-b border-slate-200 dark:border-slate-700/60">
                    <span>Cor</span>
                    <span>Tamanho</span>
                    <span>Disponível</span>
                  </div>
                  {filteredVariants.map((v) => {
                    const available = v.quantity - v.reserved;
                    return (
                      <div
                        key={v.id}
                        className="grid grid-cols-[1.2fr_1fr_0.8fr] py-1.5 text-xs text-slate-700 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-150 dark:text-slate-300 dark:border-slate-800/20 dark:hover:bg-slate-800/30"
                      >
                        <span className="font-medium">{v.color}</span>
                        <span className="text-slate-500 dark:text-slate-400">{v.size || "—"}</span>
                        <span className={`font-semibold ${available > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-500"}`}>
                          {available}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-auto shrink-0 flex flex-col gap-5 pb-14">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">CX.</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.cx || "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">NÚMERO</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 dark:text-slate-300">{product.number ?? "N/A"}</span>
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

                <p className="text-[10px] text-slate-400 font-medium dark:text-slate-500">
                  Criado em{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {formatDate(product.createdAt)}
                  </span>
                  <span className="mx-1.5">·</span>
                  Atualizado em{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {formatDate(product.updatedAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 grid grid-cols-2 gap-3 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Button variant="outline" size="sm" onClick={() => setView("reservations")} className="h-9">
              <Calendar className="size-3.5" />
              <span>Ver Reservas</span>
            </Button>
            <Button variant="default" size="sm" onClick={() => setView("reserving")} className="h-9 bg-blue-600 hover:bg-blue-700 active:scale-95">
              <Plus className="size-3.5" />
              <span>Adicionar Reserva</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
