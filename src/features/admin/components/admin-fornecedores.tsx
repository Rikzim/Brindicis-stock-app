import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/stock-api";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminFornecedores() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  // Extract unique suppliers from products and supplement with screenshot defaults
  const suppliers = useMemo(() => {
    const list = new Set<string>(["DELTAPLUS", "COUTALE", "SOLS", "ORIENTE"]);
    products.forEach((p) => {
      if (p.type) {
        list.add(p.type.toUpperCase());
      }
    });
    return Array.from(list).map((name, index) => ({
      id: index + 1,
      name,
      status: "Ativo",
    }));
  }, [products]);

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden">
      {/* Header Panel Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          Gestão de Fornecedores
        </h1>
        <div>
          <Button className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium shadow-none">
            <Plus className="size-4" />
            <span>Adicionar Fornecedor</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Fornecedor
          </h2>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 text-center">
                  status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        A carregar fornecedores...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : suppliers.length > 0 ? (
                suppliers.map((sup) => (
                  <tr
                    key={sup.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      {sup.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-600 text-white">
                        {sup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-650 text-white text-xs px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-24 text-center">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Sem fornecedores disponíveis
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
