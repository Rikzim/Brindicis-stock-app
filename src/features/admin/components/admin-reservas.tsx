import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReservations, deleteReservation } from "@/lib/stock-api";
import {
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function AdminReservas() {
  const queryClient = useQueryClient();
  const [selectedEstado, setSelectedEstado] = useState("Todos");

  // Fetch reservations
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: getReservations,
    refetchOnWindowFocus: false,
  });

  // Mutation to delete a reservation
  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Reserva eliminada com sucesso.");
    },
    onError: (err: any) => {
      toast.error(`Erro ao eliminar reserva: ${err.message}`);
    },
  });

  // Status mapping helper
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Pendente", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" };
      case 1:
        return { label: "Aprovada", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" };
      default:
        return { label: "Rejeitada", className: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400" };
    }
  };

  // Filter reservations based on selected status
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (selectedEstado === "Todos") return true;
      if (selectedEstado === "Pendente") return res.status === 0;
      if (selectedEstado === "Aprovada") return res.status === 1;
      if (selectedEstado === "Rejeitada") return res.status !== 0 && res.status !== 1;
      return true;
    });
  }, [reservations, selectedEstado]);

  const handleDelete = (id: number) => {
    if (confirm("Tem a certeza que deseja eliminar esta reserva?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden">
      {/* Filters Area Card containing the Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          Gestão de Reservas
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Estado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estado:
            </label>
            <div className="relative">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="Todos">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Rejeitada">Rejeitada</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Reservas
          </h2>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Comercial
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Referência
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Encomenda
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Cor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tamanho
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quantidade
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Cx
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Gaveta
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Mensagem
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Orçamento
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Estado
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Data
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        A carregar reservas...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredReservations.length > 0 ? (
                filteredReservations.map((res) => {
                  const statusInfo = getStatusInfo(res.status);
                  return (
                    <tr
                      key={res.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {res.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {res.ref || res.product?.ref || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-350">
                        {res.order || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-350">
                        {res.variant?.color || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-350">
                        {res.variant?.size || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {res.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                        {res.variant?.cx || res.product?.cx || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {res.variant?.drawer || res.product?.drawer || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-[150px] truncate" title={res.message}>
                        {res.message || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {res.proposal ? `${res.proposal} €` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">
                        {res.createdAt ? new Date(res.createdAt).toLocaleDateString("pt-PT") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                            onClick={() => handleDelete(res.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="px-6 py-24 text-center">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Sem Reservas disponíveis
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info text */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            A mostrar {filteredReservations.length} reservas...
          </span>
        </div>
      </div>
    </div>
  );
}
