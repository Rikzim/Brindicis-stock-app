import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-1 flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      <div className="grid grid-cols-4 gap-3 p-6 overflow-y-auto">
        {pageProducts.map((product) => {
          const colorNames = product.colors?.map((c) => c.name).join(", ") || "";
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              reference={product.ref}
              quantity={product.quantity}
              colors={colorNames || undefined}
              image={product.images?.[0]?.url}
              isSelected={selectedId === product.id}
              onClick={() => onSelectProduct(product.id)}
            />
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-end border-t-2 border-slate-200 px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
              className="size-9 border-slate-300 dark:border-slate-600"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="size-9 border-slate-300 dark:border-slate-600"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="default" size="icon" className="size-9 bg-amber-400 hover:bg-amber-500 text-[#1F2937] text-sm font-extrabold cursor-default shadow-sm">
              {safePage}
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="size-9 border-slate-300 dark:border-slate-600"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="size-9 border-slate-300 dark:border-slate-600"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
