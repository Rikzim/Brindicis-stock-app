import { useReducer, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getFamilies } from "@/lib/stock-api";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { FormField } from "@/components/ui/form-field";
import { FilterSelectField } from "@/components/ui/filter-select-field";
import { PageCard } from "@/components/ui/page-card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RowActions } from "@/components/ui/row-actions";
import { AdminModal } from "@/components/ui/admin-modal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { DetailGrid } from "@/components/ui/detail-grid";
import { useCrudModal } from "@/hooks/use-crud-modal";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

async function downloadExport(url: string) {
  try {
    const response = await apiClient.get(url, { responseType: "blob" });
    const disposition = response.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+?)"?$/);
    const filename = match ? match[1] : `export-${Date.now()}.xlsx`;
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success("Ficheiro exportado com sucesso.");
  } catch {
    toast.error("Erro ao exportar ficheiro.");
  }
}

interface StockRow {
  id: string; productId: number; variantId: number | null; name: string; ref: string;
  fullRef: string; image: string | null; color: string; quantity: number; reserved: number;
  drawer: string; cx: string; pvp: number; fornecedor: string; family: string; estado: string;
}

interface FilterState {
  selectedFornecedor: string; selectedFamilia: string; selectedDisponibilidade: string;
  selectedEstado: string; searchCaixa: string; searchGaveta: string;
}

type FilterAction =
  | { type: "SET_FORNECEDOR"; value: string } | { type: "SET_FAMILIA"; value: string }
  | { type: "SET_DISPONIBILIDADE"; value: string } | { type: "SET_ESTADO"; value: string }
  | { type: "SET_CAIXA"; value: string } | { type: "SET_GAVETA"; value: string };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_FORNECEDOR": return { ...state, selectedFornecedor: action.value };
    case "SET_FAMILIA": return { ...state, selectedFamilia: action.value };
    case "SET_DISPONIBILIDADE": return { ...state, selectedDisponibilidade: action.value };
    case "SET_ESTADO": return { ...state, selectedEstado: action.value };
    case "SET_CAIXA": return { ...state, searchCaixa: action.value };
    case "SET_GAVETA": return { ...state, searchGaveta: action.value };
  }
}

const initialFilterState: FilterState = {
  selectedFornecedor: "Todas", selectedFamilia: "Todas", selectedDisponibilidade: "Todos",
  selectedEstado: "Todos", searchCaixa: "", searchGaveta: "",
};

