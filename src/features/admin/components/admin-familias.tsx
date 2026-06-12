import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFamilies, getProducts, createFamily, updateFamily, deleteFamily } from "@/lib/stock-api";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { FormSelectField } from "@/components/ui/form-select-field";
import { PageCard } from "@/components/ui/page-card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RowActions } from "@/components/ui/row-actions";
import { AdminModal } from "@/components/ui/admin-modal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { DetailGrid } from "@/components/ui/detail-grid";
import { useCrudModal } from "@/hooks/use-crud-modal";
import { toast } from "sonner";
import type { StockFamily } from "@/lib/stock-types";

export function AdminFamilias() {
  const queryClient = useQueryClient();

  const { data: families = [], isLoading: loadingFamilies } = useQuery({
    queryKey: ["stock-families"], queryFn: getFamilies, refetchOnWindowFocus: false,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["stock-products"], queryFn: getProducts, refetchOnWindowFocus: false,
  });

  const crud = useCrudModal<StockFamily>();
  const [form, setForm] = useState({ name: "", status: "1" });
  const fc = (f: string) => (v: any) => setForm((p: any) => ({ ...p, [f]: v?.target?.value ?? v }));

  const handleOpenAdd = () => { setForm({ name: "", status: "1" }); crud.openAdd(); };
  const handleOpenEdit = (fam: StockFamily) => {
    setForm({ name: fam.name, status: fam.status.toString() });
    crud.openEdit(fam);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("O nome da família é obrigatório."); return; }
    try {
      if (crud.isAdd) {
        await createFamily({ name: form.name.trim().toUpperCase(), status: parseInt(form.status) });
      } else if (crud.selected) {
        await updateFamily({ id: crud.selected.id, name: form.name.trim().toUpperCase(), status: parseInt(form.status) });
      }
      queryClient.invalidateQueries({ queryKey: ["stock-families"] });
      toast.success(crud.isAdd ? "Família adicionada com sucesso." : "Família atualizada com sucesso.");
      crud.close();
    } catch {
      toast.error("Erro ao guardar família.");
    }
  };

  const handleDelete = async () => {
    if (!crud.selected) return;
    try {
      await deleteFamily(crud.selected.id);
      queryClient.invalidateQueries({ queryKey: ["stock-families"] });
      toast.success("Família removida com sucesso.");
      crud.close();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao eliminar família.");
    }
  };

  const familyProducts = useMemo(() => {
    if (!crud.selected) return [];
    const s = crud.selected;
    return products.filter((p) => p.familyId === s.id || p.family?.name.toUpperCase() === s.name.toUpperCase());
  }, [crud.selected, products]);

  const productCountsByFamily = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const famName = p.family?.name || "Sem Família";
      counts[famName.toUpperCase()] = (counts[famName.toUpperCase()] || 0) + 1;
    });
    return counts;
  }, [products]);

  const columns: Column<StockFamily>[] = [
    { key: "name", header: "Nome da Família", cell: (r) => <span className="font-semibold">{r.name}</span>, className: "w-1/4" },
    { key: "products", header: "Produtos Associados", cell: (r) => (
      <span className="text-center font-medium">{productCountsByFamily[r.name.toUpperCase()] || 0}</span>
    ), className: "w-1/4 text-center", headerClassName: "text-center" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status === 1 ? "Ativo" : "Inativo"} />, className: "w-1/4 text-center", headerClassName: "text-center" },
    { key: "acoes", header: "Ações", cell: (r) => (
      <RowActions onView={() => crud.openView(r)} onEdit={() => handleOpenEdit(r)} onDelete={() => crud.openDelete(r)} />
    ), className: "w-1/4 text-right", headerClassName: "text-right" },
  ];

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      <PageCard className="p-6 flex flex-col gap-4 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Gestão de Famílias de Produtos</h1>
        <Button onClick={handleOpenAdd} className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 font-medium shadow-none w-fit">
          <Plus className="size-4" /><span>Adicionar Família</span>
        </Button>
      </PageCard>

      <DataTable columns={columns} data={families} isLoading={loadingFamilies && families.length === 0}
        loadingMessage="A carregar famílias..." emptyMessage="Sem famílias disponíveis." rowKey={(r) => r.id} />

      {/* Add / Edit Modal */}
      {(crud.isAdd || crud.isEdit) && (
        <AdminModal open onClose={crud.close} title={crud.isAdd ? "Adicionar Família" : "Editar Família"}
          footer={<><Button variant="outline" onClick={crud.close} className="h-10 px-4">Cancelar</Button>
            <Button type="submit" form="fam-form" className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5">Salvar</Button></>}>
          <form id="fam-form" onSubmit={handleSave} className="flex flex-col gap-4">
            <FormField label="Nome da Família" htmlFor="fam-name">
              <Input id="fam-name" required placeholder="Ex: TEXTIL" value={form.name} onChange={fc("name")} />
            </FormField>
            <FormSelectField label="Status" id="fam-status" value={form.status} onValueChange={fc("status")}
              options={[{ value: "1", label: "Ativo" }, { value: "0", label: "Inativo" }]} />
          </form>
        </AdminModal>
      )}

      {/* View Modal */}
      {crud.isView && crud.selected && (
        <AdminModal open onClose={crud.close} title="Detalhes da Família"
          footer={<Button onClick={crud.close} className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5">Fechar</Button>}>
          <DetailGrid items={[
            { label: "Nome da Família", value: crud.selected.name },
            { label: "Status", value: <StatusBadge status={crud.selected.status === 1 ? "Ativo" : "Inativo"} /> },
          ]} />
          <div className="border-t border-slate-100 dark:border-slate-800/60 my-3" />
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Produtos Associados ({familyProducts.length})
            </span>
            {familyProducts.length > 0 ? (
              <div className="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
                {familyProducts.map((prod) => (
                  <div key={prod.id} className="p-3 flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{prod.name}</span>
                      <span className="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">Stock: {prod.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-450 italic">Nenhum produto cadastrado nesta família.</span>
            )}
          </div>
        </AdminModal>
      )}

      <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDelete}
        title="Eliminar Família" itemName={crud.selected?.name || ""} />
    </div>
  );
}
