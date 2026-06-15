import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/stock-api";
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

interface Supplier { id: number; name: string; status: string; }

export function AdminFornecedores() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["stock-products"], queryFn: getProducts, refetchOnWindowFocus: false,
  });

  const [supplierList, setSupplierList] = useState<Supplier[]>(() => {
    if (products.length > 0) {
      const list = new Set<string>(["DELTAPLUS", "COUTALE", "SOLS", "ORIENTE"]);
      products.forEach((p) => { if (p.type) list.add(p.type.toUpperCase()); });
      return Array.from(list).map((name, index) => ({ id: index + 1, name, status: "Ativo" }));
    }
    return [
      { id: 1, name: "DELTAPLUS", status: "Ativo" }, { id: 2, name: "COUTALE", status: "Ativo" },
      { id: 3, name: "SOLS", status: "Ativo" }, { id: 4, name: "ORIENTE", status: "Ativo" },
    ];
  });
  const { activeModal, selected, openAdd, openView, openEdit, openDelete, close } = useCrudModal<Supplier>();
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Ativo");

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && products.length > 0) {
      initialized.current = true;
      const list = new Set<string>(["DELTAPLUS", "COUTALE", "SOLS", "ORIENTE"]);
      products.forEach((p) => { if (p.type) list.add(p.type.toUpperCase()); });
      setSupplierList(Array.from(list).map((name, index) => ({ id: index + 1, name, status: "Ativo" })));
    }
  }, [products]);

  const handleOpenAdd = () => { setFormName(""); setFormStatus("Ativo"); openAdd(); };
  const handleOpenEdit = (sup: Supplier) => { setFormName(sup.name); setFormStatus(sup.status); openEdit(sup); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { toast.error("O nome do fornecedor é obrigatório."); return; }
    const updated = { id: Date.now(), name: formName.trim().toUpperCase(), status: formStatus };
    if (activeModal === "add") {
      setSupplierList((prev) => [updated, ...prev]);
      toast.success("Fornecedor adicionado com sucesso.");
    } else if (selected) {
      setSupplierList((prev) => prev.map((s) => s.id === selected.id ? { ...s, name: formName.trim().toUpperCase(), status: formStatus } : s));
      toast.success("Fornecedor atualizado com sucesso.");
    }
    close();
  };

  const handleDelete = () => {
    if (!selected) return;
    setSupplierList((prev) => prev.filter((s) => s.id !== selected.id));
    toast.success("Fornecedor removido com sucesso."); close();
  };

  const selectedProducts = useMemo(() => {
    if (!selected) return [];
    return products.filter((p) => p.type?.toUpperCase() === selected.name.toUpperCase());
  }, [selected, products]);

  const columns: Column<Supplier>[] = [
    { key: "name", header: "Fornecedor", cell: (r) => <span className="font-semibold">{r.name}</span>, className: "w-1/3" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, className: "w-1/3 text-center", headerClassName: "text-center" },
    { key: "actions", header: "Ações", cell: (r) => (
      <RowActions onView={() => openView(r)} onEdit={() => handleOpenEdit(r)} onDelete={() => openDelete(r)} />
    ), className: "w-1/3 text-right", headerClassName: "text-right" },
  ];

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      <PageCard className="p-6 flex flex-col gap-4 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Gestão de Fornecedores</h1>
        <Button onClick={handleOpenAdd} className="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none w-fit">
          <Plus className="size-4" /><span>Adicionar Fornecedor</span>
        </Button>
      </PageCard>

      <DataTable columns={columns} data={supplierList} isLoading={isLoading && supplierList.length === 0}
        loadingMessage="A carregar fornecedores..." emptyMessage="Sem fornecedores disponíveis." rowKey={(r) => r.id} />

      {/* Add / Edit Modal */}
      {(activeModal === "add" || activeModal === "edit") && (
        <AdminModal open onClose={close} title={activeModal === "add" ? "Adicionar Fornecedor" : "Editar Fornecedor"}
          footer={<><Button variant="outline" onClick={close} className="h-10 px-4">Cancelar</Button>
            <Button type="submit" form="sup-form" className="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button></>}>
          <form id="sup-form" onSubmit={handleSave} className="flex flex-col gap-4">
            <FormField label="Nome do Fornecedor" htmlFor="sup-name">
              <Input id="sup-name" required placeholder="Ex: COUTALE" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </FormField>
            <FormSelectField label="Status" id="sup-status" value={formStatus} onValueChange={setFormStatus}
              options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
          </form>
        </AdminModal>
      )}

      {/* View Modal */}
      {activeModal === "view" && selected && (
        <AdminModal open onClose={close} title="Detalhes do Fornecedor"
          footer={<Button onClick={close} className="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>}>
          <DetailGrid items={[
            { label: "Nome", value: selected.name },
            { label: "Status", value: <StatusBadge status={selected.status} /> },
          ]} />
          <div className="border-t border-slate-100 dark:border-slate-800/60 my-3" />
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Produtos Associados ({selectedProducts.length})</span>
            {selectedProducts.length > 0 ? (
              <div className="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
                {selectedProducts.map((prod) => (
                  <div key={prod.id} className="p-3 flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{prod.name}</span>
                      <span className="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">Qtd: {prod.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-450 italic">Nenhum produto cadastrado para este fornecedor.</span>
            )}
          </div>
        </AdminModal>
      )}

      <ConfirmDeleteModal open={activeModal === "delete"} onClose={close} onConfirm={handleDelete}
        title="Eliminar Fornecedor" itemName={selected?.name || ""} />
    </div>
  );
}
