import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Info, ChevronLeft, Plus, Trash2, FileText } from "@/lib/icon-map";
import type { ProductStock } from "@/lib/stock-types";
import { getProductReservations, deleteReservation } from "@/lib/stock-api";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ProductReservationsPanelProps = {
  product: ProductStock;
  onClose: () => void;
  onAddReservation: () => void;
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ProductReservationsPanel({
  product,
  onClose,
  onAddReservation,
}: ProductReservationsPanelProps) {
  const queryClient = useQueryClient();
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const { data: reservations = [], isLoading, refetch } = useQuery({
    queryKey: ["product-reservations", product.id],
    queryFn: () => getProductReservations(product.id),
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar esta reserva?")) return;

    try {
      setIsDeletingId(id);
      await deleteReservation(id);
      toast.success("Reserva apagada com sucesso!");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["stock-products"] });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao apagar reserva.");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">
            PRODUTO • {product.ref} {product.name}
          </span>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 leading-tight">
            Reservas do Produto
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7">
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-4">
        {/* Table Container */}
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col min-h-[200px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#F8FAFC] px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-wider dark:bg-slate-900/50">
            <span className="col-span-5 text-left">COMERCIAL</span>
            <span className="col-span-3 text-center">QUANTIDADE</span>
            <span className="col-span-2 text-center">DATA</span>
            <span className="col-span-2 text-right">AÇÕES</span>
          </div>

          {/* Table Body */}
          <div className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-12 text-xs text-slate-400 font-semibold">
                A carregar reservas...
              </div>
            ) : reservations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                <FileText className="size-10 text-slate-300 dark:text-slate-700 mb-2.5" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Nenhuma reserva encontrada
                </p>
                <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
                  Este produto ainda não tem reservas registadas.
                </p>
              </div>
            ) : (
              <div className="flex flex-col max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {reservations.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-12 px-4 py-3 items-center text-slate-750 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    <span className="col-span-5 text-sm font-semibold truncate pr-2" title={r.name}>
                      {r.name}
                    </span>
                    <span className="col-span-3 text-center text-sm font-semibold">
                      {r.quantity}
                    </span>
                    <span className="col-span-2 text-center text-xs text-slate-455 dark:text-slate-500">
                      {formatDate(r.createdAt)}
                    </span>
                    <div className="col-span-2 text-right flex justify-end">
                      <Button variant="ghost" size="icon" disabled={isDeletingId === r.id} onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 size-8">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note note */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400/95 dark:text-slate-500">
          <Info className="size-4 shrink-0 text-slate-450/80 dark:text-slate-650" />
          <span>As reservas são válidas por 48 horas.</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Button variant="outline" onClick={onClose} className="h-11 px-5">
          <ChevronLeft className="size-4" />
          <span>Voltar</span>
        </Button>

        <Button variant="default" onClick={onAddReservation} className="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-semibold active:scale-95">
          <Plus className="size-4" />
          <span>Adicionar Reserva</span>
        </Button>
      </div>
    </div>
  );
}
