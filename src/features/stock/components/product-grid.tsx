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
      <div className="grid grid-cols-4 gap-2 p-6 overflow-y-auto">
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

      <div className="mt-auto flex items-center justify-end border-t border-slate-100 px-6 py-4 bg-white dark:bg-slate-900 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
              className="size-8"
            >
              <ChevronsLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="size-8"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="default" size="icon" className="size-8 bg-blue-600 hover:bg-blue-700 text-xs font-semibold cursor-default shadow-xs">
              {safePage}
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="size-8"
            >
              <ChevronRight className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="size-8"
            >
              <ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
