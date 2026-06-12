import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/stock-api";
import { Plus, Loader2, Pencil, Trash2, Eye, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Supplier {
  id: number;
  name: string;
  status: string;
}

export function AdminFornecedores() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeModal, setActiveModal] = useState<"add" | "view" | "edit" | "delete" | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Ativo");

  // Load initial suppliers from products & defaults
  useEffect(() => {
    if (products.length > 0 && supplierList.length === 0) {
      const list = new Set<string>(["DELTAPLUS", "COUTALE", "SOLS", "ORIENTE"]);
      products.forEach((p) => {
        if (p.type) {
          list.add(p.type.toUpperCase());
        }
      });
      setSupplierList(
        Array.from(list).map((name, index) => ({
          id: index + 1,
          name,
          status: "Ativo",
        }))
      );
    } else if (products.length === 0 && !isLoading && supplierList.length === 0) {
      // Fallback defaults if no products
      setSupplierList([
        { id: 1, name: "DELTAPLUS", status: "Ativo" },
        { id: 2, name: "COUTALE", status: "Ativo" },
        { id: 3, name: "SOLS", status: "Ativo" },
        { id: 4, name: "ORIENTE", status: "Ativo" },
      ]);
    }
  }, [products, isLoading]);

  const handleOpenAdd = () => {
    setFormName("");
    setFormStatus("Ativo");
    setActiveModal("add");
  };

  const handleOpenEdit = (sup: Supplier) => {
    setSelectedSupplier(sup);
    setFormName(sup.name);
    setFormStatus(sup.status);
    setActiveModal("edit");
  };

  const handleOpenView = (sup: Supplier) => {
    setSelectedSupplier(sup);
    setActiveModal("view");
  };

  const handleOpenDelete = (sup: Supplier) => {
    setSelectedSupplier(sup);
    setActiveModal("delete");
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("O nome do fornecedor é obrigatório.");
      return;
    }
    const newSup: Supplier = {
      id: Date.now(),
      name: formName.trim().toUpperCase(),
      status: formStatus,
    };
    setSupplierList((prev) => [newSup, ...prev]);
    toast.success("Fornecedor adicionado com sucesso.");
    setActiveModal(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    if (!formName.trim()) {
      toast.error("O nome do fornecedor é obrigatório.");
      return;
    }
    setSupplierList((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? { ...s, name: formName.trim().toUpperCase(), status: formStatus }
          : s
      )
    );
    toast.success("Fornecedor atualizado com sucesso.");
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSupplier) return;
    setSupplierList((prev) => prev.filter((s) => s.id !== selectedSupplier.id));
    toast.success("Fornecedor removido com sucesso.");
    setActiveModal(null);
  };

  // Associated products for selected supplier
  const selectedSupplierProducts = useMemo(() => {
    if (!selectedSupplier) return [];
    return products.filter(
      (p) => p.type?.toUpperCase() === selectedSupplier.name.toUpperCase()
    );
  }, [selectedSupplier, products]);

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      {/* Header Panel Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          Gestão de Fornecedores
        </h1>
        <div>
          <Button
            onClick={handleOpenAdd}
            className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium shadow-none"
          >
            <Plus className="size-4" />
            <span>Adicionar Fornecedor</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Fornecedores Cadastrados
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && supplierList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        A carregar fornecedores...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : supplierList.length > 0 ? (
                supplierList.map((sup) => (
                  <tr
                    key={sup.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {sup.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          sup.status === "Ativo"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(sup)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                          title="Visualizar"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sup)}
                          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(sup)}
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
                  <td colSpan={3} className="px-6 py-24 text-center">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Sem fornecedores disponíveis
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Add / Edit Modal */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <form
            onSubmit={activeModal === "add" ? handleSaveAdd : handleSaveEdit}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                {activeModal === "add" ? "Adicionar Fornecedor" : "Editar Fornecedor"}
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Nome do Fornecedor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: COUTALE"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-950"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
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
                type="submit"
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm font-medium shadow-none"
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {activeModal === "view" && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Detalhes do Fornecedor
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Nome
                  </span>
                  <span className="text-base font-bold text-slate-850 dark:text-slate-100">
                    {selectedSupplier.name}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      selectedSupplier.status === "Ativo"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                    }`}
                  >
                    {selectedSupplier.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 my-1" />

              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Produtos Associados ({selectedSupplierProducts.length})
                </span>
                {selectedSupplierProducts.length > 0 ? (
                  <div className="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
                    {selectedSupplierProducts.map((prod) => (
                      <div key={prod.id} className="p-3 flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {prod.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">
                          Qtd: {prod.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-450 italic">
                    Nenhum produto cadastrado para este fornecedor.
                  </span>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm font-medium shadow-none"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {activeModal === "delete" && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
                <AlertTriangle className="size-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Eliminar Fornecedor
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tem a certeza que deseja eliminar o fornecedor{" "}
                  <strong className="text-slate-800 dark:text-slate-100 font-bold">
                    {selectedSupplier.name}
                  </strong>
                  ? Esta ação não pode ser desfeita.
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
