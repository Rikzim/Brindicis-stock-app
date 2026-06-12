import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFamilies, getProducts } from "@/lib/stock-api";
import { Plus, Loader2, Pencil, Trash2, Eye, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StockFamily } from "@/lib/stock-types";

export function AdminFamilias() {
  const queryClient = useQueryClient();

  // Fetch families
  const { data: families = [], isLoading: loadingFamilies } = useQuery({
    queryKey: ["stock-families"],
    queryFn: getFamilies,
    refetchOnWindowFocus: false,
  });

  // Fetch products to associate count & list in view
  const { data: products = [] } = useQuery({
    queryKey: ["stock-products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  // Modals state
  const [activeModal, setActiveModal] = useState<"add" | "view" | "edit" | "delete" | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<StockFamily | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("1"); // 1 = Ativo, 0 = Inativo

  // Handlers
  const handleOpenAdd = () => {
    setFormName("");
    setFormStatus("1");
    setActiveModal("add");
  };

  const handleOpenView = (fam: StockFamily) => {
    setSelectedFamily(fam);
    setActiveModal("view");
  };

  const handleOpenEdit = (fam: StockFamily) => {
    setSelectedFamily(fam);
    setFormName(fam.name);
    setFormStatus(fam.status.toString());
    setActiveModal("edit");
  };

  const handleOpenDelete = (fam: StockFamily) => {
    setSelectedFamily(fam);
    setActiveModal("delete");
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("O nome da família é obrigatório.");
      return;
    }
    const newFam: StockFamily = {
      id: Date.now(),
      name: formName.trim().toUpperCase(),
      status: parseInt(formStatus),
    };

    queryClient.setQueryData<StockFamily[]>(["stock-families"], (old = []) => [
      newFam,
      ...old,
    ]);
    toast.success("Família adicionada com sucesso.");
    setActiveModal(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFamily) return;
    if (!formName.trim()) {
      toast.error("O nome da família é obrigatório.");
      return;
    }

    queryClient.setQueryData<StockFamily[]>(["stock-families"], (old = []) =>
      old.map((f) =>
        f.id === selectedFamily.id
          ? { ...f, name: formName.trim().toUpperCase(), status: parseInt(formStatus) }
          : f
      )
    );
    toast.success("Família atualizada com sucesso.");
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFamily) return;
    queryClient.setQueryData<StockFamily[]>(["stock-families"], (old = []) =>
      old.filter((f) => f.id !== selectedFamily.id)
    );
    toast.success("Família removida com sucesso.");
    setActiveModal(null);
  };

  // Associated products list & count
  const familyProducts = useMemo(() => {
    if (!selectedFamily) return [];
    return products.filter((p) => p.familyId === selectedFamily.id || p.family?.name.toUpperCase() === selectedFamily.name.toUpperCase());
  }, [selectedFamily, products]);

  const productCountsByFamily = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const famName = p.family?.name || "Sem Família";
      counts[famName.toUpperCase()] = (counts[famName.toUpperCase()] || 0) + 1;
    });
    return counts;
  }, [products]);

  const isLoading = loadingFamilies;

  return (
    <div className="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
      {/* Header Panel Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 shrink-0">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          Gestão de Famílias de Produtos
        </h1>
        <div>
          <Button
            onClick={handleOpenAdd}
            className="h-10 bg-[#1D58F6] text-white hover:bg-blue-700 px-5 rounded-lg flex items-center gap-2 cursor-pointer font-medium shadow-none"
          >
            <Plus className="size-4" />
            <span>Adicionar Família</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Famílias Cadastradas
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950/20 dark:border-slate-800/80">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                  Nome da Família
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 text-center">
                  Produtos Associados
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
              {isLoading && families.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        A carregar famílias...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : families.length > 0 ? (
                families.map((fam) => {
                  const prodCount = productCountsByFamily[fam.name.toUpperCase()] || 0;
                  return (
                    <tr
                      key={fam.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 dark:border-slate-800/80 dark:hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {fam.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-650 dark:text-slate-350 text-center font-medium">
                        {prodCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                            fam.status === 1
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                          }`}
                        >
                          {fam.status === 1 ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenView(fam)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                            title="Visualizar"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(fam)}
                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(fam)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
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
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Sem famílias disponíveis
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
                {activeModal === "add" ? "Adicionar Família" : "Editar Família"}
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
                  Nome da Família
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TEXTIL"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                  <option value="1">Ativo</option>
                  <option value="0">Inativo</option>
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
      {activeModal === "view" && selectedFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Detalhes da Família
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
                    Nome da Família
                  </span>
                  <span className="text-base font-bold text-slate-850 dark:text-slate-100">
                    {selectedFamily.name}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      selectedFamily.status === 1
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-850/40 dark:text-slate-400"
                    }`}
                  >
                    {selectedFamily.status === 1 ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 my-1" />

              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Produtos Associados ({familyProducts.length})
                </span>
                {familyProducts.length > 0 ? (
                  <div className="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
                    {familyProducts.map((prod) => (
                      <div key={prod.id} className="p-3 flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {prod.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">
                          Stock: {prod.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-450 italic">
                    Nenhum produto cadastrado nesta família.
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
      {activeModal === "delete" && selectedFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
                <AlertTriangle className="size-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Eliminar Família
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tem a certeza que deseja eliminar a família{" "}
                  <strong className="text-slate-800 dark:text-slate-100 font-bold">
                    {selectedFamily.name}
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
