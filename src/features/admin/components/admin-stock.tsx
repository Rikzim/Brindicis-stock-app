import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getFamilies } from "@/lib/stock-api";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export function AdminStock() {
  // Local state for filters
  const [selectedFornecedor, setSelectedFornecedor] = useState("Todas");
  const [selectedFamilia, setSelectedFamilia] = useState("Todas");
  const [selectedDisponibilidade, setSelectedDisponibilidade] = useState("Todos");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  
  const [searchCaixa, setSearchCaixa] = useState("");
  const [searchGaveta, setSearchGaveta] = useState("");

  // Fetch data
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

  // Extract unique suppliers (fornecedores) from products
  const fornecedores = useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      if (p.type) list.add(p.type);
    });
    return ["Todas", ...Array.from(list)];
  }, [products]);

  // Flatten products and their variants to populate the table
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

  // Filtered rows
  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      if (selectedFornecedor !== "Todas" && row.fornecedor !== selectedFornecedor) {
        return false;
      }
      if (selectedFamilia !== "Todas" && row.family !== selectedFamilia) {
        return false;
      }
      if (selectedDisponibilidade !== "Todos") {
        if (selectedDisponibilidade === "Com Stock" && row.quantity <= 0) return false;
        if (selectedDisponibilidade === "Esgotado" && row.quantity > 0) return false;
      }
      if (selectedEstado !== "Todos" && row.estado !== selectedEstado) {
        return false;
      }
      if (searchCaixa && !row.cx.toLowerCase().includes(searchCaixa.toLowerCase())) {
        return false;
      }
      if (searchGaveta && !row.drawer.toLowerCase().includes(searchGaveta.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [
    tableRows,
    selectedFornecedor,
    selectedFamilia,
    selectedDisponibilidade,
    selectedEstado,
    searchCaixa,
    searchGaveta,
  ]);

  const isLoading = loadingProducts || loadingFamilies;
  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden">
      {/* Filters Area Card containing the Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          Gestão de Stock
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Fornecedor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Fornecedor
            </label>
            <div className="relative">
              <select
                value={selectedFornecedor}
                onChange={(e) => setSelectedFornecedor(e.target.value)}
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

          {/* Família */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Família
            </label>
            <div className="relative">
              <select
                value={selectedFamilia}
                onChange={(e) => setSelectedFamilia(e.target.value)}
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

          {/* Disponibilidade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Disponibilidade
            </label>
            <div className="relative">
              <select
                value={selectedDisponibilidade}
                onChange={(e) => setSelectedDisponibilidade(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="Todos">Todos</option>
                <option value="Com Stock">Com Stock</option>
                <option value="Esgotado">Esgotado</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estado
            </label>
            <div className="relative">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
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
          {/* Pesquisar Caixa */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pesquisar por Caixa (CX)
            </label>
            <div className="relative">
              <Input
                placeholder="Digite o nome da caixa..."
                value={searchCaixa}
                onChange={(e) => setSearchCaixa(e.target.value)}
                className="h-10 w-full rounded-lg border-slate-200 bg-slate-50/30 pl-3 pr-10 text-sm focus-visible:ring-blue-500 shadow-none dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Pesquisar Gaveta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pesquisar por Gaveta
            </label>
            <div className="relative">
              <Input
                placeholder="Digite o nome da gaveta..."
                value={searchGaveta}
                onChange={(e) => setSearchGaveta(e.target.value)}
                className="h-10 w-full rounded-lg border-slate-200 bg-slate-50/30 pl-3 pr-10 text-sm focus-visible:ring-blue-500 shadow-none dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>
        </div>

        <div>
          <Button className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium">
            <Plus className="size-4" />
            <span>Adicionar Produto</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Produtos
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5">
              <span>Exportar por Caixa</span>
            </button>
            <button className="text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5">
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Imagem
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ref
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Cor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Qntd
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Qntd R.
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Gaveta
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Cx
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Pvp
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Estado
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ações
                </th>
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
              ) : filteredRows.length > 0 ? (
                filteredRows.map((row) => (
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
                    <td className="px-6 py-4 text-sm text-slate-655 dark:text-slate-350">
                      {row.fornecedor}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                          title="Visualizar"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-705 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
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
    </div>
  );
}
