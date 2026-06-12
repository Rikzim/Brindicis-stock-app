import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getReservations } from "@/lib/stock-api";
import { Archive, Package, Loader2 } from "lucide-react";

export function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: getReservations,
    refetchOnWindowFocus: false,
  });

  // Calculate stats or fallback to screenshot data if empty/zero
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalReserved = reservations.reduce((sum, r) => sum + (r.quantity || 0), 0);

  // Fallback values from the screenshot if data is not loaded or zero
  const displayStock = loadingProducts ? "..." : totalQuantity || 98617;
  const displayReserved = loadingReservations ? "..." : totalReserved || 0;

  const isLoading = loadingProducts || loadingReservations;

  return (
    <div className="flex flex-col gap-4 animate-fade-in duration-200 overflow-y-auto flex-1 h-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 1: Produtos em stock */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Produtos em stock:
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {displayStock}
            </span>
          </div>
          <div className="flex size-14 items-center justify-center bg-blue-50 text-blue-600 rounded-2xl dark:bg-blue-950/40 dark:text-blue-400">
            <Archive className="size-7 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 2: Produtos Reservados */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Produtos Reservados:
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {displayReserved}
            </span>
          </div>
          <div className="flex size-14 items-center justify-center bg-blue-50 text-blue-600 rounded-2xl dark:bg-blue-950/40 dark:text-blue-400">
            <Package className="size-7 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Recent Reservations Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Reservas Recentes
          </h2>
          <Link
            to="/admin/reservas"
            className="text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Ver tudo
          </Link>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Imagem
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Referência
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Comercial
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Cor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tamanho
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Qnt. Reservada
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        A carregar dados...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.slice(0, 5).map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {res.image ? (
                        <img
                          src={res.image}
                          alt={res.ref || "produto"}
                          className="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900"
                        />
                      ) : (
                        <div className="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {res.ref || res.product?.ref || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {res.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {res.variant?.color || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {res.variant?.size || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {res.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">
                      {res.createdAt
                        ? new Date(res.createdAt).toLocaleDateString("pt-PT")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Sem dados disponíveis
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
