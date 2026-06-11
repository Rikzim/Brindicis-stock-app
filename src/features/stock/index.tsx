import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StockNavbar } from "./components/stock-navbar";
import { FiltersBar } from "./components/filters-bar";
import { ProductGrid } from "./components/product-grid";
import { ProductDetailPanel } from "./components/product-detail-panel";
import { useSettingsStore } from "@/stores/settings-store";
import { getProducts, getFamilies } from "@/lib/stock-api";
import { toast } from "sonner";

export function StockPage() {
  const panelPosition = useSettingsStore((s) => s.panelPosition);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: products = [], isLoading, error: productsError } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    retry: false,
  });

  const { data: families = [], error: familiesError } = useQuery({
    queryKey: ["stock-families"],
    queryFn: getFamilies,
    retry: false,
  });

  useEffect(() => {
    if (productsError) {
      const err = productsError as any;
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      if (status === 403) {
        toast.error(`Acesso negado: Não tens permissão para ver produtos. (${message})`);
      } else if (status === 401) {
        toast.error("Não autorizado. Faz login novamente.");
      } else if (status >= 500) {
        toast.error(`Erro interno no servidor ao carregar produtos. (${message})`);
      } else {
        toast.error(`Erro ao carregar produtos: ${message}`);
      }
    }
  }, [productsError]);

  useEffect(() => {
    if (familiesError) {
      const err = familiesError as any;
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      if (status === 403) {
        toast.error(`Acesso negado: Não tens permissão para ver famílias de produtos. (${message})`);
      } else {
        toast.error(`Erro ao carregar famílias: ${message}`);
      }
    }
  }, [familiesError]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.ref.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    if (filters.familia && filters.familia !== "Todas") {
      result = result.filter((p) => p.family?.name === filters.familia);
    }

    if (filters.cor && filters.cor !== "Todas") {
      result = result.filter((p) => p.colors?.some((c) => c.name === filters.cor));
    }

    if (filters.tamanho && filters.tamanho !== "Todas") {
      result = result.filter((p) => p.sizes?.some((s) => s.size === filters.tamanho));
    }

    if (filters.disponibilidade && filters.disponibilidade !== "Todas") {
      if (filters.disponibilidade === "Com Stock") {
        result = result.filter((p) => p.quantity > 0);
      } else if (filters.disponibilidade === "Esgotado") {
        result = result.filter((p) => p.quantity === 0);
      }
    }

    return result;
  }, [products, searchQuery, filters]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c.name)));
    return Array.from(set);
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => set.add(s.size)));
    return Array.from(set);
  }, [products]);

  return (
    <div className="flex h-screen flex-col bg-[#F3F4F6] p-2 gap-2 transition-colors duration-250 dark:bg-slate-950">
      <StockNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1 overflow-hidden min-h-0 gap-2">
        {panelPosition === "left" && selectedProduct && (
          <ProductDetailPanel
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
          />
        )}

        <div className="flex flex-1 flex-col bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80">
          <FiltersBar
            families={families}
            availableColors={availableColors}
            availableSizes={availableSizes}
            filters={filters}
            onFilterChange={setFilters}
          />
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            selectedId={selectedProductId}
            onSelectProduct={setSelectedProductId}
          />
        </div>

        {panelPosition === "right" && selectedProduct && (
          <ProductDetailPanel
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </div>
    </div>
  );
}
