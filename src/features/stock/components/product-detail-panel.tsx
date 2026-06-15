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
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CreateReservationPanel } from "./create-reservation-modal";
import { ProductReservationsPanel } from "./product-reservations-panel";


type ProductDetailPanelProps = {
  product: ProductStock;
  onClose: () => void;
};

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
    <div className="flex h-full w-[460px] shrink-0 flex-col overflow-hidden bg-white border-2 border-slate-200 rounded-2xl shadow-sm relative dark:bg-slate-900 dark:border-slate-700 animate-in fade-in slide-in-from-right-2 duration-300">
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
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3 z-10 size-7 hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="size-4" />
          </Button>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col min-h-0">

              {/* HEADER - Imagem + Nome */}
              <div className="flex bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0 min-h-[150px]">
                {/* Imagem */}
                <div className="relative flex w-[140px] shrink-0 items-center justify-center bg-slate-100 border-r border-slate-200 dark:bg-slate-950 dark:border-slate-700 overflow-hidden">
                  {currentImage ? (
                    <img
                      src={getImageUrl(currentImage.url)}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <>
                      <Image className="text-slate-300 size-9 mb-0.5 dark:text-slate-600" />
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider absolute bottom-2 dark:text-slate-500">
                        SEM IMAGEM
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
                            className={`size-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-amber-400 dark:bg-amber-400 w-3" : "bg-slate-300 dark:bg-slate-700"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Nome e Badges */}
                <div className="flex-1 flex flex-col justify-between min-w-0 p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">
                      REF. {product.ref}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 uppercase leading-tight dark:text-slate-50 line-clamp-2">
                      {product.name}
                    </h2>
                    {product.category && (
                      <p className="text-sm text-slate-600 font-semibold dark:text-slate-400">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="inline-flex items-center rounded-lg bg-[#FBBF24] px-3 py-1 text-sm font-bold text-[#1F2937] shadow-sm">
                      {product.quantity} <span className="font-semibold opacity-80 ml-1">unidades</span>
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {product.pvp.toFixed(2)} €{" "}
                      <span className="text-xs font-bold text-slate-500 ml-0.5 dark:text-slate-400">PVP</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* FILTROS - Cor / Tamanho / Disponibilidade */}
              <div className="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
                <div className="px-5 py-4">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 block dark:text-slate-400">
                    Filtrar Variantes
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                          Cor
                        </span>
                        <SearchableSelect
                          value={selectedColor}
                          onValueChange={setSelectedColor}
                          options={[
                            { value: "", label: "Todas" },
                            ...product.colors.map((c) => ({ value: c.name, label: c.name })),
                          ]}
                          placeholder="Todas"
                          searchPlaceholder="Procurar..."
                          emptyMessage="Nenhuma cor."
                        />
                      </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                          Tamanho
                        </span>
                        <SearchableSelect
                          value={selectedSize}
                          onValueChange={setSelectedSize}
                          options={[
                            { value: "", label: "Todos" },
                            ...product.sizes.map((s) => ({ value: s.size, label: s.size })),
                          ]}
                          placeholder="Todos"
                          searchPlaceholder="Procurar..."
                          emptyMessage="Nenhum tamanho."
                        />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                        Disponível
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-extrabold ${statusInfo.color}`}>{statusInfo.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-lg bg-[#FBBF24] px-2 py-0.5 text-sm font-bold text-[#1F2937] shadow-sm">
                            {filteredAvailable}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">un.</span>
                        </div>
                        {(selectedColor || selectedSize) && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {selectedColor && !selectedSize ? "para esta cor" : ""}
                            {selectedSize && !selectedColor ? "para este tamanho" : ""}
                            {selectedColor && selectedSize ? "combinação" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABELA DE VARIANTES */}
              {filteredVariants.length > 0 && (
                <div className="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 flex-1 min-h-0 overflow-hidden flex flex-col">
                  <div className="px-5 py-3 shrink-0">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 block dark:text-slate-400">
                      Variantes ({filteredVariants.length})
                    </span>
                  </div>
                  <div className="mx-5 mb-4 rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700 flex-1 min-h-0 flex flex-col">
                    <div className="grid grid-cols-[1.2fr_1fr_0.8fr] bg-slate-100 px-4 py-2.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider shrink-0 dark:bg-slate-800 dark:text-slate-300">
                      <span>Cor</span>
                      <span>Tamanho</span>
                      <span className="text-right">Disponível</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                    {filteredVariants.map((v) => {
                      const available = v.quantity - v.reserved;
                      return (
                        <div
                          key={v.id}
                          className="grid grid-cols-[1.2fr_1fr_0.8fr] px-4 py-2.5 text-sm transition-colors duration-150 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50 hover:bg-amber-50/50 dark:hover:bg-slate-700/30"
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200">{v.color}</span>
                          <span className="text-slate-600 font-medium dark:text-slate-400">{v.size || "Único"}</span>
                          <span className={`font-extrabold text-right ${available > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                            {available}
                          </span>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>
              )}

              {/* DADOS DO PRODUTO */}
              <div className="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
                <div className="px-5 py-2.5">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block dark:text-slate-500">
                    Dados do Produto
                  </span>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">CX.</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.cx || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">NÚMERO</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.number ?? "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">FAMÍLIA</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.family?.name || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">GAVETA</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{product.drawer || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">P.C.</span>
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">{product.pc.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESCRIÇÃO */}
              {product.description && (
                <div className="bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 shrink-0">
                  <div className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest dark:text-slate-500">Descrição</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* DATAS */}
              <div className="bg-white px-5 py-2 dark:bg-slate-800/50 shrink-0">
                <div className="flex items-center">
                  <p className="flex-1 text-[10px] text-slate-400 font-semibold dark:text-slate-500">
                    Criado em{" "}
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {formatDate(product.createdAt)}
                    </span>
                  </p>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <p className="flex-1 text-[10px] text-slate-400 font-semibold dark:text-slate-500 text-right">
                    Atualizado em{" "}
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {formatDate(product.updatedAt)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-200 bg-slate-50 px-6 py-3 flex items-center gap-3 dark:border-slate-700 dark:bg-slate-800 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setView("reservations")} className="flex-1 h-[45.5px] border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center">
              <Calendar className="size-3.5" />
              <span className="text-[14px]">Ver Reservas</span>
            </Button>
            <Button variant="default" size="sm" onClick={() => setView("reserving")} className="flex-1 h-[45.5px] bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center">
              <Plus className="size-3.5" />
              <span className="text-[14px]">Adicionar Reserva</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
