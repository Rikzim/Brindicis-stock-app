import { useReducer, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, getFamilies } from "@/lib/stock-api";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ProductStock } from "@/lib/stock-types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface StockRow {
  id: string;
  productId: number;
  variantId: number | null;
  name: string;
  ref: string;
  fullRef: string;
  image: string | null;
  color: string;
  quantity: number;
  reserved: number;
  drawer: string;
  cx: string;
  pvp: number;
  fornecedor: string;
  family: string;
  estado: string;
}

function getImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

interface FilterState {
  selectedFornecedor: string;
  selectedFamilia: string;
  selectedDisponibilidade: string;
  selectedEstado: string;
  searchCaixa: string;
  searchGaveta: string;
}

type FilterAction =
  | { type: "SET_FORNECEDOR"; value: string }
  | { type: "SET_FAMILIA"; value: string }
  | { type: "SET_DISPONIBILIDADE"; value: string }
  | { type: "SET_ESTADO"; value: string }
  | { type: "SET_CAIXA"; value: string }
  | { type: "SET_GAVETA"; value: string };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_FORNECEDOR":
      return { ...state, selectedFornecedor: action.value };
    case "SET_FAMILIA":
      return { ...state, selectedFamilia: action.value };
    case "SET_DISPONIBILIDADE":
      return { ...state, selectedDisponibilidade: action.value };
    case "SET_ESTADO":
      return { ...state, selectedEstado: action.value };
    case "SET_CAIXA":
      return { ...state, searchCaixa: action.value };
    case "SET_GAVETA":
      return { ...state, searchGaveta: action.value };
  }
}

const initialFilterState: FilterState = {
  selectedFornecedor: "Todas",
  selectedFamilia: "Todas",
  selectedDisponibilidade: "Todos",
  selectedEstado: "Todos",
  searchCaixa: "",
  searchGaveta: "",
};