const statusFilterOptions = [
  { value: "Todos", label: "Todos" }, { value: "Com Stock", label: "Com Stock" }, { value: "Esgotado", label: "Esgotado" },
];
const activeStatusFilterOptions = [
  { value: "Todos", label: "Todos" }, { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" },
];

export function AdminStock() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["stock-products"], queryFn: getProducts, refetchOnWindowFocus: false,
  });
  const { data: families = [] } = useQuery({
    queryKey: ["stock-families"], queryFn: getFamilies, refetchOnWindowFocus: false,
  });

  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const crud = useCrudModal<StockRow>();

  const [form, setForm] = useState({ ref: "", name: "", family: "", quantity: "0", pvp: "0", estado: "Ativo" });
  const u = (field: string) => (e: any) => setForm((p) => ({ ...p, [field]: e?.target?.value ?? e }));

  const fornecedores = useMemo(() => {
    const set = new Set<string>(["Todas"]);
    products.forEach((p) => { if (p.type) set.add(p.type); });
    return Array.from(set);
  }, [products]);

  const stockRows = useMemo(() => {
    const rows: StockRow[] = [];
    const { selectedFornecedor, selectedFamilia, selectedDisponibilidade, selectedEstado, searchCaixa, searchGaveta } = filters;
    for (const product of products) {
      if (selectedFornecedor !== "Todas" && product.type !== selectedFornecedor) continue;
      if (selectedFamilia !== "Todas" && product.family?.name !== selectedFamilia) continue;
      if (selectedEstado !== "Todos" && (selectedEstado === "Ativo" ? product.active !== 1 : product.active !== 0)) continue;

      const variants = (product.variants && product.variants.length > 0) ? product.variants : [{
        id: 0, productId: product.id, color: "-", size: null, quantity: product.quantity,
        reserved: product.reserved, cx: product.cx, drawer: product.drawer,
      }];

      for (const v of variants) {
        const avail = v.quantity - v.reserved;
        if (selectedDisponibilidade === "Com Stock" && avail <= 0) continue;
        if (selectedDisponibilidade === "Esgotado" && avail > 0) continue;
        if (searchCaixa && !v.cx?.toLowerCase().includes(searchCaixa.toLowerCase())) continue;
        if (searchGaveta && !v.drawer?.toLowerCase().includes(searchGaveta.toLowerCase())) continue;

        rows.push({
          id: `${product.id}-${v.id}`, productId: product.id, variantId: v.id || null,
          name: product.name, ref: product.ref, fullRef: product.ref,
          image: product.images?.[0]?.url || null, color: v.color || "-",
          quantity: v.quantity, reserved: v.reserved, drawer: v.drawer || product.drawer || "-",
          cx: v.cx || product.cx || "-", pvp: product.pvp,
          fornecedor: product.type || "-", family: product.family?.name || "-",
          estado: product.active === 1 ? "Ativo" : "Inativo",
        });
      }
    }
    return rows;
  }, [products, filters]);

  const familyOptions = families.map((f) => ({ value: f.name, label: f.name }));
  const fornecedorOptions = fornecedores.map((f) => ({ value: f, label: f }));

  const resetForm = () => setForm({ ref: "", name: "", family: families[0]?.name || "", quantity: "0", pvp: "0", estado: "Ativo" });

  const handleAdd = () => { resetForm(); crud.openAdd(); };
  const handleView = (row: StockRow) => crud.openView(row);
  const handleEdit = (row: StockRow) => {
    setForm({ ref: row.ref, name: row.name, family: row.family, quantity: row.quantity.toString(), pvp: row.pvp.toString(), estado: row.estado });
    crud.openEdit(row);
  };
  const handleDelete = (row: StockRow) => crud.openDelete(row);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(crud.isAdd ? "Produto adicionado com sucesso." : "Produto atualizado com sucesso.");
    crud.close();
  };

  const handleDeleteConfirm = () => {
    toast.success("Produto removido com sucesso."); crud.close();
  };

  const columns: Column<StockRow>[] = [
    { key: "image", header: "Imagem", cell: (row) => row.image ? (
      <img src={getImageUrl(row.image)} alt={row.name} className="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900" />
    ) : (<div className="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">-</div>)},
    { key: "ref", header: "Ref", cell: (row) => <span className="font-semibold">{row.ref}</span> },
    { key: "color", header: "Cor", cell: (row) => row.color },
    { key: "qntd", header: "Qntd", cell: (row) => row.quantity },
    { key: "qntdR", header: "Qntd R.", cell: (row) => row.reserved },
    { key: "gaveta", header: "Gaveta", cell: (row) => row.drawer },
    { key: "cx", header: "Cx", cell: (row) => row.cx },
    { key: "pvp", header: "Pvp", cell: (row) => `${row.pvp.toFixed(2)} €` },
    { key: "fornecedor", header: "Fornecedor", cell: (row) => row.fornecedor },
    { key: "estado", header: "Estado", cell: (row) => <StatusBadge status={row.estado} /> },
    { key: "acoes", header: "Ações", cell: (row) => (
      <RowActions onView={() => handleView(row)} onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} />
    ), className: "text-right", headerClassName: "text-right" },
  ];

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      <PageCard className="p-6 flex flex-col gap-4 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Gestão de Stock</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FilterSelectField label="Fornecedor" value={filters.selectedFornecedor} onValueChange={(v) => dispatch({ type: "SET_FORNECEDOR", value: v })} options={fornecedorOptions} />
          <FilterSelectField label="Família" value={filters.selectedFamilia} onValueChange={(v) => dispatch({ type: "SET_FAMILIA", value: v })} options={[{ value: "Todas", label: "Todas" }, ...familyOptions]} />
          <FilterSelectField label="Disponibilidade" value={filters.selectedDisponibilidade} onValueChange={(v) => dispatch({ type: "SET_DISPONIBILIDADE", value: v })} options={statusFilterOptions} />
          <FilterSelectField label="Estado" value={filters.selectedEstado} onValueChange={(v) => dispatch({ type: "SET_ESTADO", value: v })} options={activeStatusFilterOptions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Pesquisar por Caixa (CX)" htmlFor="filter-cx">
            <Input id="filter-cx" placeholder="Digite o nome da caixa..." value={filters.searchCaixa} onChange={(e) => dispatch({ type: "SET_CAIXA", value: e.target.value })} className="h-10" />
          </FormField>
          <FormField label="Pesquisar por Gaveta" htmlFor="filter-gaveta">
            <Input id="filter-gaveta" placeholder="Digite o nome da gaveta..." value={filters.searchGaveta} onChange={(e) => dispatch({ type: "SET_GAVETA", value: e.target.value })} className="h-10" />
          </FormField>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleAdd} className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 font-medium shadow-none">
            <Plus className="size-4" /><span>Adicionar Produto</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1.5" onClick={() => downloadExport("/exports/stock-by-cx")}>
            <Download className="size-4" /><span>Exportar por Caixa</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1.5" onClick={() => downloadExport("/exports/products")}>
            <Download className="size-4" /><span>Exportar</span>
          </Button>
        </div>
      </PageCard>

      <DataTable columns={columns} data={stockRows} isLoading={isLoading}
        loadingMessage="A carregar produtos..." emptyMessage="Nenhum produto encontrado." rowKey={(r) => r.id} />

      {/* Add / Edit Modal */}
      {(crud.isAdd || crud.isEdit) && (
        <AdminModal open onClose={crud.close} title={crud.isAdd ? "Adicionar Produto" : "Editar Produto"}
          footer={<><Button variant="outline" onClick={crud.close} className="h-10 px-4">Cancelar</Button>
            <Button type="submit" form="product-form" className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5">Salvar</Button></>}>
          <form id="product-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Referência" htmlFor="prod-ref">
              <Input id="prod-ref" required placeholder="Ex: REF-001" value={form.ref} onChange={u("ref")} />
            </FormField>
            <FormField label="Nome" htmlFor="prod-name">
              <Input id="prod-name" required placeholder="Nome do produto" value={form.name} onChange={u("name")} />
            </FormField>
            <FormField label="Família" htmlFor="prod-family">
              <SearchableSelect id="prod-family" value={form.family} onValueChange={u("family")} options={familyOptions} placeholder="Selecionar família" />
            </FormField>
            <FormField label="Estado" htmlFor="prod-estado">
              <SearchableSelect id="prod-estado" value={form.estado} onValueChange={u("estado")} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} placeholder="Selecionar estado" />
            </FormField>
            <FormField label="Quantidade" htmlFor="prod-qty">
              <Input id="prod-qty" type="number" min="0" value={form.quantity} onChange={u("quantity")} />
            </FormField>
            <FormField label="PVP (€)" htmlFor="prod-pvp">
              <Input id="prod-pvp" type="number" step="0.01" min="0" value={form.pvp} onChange={u("pvp")} />
            </FormField>
          </form>
        </AdminModal>
      )}

      {/* View Modal */}
      {crud.isView && crud.selected && (
        <AdminModal open onClose={crud.close} title="Detalhes do Produto"
          footer={<Button onClick={crud.close} className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5">Fechar</Button>}>
          <div className="col-span-2 flex justify-center mb-2">
            {crud.selected.image ? (
              <img src={getImageUrl(crud.selected.image)} alt={crud.selected.name} className="h-24 object-contain rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900" />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">Sem imagem</div>
            )}
          </div>
          <DetailGrid items={[
            { label: "Referência", value: crud.selected.ref }, { label: "Nome", value: crud.selected.name },
            { label: "Cor", value: crud.selected.color }, { label: "Quantidade", value: crud.selected.quantity },
            { label: "Gaveta", value: crud.selected.drawer }, { label: "Cx", value: crud.selected.cx },
            { label: "PVP", value: `${crud.selected.pvp.toFixed(2)} €` }, { label: "Fornecedor", value: crud.selected.fornecedor },
            { label: "Família", value: crud.selected.family }, { label: "Estado", value: <StatusBadge status={crud.selected.estado} /> },
          ]} />
        </AdminModal>
      )}

      <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDeleteConfirm}
        title="Eliminar Produto" itemName={crud.selected ? `${crud.selected.ref} - ${crud.selected.name}` : ""} />
    </div>
  );
}
