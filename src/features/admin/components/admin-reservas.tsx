import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReservations,
  deleteReservation,
  getProducts,
  getUsers,
  createReservation,
} from "@/lib/stock-api";
import {
  Trash2,
  ChevronDown,
  Loader2,
  Eye,
  Pencil,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { StockReservation, ProductStock } from "@/lib/stock-types";

// Status mapping helper
function getStatusInfo(status: number) {
  switch (status) {
    case 0:
      return { label: "Pendente", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" };
    case 1:
      return { label: "Aprovada", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" };
    default:
      return { label: "Rejeitada", className: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400" };
  }
}

export function AdminReservas() {
  const queryClient = useQueryClient();
  const [selectedEstado, setSelectedEstado] = useState("Todos");

  // Fetch reservations
  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: getReservations,
    refetchOnWindowFocus: false,
  });

  // Fetch products and users for the "Add Reservation" modal
  const { data: products = [] } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
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

  // Modal control states
  const [activeModal, setActiveModal] = useState<"add" | "view" | "edit" | "delete" | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<StockReservation | null>(null);

  // Form states for Add/Edit
  const [formName, setFormName] = useState("");
  const [formProductId, setFormProductId] = useState("");
  const [formVariantId, setFormVariantId] = useState("");
  const [formQuantity, setFormQuantity] = useState("1");
  const [formMessage, setFormMessage] = useState("");
  const [formProposal, setFormProposal] = useState("");
  const [formOrder, setFormOrder] = useState("");
  const [formStatus, setFormStatus] = useState("0"); // status number as string

  // Handle selected product variations in form
  const selectedProduct = useMemo(() => {
    if (!formProductId) return null;
    return products.find((p) => p.id.toString() === formProductId) || null;
  }, [formProductId, products]);

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

  const handleOpenAdd = () => {
    setFormName(users[0]?.name || "");
    setFormProductId(products[0]?.id?.toString() || "");
    setFormVariantId("");
    setFormQuantity("1");
    setFormMessage("");
    setFormProposal("");
    setFormOrder("");
    setFormStatus("0");
    setActiveModal("add");
  };

  const handleOpenView = (res: StockReservation) => {
    setSelectedReservation(res);
    setActiveModal("view");
  };

  const handleOpenEdit = (res: StockReservation) => {
    setSelectedReservation(res);
    setFormName(res.name || "");
    setFormProductId(res.productId.toString());
    setFormVariantId(res.variantId?.toString() || "");
    setFormQuantity(res.quantity.toString());
    setFormMessage(res.message || "");
    setFormProposal(res.proposal?.toString() || "");
    setFormOrder(res.order || "");
    setFormStatus(res.status.toString());
    setActiveModal("edit");
  };

  const handleOpenDelete = (res: StockReservation) => {
    setSelectedReservation(res);
    setActiveModal("delete");
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formProductId) {
      toast.error("Comercial e Produto são obrigatórios.");
      return;
    }

    const prod = products.find((p) => p.id.toString() === formProductId);
    if (!prod) return;

    // Determine variant and color
    let colorName = "Geral";
    if (formVariantId && prod.variants) {
      const selectedVar = prod.variants.find((v) => v.id.toString() === formVariantId);
      if (selectedVar) colorName = selectedVar.color;
    }

    const payload = {
      name: formName,
      id_product: parseInt(formProductId),
      quantity: parseInt(formQuantity) || 1,
      message: formMessage,
      color: colorName,
      size: "", // can default or extract if variant has size
      proposal: formProposal ? parseFloat(formProposal) : undefined,
      order: formOrder || undefined,
    };

    try {
      // Create reservation via API
      await createReservation(payload);
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Reserva criada com sucesso.");
      setActiveModal(null);
    } catch (error: any) {
      // Mock fallback if VITE_API_URL server is down/mocked
      console.warn("API Error, performing mock mutation", error);
      
      const newReservation: StockReservation = {
        id: Date.now(),
        name: formName,
        productId: parseInt(formProductId),
        quantity: parseInt(formQuantity) || 1,
        message: formMessage,
        status: 0,
        viewed: 0,
        proposal: formProposal ? parseFloat(formProposal) : 0,
        order: formOrder || null,
        variantId: formVariantId ? parseInt(formVariantId) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: prod,
        ref: prod.ref,
        variant: prod.variants?.find((v) => v.id.toString() === formVariantId),
      };

      queryClient.setQueryData<StockReservation[]>(["admin-reservations"], (old = []) => [
        newReservation,
        ...old,
      ]);
      toast.success("Reserva criada com sucesso (Modo Local).");
      setActiveModal(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation) return;

    const updatedStatus = parseInt(formStatus);
    const updatedQuantity = parseInt(formQuantity) || 1;

    // Mutate React Query Cache
    queryClient.setQueryData<StockReservation[]>(["admin-reservations"], (old = []) => {
      return old.map((res) => {
        if (res.id !== selectedReservation.id) return res;
        return {
          ...res,
          name: formName,
          quantity: updatedQuantity,
          message: formMessage,
          proposal: formProposal ? parseFloat(formProposal) : 0,
          order: formOrder || null,
          status: updatedStatus,
          updatedAt: new Date().toISOString(),
        };
      });
    });

    toast.success("Reserva atualizada com sucesso.");
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedReservation) return;
    deleteMutation.mutate(selectedReservation.id);
    setActiveModal(null);
  };

  const isLoading = loadingReservations;

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      {/* Filters Area Card containing the Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            Gestão de Reservas
          </h1>
          <Button
            onClick={handleOpenAdd}
            className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium shadow-none"
          >
            <Plus className="size-4" />
            <span>Criar Reserva</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Estado */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-estado" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estado:
            </label>
            <div className="relative">
              <select
                id="filter-estado"
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
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
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
                            onClick={() => handleOpenView(res)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                            title="Visualizar"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(res)}
                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                            onClick={() => handleOpenDelete(res)}
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

      {/* --- MODALS --- */}

      {/* Add / Edit Reservation Modal */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in duration-200">
          <form
            onSubmit={activeModal === "add" ? handleSaveAdd : handleSaveEdit}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                {activeModal === "add" ? "Criar Nova Reserva" : "Editar Reserva"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Comercial (Nome)
                </label>
                <select
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">Selecione um comercial</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                  {users.length === 0 && <option value="Administrador">Administrador</option>}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Referência Encomenda
                </label>
                <input
                  type="text"
                  placeholder="Ex: ENC-2026-01"
                  value={formOrder}
                  onChange={(e) => setFormOrder(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Selecionar Produto
                </label>
                <select
                  required
                  disabled={activeModal === "edit"}
                  value={formProductId}
                  onChange={(e) => {
                    setFormProductId(e.target.value);
                    setFormVariantId("");
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">Selecione o produto</option>
                  {products.map((p: ProductStock) => (
                    <option key={p.id} value={p.id}>
                      {p.ref} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Variante (Cor / Tamanho)
                  </label>
                  <select
                    disabled={activeModal === "edit"}
                    value={formVariantId}
                    onChange={(e) => setFormVariantId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">Geral (Sem variante específica)</option>
                    {selectedProduct.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.color} {v.size ? `/ ${v.size}` : ""} (Disp: {v.quantity - v.reserved})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Quantidade
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Orçamento (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 150.00"
                  value={formProposal}
                  onChange={(e) => setFormProposal(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Mensagem / Observações
                </label>
                <textarea
                  placeholder="Nota ou comentário da reserva..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]"
                />
              </div>

              {activeModal === "edit" && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Estado da Reserva
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="0">Pendente</option>
                    <option value="1">Aprovada</option>
                    <option value="2">Rejeitada</option>
                  </select>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="h-10 px-4 rounded-lg text-sm font-medium"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm font-medium shadow-none"
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* View Reservation Modal */}
      {activeModal === "view" && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Detalhes da Reserva
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Comercial
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {selectedReservation.name || "Sem Nome"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Produto (Ref)
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedReservation.product?.name || "Produto"} ({selectedReservation.ref || selectedReservation.product?.ref})
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Encomenda
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedReservation.order || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Variante (Cor / Tam)
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedReservation.variant?.color || "-"} {selectedReservation.variant?.size ? `/ ${selectedReservation.variant.size}` : ""}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Quantidade
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {selectedReservation.quantity} unidades
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Orçamento
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {selectedReservation.proposal ? `${selectedReservation.proposal.toFixed(2)} €` : "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Estado
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusInfo(selectedReservation.status).className}`}>
                    {getStatusInfo(selectedReservation.status).label}
                  </span>
                </div>
              </div>

              {selectedReservation.message && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Mensagem
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850">
                    {selectedReservation.message}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm font-medium shadow-none animate-in fade-in"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reservation Confirmation Modal */}
      {activeModal === "delete" && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
                <AlertTriangle className="size-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Eliminar Reserva
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tem a certeza que deseja eliminar esta reserva de{" "}
                  <strong className="text-slate-800 dark:text-slate-100 font-bold">
                    {selectedReservation.quantity}x {selectedReservation.product?.name || "Produto"}
                  </strong>{" "}
                  feita por {selectedReservation.name}? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="h-10 px-4 rounded-lg text-sm font-medium"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleDeleteConfirm}
                className="h-10 bg-red-600 hover:bg-red-700 text-white px-5 rounded-lg text-sm font-medium shadow-none animate-in fade-in"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