function StockFilters({
  filters,
  dispatch,
  fornecedores,
  families,
  onAdd,
}: {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  fornecedores: string[];
  families: { id: number; name: string }[];
  onAdd: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
      <h1 className="text-lg font-bold text-slate-800 dark:text-white">
        Gestão de Stock
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-fornecedor" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fornecedor
          </label>
          <div className="relative">
            <select
              id="filter-fornecedor"
              value={filters.selectedFornecedor}
              onChange={(e) => dispatch({ type: "SET_FORNECEDOR", value: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {fornecedores.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-familia" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Família
          </label>
          <div className="relative">
            <select
              id="filter-familia"
              value={filters.selectedFamilia}
              onChange={(e) => dispatch({ type: "SET_FAMILIA", value: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="Todas">Todas</option>
              {families.map((fam) => (
                <option key={fam.id} value={fam.name}>
                  {fam.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-disponibilidade" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Disponibilidade
          </label>
          <div className="relative">
            <select
              id="filter-disponibilidade"
              value={filters.selectedDisponibilidade}
              onChange={(e) => dispatch({ type: "SET_DISPONIBILIDADE", value: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="Todos">Todos</option>
              <option value="Com Stock">Com Stock</option>
              <option value="Esgotado">Esgotado</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-estado" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Estado
          </label>
          <div className="relative">
            <select
              id="filter-estado"
              value={filters.selectedEstado}
              onChange={(e) => dispatch({ type: "SET_ESTADO", value: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-caixa" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pesquisar por Caixa (CX)
          </label>
          <div className="relative">
            <Input
              id="filter-caixa"
              placeholder="Digite o nome da caixa..."
              value={filters.searchCaixa}
              onChange={(e) => dispatch({ type: "SET_CAIXA", value: e.target.value })}
              className="h-10 w-full rounded-lg border-slate-200 bg-slate-50/30 pl-3 pr-10 text-sm focus-visible:ring-blue-500 shadow-none dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-gaveta" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pesquisar por Gaveta
          </label>
          <div className="relative">
            <Input
              id="filter-gaveta"
              placeholder="Digite o nome da gaveta..."
              value={filters.searchGaveta}
              onChange={(e) => dispatch({ type: "SET_GAVETA", value: e.target.value })}
              className="h-10 w-full rounded-lg border-slate-200 bg-slate-50/30 pl-3 pr-10 text-sm focus-visible:ring-blue-500 shadow-none dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={onAdd}
          className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium shadow-none"
        >
          <Plus className="size-4" />
          <span>Adicionar Produto</span>
        </Button>
      </div>
    </div>
  );
}

function StockTable({
  rows,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: {
  rows: StockRow[];
  isLoading: boolean;
  onView: (row: StockRow) => void;
  onEdit: (row: StockRow) => void;
  onDelete: (row: StockRow) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Produtos
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" className="text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5">
            <span>Exportar por Caixa</span>
          </button>
          <button type="button" className="text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5">
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
            <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Imagem</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ref</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cor</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Qntd</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Qntd R.</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gaveta</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cx</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pvp</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Fornecedor</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Estado</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={11} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-400 dark:text-slate-500">
                      A carregar produtos...
                    </span>
                  </div>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="px-6 py-4">
                    {row.image ? (
                      <img
                        src={getImageUrl(row.image)}
                        alt={row.name}
                        className="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900"
                      />
                    ) : (
                      <div className="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-700 font-semibold text-xs">
                        BOX
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {row.fullRef}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-350">
                    {row.color}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {row.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {row.reserved}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {row.drawer}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    {row.cx}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {row.pvp === 0 ? "0 €" : `${row.pvp.toFixed(2)} €`}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-350">
                    {row.fornecedor}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.estado === "Ativo"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                      }`}
                    >
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                        title="Visualizar"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-6 py-24 text-center">
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    Nenhum produto com os filtros selecionados
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminStock() {
  const queryClient = useQueryClient();
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  const { data: families = [], isLoading: loadingFamilies } = useQuery({
    queryKey: ["stock-families"],
    queryFn: getFamilies,
    refetchOnWindowFocus: false,
  });

  // Modal control states
  const [activeModal, setActiveModal] = useState<"add" | "view" | "edit" | "delete" | null>(null);
  const [selectedRow, setSelectedRow] = useState<StockRow | null>(null);

  // Form states for Add/Edit
  const [formName, setFormName] = useState("");
  const [formRef, setFormRef] = useState("");
  const [formFornecedor, setFormFornecedor] = useState("");
  const [formFamilyId, setFormFamilyId] = useState("");
  const [formQuantity, setFormQuantity] = useState("0");
  const [formReserved, setFormReserved] = useState("0");
  const [formDrawer, setFormDrawer] = useState("");
  const [formCx, setFormCx] = useState("");
  const [formPvp, setFormPvp] = useState("0.00");
  const [formPc, setFormPc] = useState("0.00");
  const [formActive, setFormActive] = useState("1"); // 1 for active, 0 for inactive

  const fornecedoresList = useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      if (p.type) list.add(p.type);
    });
    return Array.from(list);
  }, [products]);

  const fornecedoresDropdown = useMemo(() => {
    return ["Todas", ...fornecedoresList];
  }, [fornecedoresList]);

  const tableRows = useMemo((): StockRow[] => {
    return products.flatMap((product): StockRow[] => {
      const provider = product.type || "SOLS";
      const statusText = product.active === 1 ? "Ativo" : "Inativo";

      if (product.variants && product.variants.length > 0) {
        return product.variants.map((variant) => ({
          id: `${product.id}-${variant.id}`,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          ref: product.ref,
          fullRef: `${product.ref} ${product.name}`,
          image: product.images?.[0]?.url || null,
          color: variant.color || "-",
          quantity: variant.quantity,
          reserved: variant.reserved,
          drawer: variant.drawer || product.drawer || "-",
          cx: variant.cx || product.cx || "-",
          pvp: product.pvp,
          fornecedor: provider,
          family: product.family?.name || "Sem Família",
          estado: statusText,
        }));
      }

      return [
        {
          id: `${product.id}-default`,
          productId: product.id,
          variantId: null,
          name: product.name,
          ref: product.ref,
          fullRef: `${product.ref} ${product.name}`,
          image: product.images?.[0]?.url || null,
          color: "-",
          quantity: product.quantity,
          reserved: product.reserved,
          drawer: product.drawer || "-",
          cx: product.cx || "-",
          pvp: product.pvp,
          fornecedor: provider,
          family: product.family?.name || "Sem Família",
          estado: statusText,
        },
      ];
    });
  }, [products]);

  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      if (filters.selectedFornecedor !== "Todas" && row.fornecedor !== filters.selectedFornecedor) return false;
      if (filters.selectedFamilia !== "Todas" && row.family !== filters.selectedFamilia) return false;
      if (filters.selectedDisponibilidade !== "Todos") {
        if (filters.selectedDisponibilidade === "Com Stock" && row.quantity <= 0) return false;
        if (filters.selectedDisponibilidade === "Esgotado" && row.quantity > 0) return false;
      }
      if (filters.selectedEstado !== "Todos" && row.estado !== filters.selectedEstado) return false;
      if (filters.searchCaixa && !row.cx.toLowerCase().includes(filters.searchCaixa.toLowerCase())) return false;
      if (filters.searchGaveta && !row.drawer.toLowerCase().includes(filters.searchGaveta.toLowerCase())) return false;
      return true;
    });
  }, [tableRows, filters]);

  const isLoading = loadingProducts || loadingFamilies;

  // Actions
  const handleOpenAdd = () => {
    setFormName("");
    setFormRef("");
    setFormFornecedor(fornecedoresList[0] || "SOLS");
    setFormFamilyId(families[0]?.id?.toString() || "");
    setFormQuantity("0");
    setFormReserved("0");
    setFormDrawer("");
    setFormCx("");
    setFormPvp("0.00");
    setFormPc("0.00");
    setFormActive("1");
    setActiveModal("add");
  };

  const handleOpenView = (row: StockRow) => {
    setSelectedRow(row);
    setActiveModal("view");
  };

  const handleOpenEdit = (row: StockRow) => {
    setSelectedRow(row);
    // Find parent product details
    const parent = products.find((p) => p.id === row.productId);
    if (!parent) return;

    setFormName(parent.name || "");
    setFormRef(parent.ref || "");
    setFormFornecedor(parent.type || "");
    setFormFamilyId(parent.familyId?.toString() || "");
    setFormQuantity(row.quantity.toString());
    setFormReserved(row.reserved.toString());
    setFormDrawer(row.drawer === "-" ? "" : row.drawer);
    setFormCx(row.cx === "-" ? "" : row.cx);
    setFormPvp(parent.pvp?.toString() || "0.00");
    setFormPc(parent.pc?.toString() || "0.00");
    setFormActive(parent.active?.toString() || "1");
    setActiveModal("edit");
  };

  const handleOpenDelete = (row: StockRow) => {
    setSelectedRow(row);
    setActiveModal("delete");
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRef.trim()) {
      toast.error("Nome e Referência são obrigatórios.");
      return;
    }

    const selectedFam = families.find((fam) => fam.id.toString() === formFamilyId);
    
    // Construct fake product matching ProductStock type
    const newProduct: ProductStock = {
      id: Date.now(),
      name: formName.trim(),
      ref: formRef.trim(),
      type: formFornecedor.trim().toUpperCase(),
      categoryId: 1,
      familyId: parseInt(formFamilyId) || 1,
      family: selectedFam ? { id: selectedFam.id, name: selectedFam.name, status: 1 } : null,
      category: null,
      quantity: parseInt(formQuantity) || 0,
      reserved: parseInt(formReserved) || 0,
      drawer: formDrawer.trim() || "-",
      cx: formCx.trim() || "-",
      pvp: parseFloat(formPvp) || 0,
      pc: parseFloat(formPc) || 0,
      active: parseInt(formActive),
      status: 1,
      description: null,
      number: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [],
      variants: [],
      sizes: [],
      colors: [],
      drawers: [],
    };

    queryClient.setQueryData<ProductStock[]>(["stock-products"], (old = []) => [newProduct, ...old]);
    toast.success("Produto adicionado com sucesso.");
    setActiveModal(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    if (!formName.trim() || !formRef.trim()) {
      toast.error("Nome e Referência são obrigatórios.");
      return;
    }

    const selectedFam = families.find((fam) => fam.id.toString() === formFamilyId);

    queryClient.setQueryData<ProductStock[]>(["stock-products"], (old = []) => {
      return old.map((p) => {
        if (p.id !== selectedRow.productId) return p;
        
        // If updating a variant
        let updatedVariants = p.variants;
        if (selectedRow.variantId !== null) {
          updatedVariants = p.variants.map((v) => {
            if (v.id !== selectedRow.variantId) return v;
            return {
              ...v,
              quantity: parseInt(formQuantity) || 0,
              reserved: parseInt(formReserved) || 0,
              drawer: formDrawer.trim() || "-",
              cx: formCx.trim() || "-",
            };
          });
        }

        return {
          ...p,
          name: formName.trim(),
          ref: formRef.trim(),
          type: formFornecedor.trim().toUpperCase(),
          familyId: parseInt(formFamilyId) || p.familyId,
          family: selectedFam ? { id: selectedFam.id, name: selectedFam.name, status: 1 } : p.family,
          quantity: selectedRow.variantId === null ? (parseInt(formQuantity) || 0) : p.quantity,
          reserved: selectedRow.variantId === null ? (parseInt(formReserved) || 0) : p.reserved,
          drawer: selectedRow.variantId === null ? (formDrawer.trim() || "-") : p.drawer,
          cx: selectedRow.variantId === null ? (formCx.trim() || "-") : p.cx,
          pvp: parseFloat(formPvp) || 0,
          pc: parseFloat(formPc) || 0,
          active: parseInt(formActive),
          variants: updatedVariants,
        };
      });
    });

    toast.success("Produto editado com sucesso.");
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedRow) return;

    queryClient.setQueryData<ProductStock[]>(["stock-products"], (old = []) => {
      return old.map((p) => {
        if (p.id !== selectedRow.productId) return p;
        // If variant, remove the variant
        if (selectedRow.variantId !== null) {
          return {
            ...p,
            variants: p.variants.filter((v) => v.id !== selectedRow.variantId),
          };
        }
        // Else it will just be filtered out next
        return null;
      }).filter(Boolean) as ProductStock[];
    });

    toast.success("Produto removido com sucesso.");
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      <StockFilters
        filters={filters}
        dispatch={dispatch}
        fornecedores={fornecedoresDropdown}
        families={families}
        onAdd={handleOpenAdd}
      />
      <StockTable
        rows={filteredRows}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* --- MODALS --- */}

      {/* Add / Edit Product Modal */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in duration-200">
          <form
            onSubmit={activeModal === "add" ? handleSaveAdd : handleSaveEdit}
            className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                {activeModal === "add" ? "Adicionar Produto ao Stock" : "Editar Produto"}
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
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: T-Shirt Sol's Regent"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Referência
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: L190"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Fornecedor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SOLS"
                  value={formFornecedor}
                  onChange={(e) => setFormFornecedor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Família
                </label>
                <select
                  value={formFamilyId}
                  onChange={(e) => setFormFamilyId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">Sem Família</option>
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Estado
                </label>
                <select
                  value={formActive}
                  onChange={(e) => setFormActive(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="1">Ativo</option>
                  <option value="0">Inativo</option>
                </select>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 md:col-span-2 my-1" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Quantidade Total em Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Quantidade Reservada
                </label>
                <input
                  type="number"
                  min="0"
                  value={formReserved}
                  onChange={(e) => setFormReserved(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Gaveta
                </label>
                <input
                  type="text"
                  placeholder="Ex: G12"
                  value={formDrawer}
                  onChange={(e) => setFormDrawer(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Caixa (CX)
                </label>
                <input
                  type="text"
                  placeholder="Ex: CX40"
                  value={formCx}
                  onChange={(e) => setFormCx(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 md:col-span-2 my-1" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  PVP (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formPvp}
                  onChange={(e) => setFormPvp(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Preço de Custo (PC) (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formPc}
                  onChange={(e) => setFormPc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-2.5 shrink-0">
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

      {/* View Product Modal */}
      {activeModal === "view" && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Detalhes do Produto
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <div className="flex gap-4 items-start">
                {selectedRow.image ? (
                  <img
                    src={getImageUrl(selectedRow.image)}
                    alt={selectedRow.name}
                    className="size-20 object-contain rounded-xl border border-slate-150 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900"
                  />
                ) : (
                  <div className="size-20 flex items-center justify-center rounded-xl border border-slate-150 bg-slate-50 text-slate-350 dark:border-slate-800 dark:bg-slate-900 font-bold text-sm">
                    SEM IMAGEM
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {selectedRow.family}
                  </span>
                  <h4 className="text-lg font-bold text-slate-850 dark:text-slate-100 leading-tight">
                    {selectedRow.name}
                  </h4>
                  <span className="text-sm font-mono text-slate-500 mt-1">
                    Ref: {selectedRow.ref}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Fornecedor
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRow.fornecedor}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Estado
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      selectedRow.estado === "Ativo"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                    }`}
                  >
                    {selectedRow.estado}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Cor
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRow.color}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Preço de Venda (PVP)
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {selectedRow.pvp === 0 ? "0 €" : `${selectedRow.pvp.toFixed(2)} €`}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Stock Total
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {selectedRow.quantity} unid.
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Reservado
                  </span>
                  <span className="text-sm font-extrabold text-amber-600">
                    {selectedRow.reserved} unid.
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Disponível
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {Math.max(0, selectedRow.quantity - selectedRow.reserved)} unid.
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Localização (Gaveta / Caixa)
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {selectedRow.drawer} / {selectedRow.cx}
                  </span>
                </div>
              </div>
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

      {/* Delete Product Modal */}
      {activeModal === "delete" && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
                <AlertTriangle className="size-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Eliminar Produto do Stock
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tem a certeza que deseja eliminar o produto{" "}
                  <strong className="text-slate-800 dark:text-slate-100 font-bold">
                    {selectedRow.name} ({selectedRow.ref})
                  </strong>{" "}
                  {selectedRow.color !== "-" && `na cor ${selectedRow.color}`}? Esta ação não pode ser desfeita.
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
                className="h-10 bg-red-600 hover:bg-red-700 text-white px-5 rounded-lg text-sm font-medium shadow-none"
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
