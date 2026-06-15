import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReservations, deleteReservation, getProducts, getUsers, createReservation } from "@/lib/stock-api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { FormSelectField } from "@/components/ui/form-select-field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RowActions } from "@/components/ui/row-actions";
import { PageCard } from "@/components/ui/page-card";
import { AdminModal } from "@/components/ui/admin-modal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { DetailGrid } from "@/components/ui/detail-grid";
import { useCrudModal } from "@/hooks/use-crud-modal";
import type { StockReservation, ProductStock } from "@/lib/stock-types";

function getStatusInfo(status: number) {
  switch (status) {
    case 0: return { label: "Pendente", statusText: "pendente" };
    case 1: return { label: "Aprovada", statusText: "approved" };
    default: return { label: "Rejeitada", statusText: "rejected" };
  }
}

export function AdminReservas() {
  const queryClient = useQueryClient();
  const crud = useCrudModal<StockReservation>();
  const [selectedEstado, setSelectedEstado] = useState("Todos");

  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
    queryKey: ["admin-reservations"],     queryFn: () => getReservations(), refetchOnWindowFocus: false,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["stock-products"], queryFn: getProducts, refetchOnWindowFocus: false,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"], queryFn: getUsers, refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Reserva eliminada com sucesso.");
    },
    onError: (err: any) => toast.error(`Erro ao eliminar reserva: ${err.message}`),
  });

  const [form, setForm] = useState({ name: "", productId: "", variantId: "", quantity: "1", message: "", proposal: "", order: "", status: "0" });
  const fc = (f: string) => (v: any) => setForm((p: any) => ({ ...p, [f]: v?.target?.value ?? v }));

  const selectedProduct = useMemo(() => {
    if (!form.productId) return null;
    return products.find((p) => p.id.toString() === form.productId) || null;
  }, [form.productId, products]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (selectedEstado === "Todos") return true;
      if (selectedEstado === "Pendente") return res.status === 0;
      if (selectedEstado === "Aprovada") return res.status === 1;
      if (selectedEstado === "Rejeitada") return res.status !== 0 && res.status !== 1;
      return true;
    });
  }, [reservations, selectedEstado]);

  const userOptions = users.length > 0
    ? users.map((u: any) => ({ value: u.name, label: u.name }))
    : [{ value: "Administrador", label: "Administrador" }];

  const productOptions = products.map((p: ProductStock) => ({ value: p.id.toString(), label: `${p.ref} - ${p.name}` }));
  const variantOptions = selectedProduct?.variants
    ? selectedProduct.variants.map((v) => ({
        value: v.id.toString(), label: `${v.color}${v.size ? ` / ${v.size}` : ""} (Disp: ${v.quantity - v.reserved})`,
      }))
    : [];

  const resetForm = () => setForm({ name: "", productId: "", variantId: "", quantity: "1", message: "", proposal: "", order: "", status: "0" });

  const handleOpenAdd = () => {
    resetForm();
    fc("name")(users[0]?.name || "");
    fc("productId")(products[0]?.id?.toString() || "");
    crud.openAdd();
  };

  const handleOpenEdit = (res: StockReservation) => {
    setForm({ name: res.name || "", productId: res.productId.toString(), variantId: res.variantId?.toString() || "",
      quantity: res.quantity.toString(), message: res.message || "", proposal: res.proposal?.toString() || "",
      order: res.order || "", status: res.status.toString() });
    crud.openEdit(res);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.productId) { toast.error("Comercial e Produto são obrigatórios."); return; }
    const prod = products.find((p) => p.id.toString() === form.productId);
    if (!prod) return;
    let colorName = "Geral";
    if (form.variantId && prod.variants) {
      const v = prod.variants.find((v) => v.id.toString() === form.variantId);
      if (v) colorName = v.color;
    }
    try {
      await createReservation({
        name: form.name, id_product: parseInt(form.productId), quantity: parseInt(form.quantity) || 1,
        message: form.message, color: colorName, size: "",
        proposal: form.proposal ? parseFloat(form.proposal) : undefined, order: form.order || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Reserva criada com sucesso."); crud.close();
    } catch {
      const newReservation: StockReservation = {
        id: Date.now(), name: form.name, productId: parseInt(form.productId),
        quantity: parseInt(form.quantity) || 1, message: form.message, status: 0, viewed: 0,
        proposal: form.proposal ? parseFloat(form.proposal) : 0, order: form.order || null,
        variantId: form.variantId ? parseInt(form.variantId) : 0,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        product: prod, ref: prod.ref,
        variant: prod.variants?.find((v) => v.id.toString() === form.variantId),
      };
      queryClient.setQueryData<StockReservation[]>(["admin-reservations"], (old = []) => [newReservation, ...old]);
      toast.success("Reserva criada com sucesso (Modo Local)."); crud.close();
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crud.selected) return;
    queryClient.setQueryData<StockReservation[]>(["admin-reservations"], (old = []) =>
      old.map((res) => res.id !== crud.selected!.id ? res : {
        ...res, name: form.name, quantity: parseInt(form.quantity) || 1, message: form.message,
        proposal: form.proposal ? parseFloat(form.proposal) : 0, order: form.order || null,
        status: parseInt(form.status), updatedAt: new Date().toISOString(),
      })
    );
    toast.success("Reserva atualizada com sucesso."); crud.close();
  };

  const handleDelete = () => {
    if (!crud.selected) return;
    deleteMutation.mutate(crud.selected.id); crud.close();
  };

  const columns: Column<StockReservation>[] = [
    { key: "comercial", header: "Comercial", cell: (r) => <span className="font-semibold">{r.name || "-"}</span> },
    { key: "ref", header: "Referência", cell: (r) => <span className="font-semibold">{r.ref || r.product?.ref || "-"}</span> },
    { key: "encomenda", header: "Encomenda", cell: (r) => r.order || "-" },
    { key: "cor", header: "Cor", cell: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", cell: (r) => r.variant?.size || "-" },
    { key: "quantidade", header: "Quantidade", cell: (r) => <span className="font-bold">{r.quantity}</span> },
    { key: "cx", header: "Cx", cell: (r) => r.variant?.cx || r.product?.cx || "-" },
    { key: "gaveta", header: "Gaveta", cell: (r) => r.variant?.drawer || r.product?.drawer || "-" },
    { key: "mensagem", header: "Mensagem", cell: (r) => <span className="max-w-[150px] truncate block" title={r.message}>{r.message || "-"}</span> },
    { key: "orcamento", header: "Orçamento", cell: (r) => r.proposal ? `${r.proposal} €` : "-" },
    { key: "estado", header: "Estado", cell: (r) => <StatusBadge status={getStatusInfo(r.status).label} /> },
    { key: "data", header: "Data", cell: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "-", className: "text-slate-400" },
    { key: "acoes", header: "Ações", cell: (r) => (
      <RowActions onView={() => crud.openView(r)} onEdit={() => handleOpenEdit(r)} onDelete={() => crud.openDelete(r)} />
    ), className: "text-right", headerClassName: "text-right" },
  ];

  const formContent = (
    <form id="reservation-form" onSubmit={crud.isAdd ? handleSaveAdd : handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSelectField label="Comercial (Nome)" id="res-comercial" value={form.name} onValueChange={fc("name")} options={userOptions} placeholder="Selecione um comercial" />
      <FormField label="Referência Encomenda" htmlFor="res-order">
        <Input id="res-order" placeholder="Ex: ENC-2026-01" value={form.order} onChange={fc("order")} />
      </FormField>
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label htmlFor="res-produto" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selecionar Produto</label>
        <SearchableSelect id="res-produto" value={form.productId} onValueChange={(v: string) => setForm((p: any) => ({ ...p, productId: v, variantId: "" }))}
          options={productOptions} disabled={crud.isEdit} placeholder="Selecione o produto" />
      </div>
      {selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0 && (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="res-variant" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Variante (Cor / Tamanho)</label>
          <SearchableSelect id="res-variant" value={form.variantId} onValueChange={fc("variantId")}
            options={variantOptions} disabled={crud.isEdit} placeholder="Geral (Sem variante específica)" />
        </div>
      )}
      <FormField label="Quantidade" htmlFor="res-qty">
        <Input id="res-qty" type="number" required min="1" value={form.quantity} onChange={fc("quantity")} />
      </FormField>
      <FormField label="Orçamento (€)" htmlFor="res-proposal">
        <Input id="res-proposal" type="number" step="0.01" min="0" placeholder="Ex: 150.00" value={form.proposal} onChange={fc("proposal")} />
      </FormField>
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label htmlFor="res-message" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mensagem / Observações</label>
        <textarea id="res-message" value={form.message} onChange={(e) => setForm((p: any) => ({ ...p, message: e.target.value }))} placeholder="Nota ou comentário da reserva..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]" />
      </div>
      {crud.isEdit && (
        <FormSelectField label="Estado da Reserva" id="res-status" value={form.status} onValueChange={fc("status")}
          options={[{ value: "0", label: "Pendente" }, { value: "1", label: "Aprovada" }, { value: "2", label: "Rejeitada" }]}
          placeholder="Selecionar estado" />
      )}
    </form>
  );

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      <PageCard className="p-6 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Gestão de Reservas</h1>
          <Button onClick={handleOpenAdd} className="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none">
            <Plus className="size-4" /><span>Criar Reserva</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FormSelectField label="Estado" id="filter-estado-res" value={selectedEstado} onValueChange={setSelectedEstado}
            options={[{ value: "Todos", label: "Todos" }, { value: "Pendente", label: "Pendente" },
              { value: "Aprovada", label: "Aprovada" }, { value: "Rejeitada", label: "Rejeitada" }]} />
        </div>
      </PageCard>

      <DataTable columns={columns} data={filteredReservations} isLoading={loadingReservations}
        loadingMessage="A carregar reservas..." emptyMessage="Sem reservas disponíveis." rowKey={(r) => r.id} />

      {(crud.isAdd || crud.isEdit) && (
        <AdminModal open onClose={crud.close} title={crud.isAdd ? "Criar Nova Reserva" : "Editar Reserva"}
          footer={<><Button variant="outline" onClick={crud.close} className="h-10 px-4">Cancelar</Button>
            <Button type="submit" form="reservation-form" className="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button></>}>
          {formContent}
        </AdminModal>
      )}

      {crud.isView && crud.selected && (
        <AdminModal open onClose={crud.close} title="Detalhes da Reserva"
          footer={<Button onClick={crud.close} className="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>}>
          <DetailGrid items={[
            { label: "Comercial", value: crud.selected.name || "Sem Nome" },
            { label: "Produto (Ref)", value: `${crud.selected.product?.name || "Produto"} (${crud.selected.ref || crud.selected.product?.ref})` },
            { label: "Encomenda", value: crud.selected.order || "-" },
            { label: "Variante", value: `${crud.selected.variant?.color || "-"}${crud.selected.variant?.size ? ` / ${crud.selected.variant.size}` : ""}` },
            { label: "Quantidade", value: `${crud.selected.quantity} unidades` },
            { label: "Orçamento", value: crud.selected.proposal ? `${crud.selected.proposal.toFixed(2)} €` : "-" },
            { label: "Estado", value: <StatusBadge status={getStatusInfo(crud.selected.status).label} /> },
          ]} />
          {crud.selected.message && (
            <div className="mt-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mensagem</span>
              <p className="text-sm text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850">{crud.selected.message}</p>
            </div>
          )}
        </AdminModal>
      )}

      <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDelete}
        title="Eliminar Reserva"
        itemName={crud.selected ? `${crud.selected.quantity}x ${crud.selected.product?.name || "Produto"} (${crud.selected.name})` : ""} />
    </div>
  );
}
