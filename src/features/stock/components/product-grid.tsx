import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Loader2 } from "@/lib/icon-map";
import { ProductCard } from "./product-card";
import type { ProductStock } from "@/lib/stock-types";

type ProductGridProps = {
  products: ProductStock[];
  isLoading: boolean;
  selectedId: number | null;
  onSelectProduct: (id: number) => void;
};

const ITEMS_PER_PAGE = 32;

export function ProductGrid({ products, isLoading, selectedId, onSelectProduct }: ProductGridProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageProducts = products.slice(start, start + ITEMS_PER_PAGE);

  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
        <p className="text-sm font-medium">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden">
      <div className="grid grid-cols-4 gap-2 p-6 overflow-y-auto">
        {pageProducts.map((product) => {
          const colorNames = product.colors?.map((c) => c.name).join(", ") || "";
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              reference={product.ref}
              quantityLabel={`Qtd: ${product.quantity}`}
              colorLabel={colorNames ? `Cor: ${colorNames}` : undefined}
              image={product.images?.[0]?.url}
              isSelected={selectedId === product.id}
              onClick={() => onSelectProduct(product.id)}
            />
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-white dark:bg-slate-900 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/60">
            <span>{ITEMS_PER_PAGE}</span>
            <ChevronDown className="size-3 text-slate-400 dark:text-slate-500" />
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Linhas por página</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button type="button" className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white cursor-pointer shadow-xs">
              {safePage}
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
