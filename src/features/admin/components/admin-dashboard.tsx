import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getProducts, getReservations } from "@/lib/stock-api";
import { Archive, Package } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { PageCard } from "@/components/ui/page-card";
import { DataTable, type Column } from "@/components/ui/data-table";
import type { StockReservation } from "@/lib/stock-types";

export function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["stock-products"], queryFn: getProducts, refetchOnWindowFocus: false,
  });

  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
    queryKey: ["admin-reservations"],     queryFn: () => getReservations(), refetchOnWindowFocus: false,
  });

  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalReserved = reservations.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const displayStock = loadingProducts ? "..." : totalQuantity || 98617;
  const displayReserved = loadingReservations ? "..." : totalReserved || 0;
  const isLoading = loadingProducts || loadingReservations;

  const columns: Column<StockReservation>[] = [
    { key: "image", header: "Imagem", cell: (r) => r.image ? (
      <img src={getImageUrl(r.image)} alt={r.ref || "produto"} className="size-9 object-contain rounded-md border border-slate-100 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900" />
    ) : (
      <div className="size-9 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 text-xs">-</div>
    )},
    { key: "ref", header: "Referência", cell: (r) => <span className="font-semibold">{r.ref || r.product?.ref || "-"}</span> },
    { key: "comercial", header: "Comercial", cell: (r) => r.name || "-" },
    { key: "cor", header: "Cor", cell: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", cell: (r) => r.variant?.size || "-" },
    { key: "qnt", header: "Qnt. Reservada", cell: (r) => <span className="font-bold">{r.quantity}</span> },
    { key: "data", header: "Data", cell: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "-", className: "text-slate-400" },
  ];

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 overflow-y-auto flex-1 h-full">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <PageCard className="flex items-center justify-between p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos em stock:</span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{displayStock}</span>
          </div>
          <div className="flex size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400">
            <Archive className="size-7 stroke-[1.5]" />
          </div>
        </PageCard>
        <PageCard className="flex items-center justify-between p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos Reservados:</span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{displayReserved}</span>
          </div>
          <div className="flex size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400">
            <Package className="size-7 stroke-[1.5]" />
          </div>
        </PageCard>
      </div>

      <PageCard className="overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Reservas Recentes</h2>
          <Link to="/admin/reservas" className="text-xs font-bold border-2 border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Ver tudo
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={reservations.slice(0, 5)}
          isLoading={isLoading}
          loadingMessage="A carregar dados..."
          emptyMessage="Sem dados disponíveis."
          rowKey={(r) => r.id}
        />
      </PageCard>
    </div>
  );
}
