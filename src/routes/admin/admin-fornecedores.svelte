<script>
  import { getProducts } from "@/lib/utils/stock-api";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { createCrudModal } from "@/lib/state/crud-modal.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import FormField from "@/lib/components/ui/form-field.svelte";
  import FormSelectField from "@/lib/components/ui/form-select-field.svelte";
  import PageCard from "@/lib/components/ui/page-card.svelte";
  import DataTable from "@/lib/components/ui/data-table.svelte";
  import StatusBadge from "@/lib/components/ui/status-badge.svelte";
  import RowActions from "@/lib/components/ui/row-actions.svelte";
  import AdminModal from "@/lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "@/lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "@/lib/components/ui/detail-grid.svelte";

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);

  let supplierList = $state([
    { id: 1, name: "DELTAPLUS", status: "Ativo" },
    { id: 2, name: "COUTALE", status: "Ativo" },
    { id: 3, name: "SOLS", status: "Ativo" },
    { id: 4, name: "ORIENTE", status: "Ativo" },
  ]);

  let crud = createCrudModal();
  let formName = $state("");
  let formStatus = $state("Ativo");
  let initialized = $state(false);

  $effect(() => {
    if (!initialized && productsStore.data && productsStore.data.length > 0) {
      initialized = true;
      const list = new Set(["DELTAPLUS", "COUTALE", "SOLS", "ORIENTE"]);
      productsStore.data.forEach((p) => { if (p.type) list.add(p.type.toUpperCase()); });
      supplierList = Array.from(list).map((name, index) => ({ id: index + 1, name, status: "Ativo" }));
    }
  });

  function handleOpenAdd() { formName = ""; formStatus = "Ativo"; crud.openAdd(); }
  function handleOpenEdit(sup) { formName = sup.name; formStatus = sup.status; crud.openEdit(sup); }

  function handleSave(e) {
    e.preventDefault();
    if (!formName.trim()) { toast.error("O nome do fornecedor é obrigatório."); return; }
    const updated = { id: Date.now(), name: formName.trim().toUpperCase(), status: formStatus };
    if (crud.isAdd) {
      supplierList = [updated, ...supplierList];
      toast.success("Fornecedor adicionado com sucesso.");
    } else if (crud.selected) {
      supplierList = supplierList.map((s) => s.id === crud.selected.id ? { ...s, name: formName.trim().toUpperCase(), status: formStatus } : s);
      toast.success("Fornecedor atualizado com sucesso.");
    }
    crud.close();
  }

  function handleDelete() {
    if (!crud.selected) return;
    supplierList = supplierList.filter((s) => s.id !== crud.selected.id);
    toast.success("Fornecedor removido com sucesso."); crud.close();
  }

  let selectedProducts = $derived(
    crud.selected ? (productsStore.data || []).filter((p) => p.type?.toUpperCase() === crud.selected.name.toUpperCase()) : []
  );

  let filteredSuppliers = $derived(
    searchQuery
      ? supplierList.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : supplierList
  );

  const columns = [
    { key: "name", header: "Fornecedor", render: (r) => `<span class="font-semibold">${r.name}</span>`, className: "w-1/3" },
    { key: "status", header: "Status", className: "w-1/3 text-center", headerClassName: "text-center" },
    { key: "actions", header: "Ações", className: "w-1/3 text-right", headerClassName: "text-right" },
  ];
</script>

<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
  <PageCard class="p-6 flex flex-col gap-4 shrink-0">
    <h1 class="text-lg font-bold text-slate-800 dark:text-white">Gestão de Fornecedores</h1>
    <Button onclick={handleOpenAdd} class="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none w-fit">
      <Plus class="size-4" /><span>Adicionar Fornecedor</span>
    </Button>
  </PageCard>

  <DataTable columns={columns} data={filteredSuppliers} isLoading={productsStore.isLoading && supplierList.length === 0}
    loadingMessage="A carregar fornecedores..." emptyMessage="Sem fornecedores disponíveis." rowKey={(r) => r.id}>
    {#snippet cell(row, col)}
      {#if col.key === "status"}
        <StatusBadge status={row.status} />
      {:else if col.key === "actions"}
        <RowActions
          onView={() => crud.openView(row)}
          onEdit={() => handleOpenEdit(row)}
          onDelete={() => crud.openDelete(row)}
        />
      {:else if col.render}
        {@html col.render(row)}
      {/if}
    {/snippet}
  </DataTable>

  {#if crud.isAdd || crud.isEdit}
    <AdminModal open onClose={crud.close} title={crud.isAdd ? "Adicionar Fornecedor" : "Editar Fornecedor"}>
      {#snippet footer()}
        <Button variant="outline" onclick={crud.close} class="h-10 px-4">Cancelar</Button>
        <Button type="submit" form="sup-form" class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button>
      {/snippet}
      <form id="sup-form" onsubmit={handleSave} class="flex flex-col gap-4">
        <FormField label="Nome do Fornecedor" for="sup-name">
          <Input id="sup-name" required placeholder="Ex: COUTALE" bind:value={formName} />
        </FormField>
        <FormSelectField label="Status" id="sup-status" bind:value={formStatus}
          options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
      </form>
    </AdminModal>
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes do Fornecedor">
      {#snippet footer()}
        <Button onclick={crud.close} class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>
      {/snippet}
      <DetailGrid items={[
        { label: "Nome", value: crud.selected.name },
        { label: "Status", value: crud.selected.status },
      ]} />
      <div class="border-t border-slate-100 dark:border-slate-800/60 my-3"></div>
      <div>
        <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Produtos Associados ({selectedProducts.length})</span>
        {#if selectedProducts.length > 0}
          <div class="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
            {#each selectedProducts as prod (prod.id)}
              <div class="p-3 flex items-center justify-between text-sm">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{prod.name}</span>
                  <span class="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                </div>
                <span class="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">Qtd: {prod.quantity}</span>
              </div>
            {/each}
          </div>
        {:else}
          <span class="text-sm text-slate-450 italic">Nenhum produto cadastrado para este fornecedor.</span>
        {/if}
      </div>
    </AdminModal>
  {/if}

  <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDelete}
    title="Eliminar Fornecedor" itemName={crud.selected?.name || ""} />
</div>
