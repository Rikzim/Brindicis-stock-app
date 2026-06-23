<script lang="ts">
  import {
    getProducts,
    getSuppliersPaginated,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } from "$lib/utils/stock-api";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import { createCrudModal } from "$lib/state/crud-modal.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import FormField from "$lib/components/ui/form-field.svelte";
  import FormSelectField from "$lib/components/ui/form-select-field.svelte";
  import DataTable from "$lib/components/ui/data-table.svelte";
  import StatusBadge from "$lib/components/ui/status-badge.svelte";
  import RowActions from "$lib/components/ui/row-actions.svelte";
  import AdminModal from "$lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "$lib/components/ui/detail-grid.svelte";
  import { getNumberParam, writeSearchParams } from "$lib/utils/url-sync.svelte";

  let { searchQuery: _searchQuery = "" }: { searchQuery?: string } = $props();

  const productsStore = createAsyncStore(getProducts);

  let crud = createCrudModal();
  let formName = $state("");
  let formStatus = $state("Ativo");
  let isSaving = $state(false);

  type SupplierRow = { name: string; status: string };
  let serverSuppliers = $state<SupplierRow[]>([]);
  let serverTotal = $state(0);
  let serverPage = $state(getNumberParam("page", 1));
  let serverSize = $state(getNumberParam("size", 25));
  let serverLoading = $state(false);

  async function doFetch(page, size) {
    serverLoading = true;
    try {
      const result = await getSuppliersPaginated(page, size);
      serverSuppliers = result.suppliers.map((name) => ({ name, status: "Ativo" }));
      serverTotal = result.total;
      serverPage = page;
    } catch {
      serverSuppliers = [];
      serverTotal = 0;
    } finally {
      serverLoading = false;
    }
  }

  $effect(() => {
    doFetch(1, serverSize);
  });

  $effect(() => {
    writeSearchParams({
      page: serverPage > 1 ? serverPage : undefined,
      size: serverSize !== 25 ? serverSize : undefined,
    });
  });

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  function refetchSuppliers() {
    doFetch(serverPage, serverSize);
  }

  function handleOpenAdd() {
    formName = "";
    formStatus = "Ativo";
    crud.openAdd();
  }
  function handleOpenEdit(sup) {
    formName = sup.name;
    formStatus = sup.status;
    crud.openEdit(sup);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("O nome do fornecedor é obrigatório.");
      return;
    }
    const name = formName.trim().toUpperCase();
    isSaving = true;
    try {
      if (crud.isAdd) {
        await createSupplier({ name, status: formStatus === "Ativo" ? 1 : 0 });
        toast.success("Fornecedor adicionado com sucesso.");
      } else if (crud.selected?.name) {
        await updateSupplier(crud.selected.name, {
          name,
          status: formStatus === "Ativo" ? 1 : 0,
        });
        toast.success("Fornecedor atualizado com sucesso.");
      }
      refetchSuppliers();
      crud.close();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao guardar fornecedor.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      isSaving = false;
    }
  }

  async function handleDelete() {
    if (!crud.selected?.name) return;
    try {
      await deleteSupplier(crud.selected.name);
      toast.success("Fornecedor removido com sucesso.");
      crud.close();
      refetchSuppliers();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao eliminar fornecedor.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  }

  let selectedProducts = $derived.by(() => {
    const name = crud.selected?.name;
    if (!name) return [];
    return (productsStore.data || []).filter((p) => p.type?.toUpperCase() === name.toUpperCase());
  });

  const columns = [
    { key: "name", header: "Fornecedor", className: "w-1/3" },
    {
      key: "status",
      header: "Status",
      className: "w-1/3 text-center",
      headerClassName: "text-center",
    },
    {
      key: "actions",
      header: "Ações",
      className: "w-1/3 text-right",
      headerClassName: "text-right",
    },
  ];
</script>

<div
  class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative p-3 sm:p-0"
>
  <div
    class="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700 shrink-0"
  >
    <h1 class="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
      Gestão de Fornecedores
    </h1>
    <Button
      onclick={handleOpenAdd}
      class="h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs"
    >
      <Plus class="size-3.5" /><span>Adicionar Fornecedor</span>
    </Button>
  </div>

  <DataTable
    {columns}
    data={serverSuppliers}
    isLoading={serverLoading}
    loadingMessage="A carregar fornecedores..."
    emptyMessage="Sem fornecedores disponíveis."
    rowKey={(r) => r.name}
    totalRows={serverTotal}
    bind:page={serverPage}
    bind:size={serverSize}
    pageSizeOptions={[10, 25, 50]}
    onPageChange={handlePageChange}
  >
    {#snippet cell(row, col)}
      {#if col.key === "name"}
        <span class="font-semibold">{row.name}</span>
      {:else if col.key === "status"}
        <StatusBadge status={row.status} />
      {:else if col.key === "actions"}
        <RowActions
          onView={() => crud.openView(row)}
          onEdit={() => handleOpenEdit(row)}
          onDelete={() => crud.openDelete(row)}
        />
      {/if}
    {/snippet}
  </DataTable>

  {#if crud.isAdd || crud.isEdit}
    <AdminModal
      open
      onClose={crud.close}
      title={crud.isAdd ? "Adicionar Fornecedor" : "Editar Fornecedor"}
    >
      {#snippet footer()}
        <Button variant="outline" onclick={crud.close} disabled={isSaving} class="h-10 px-4"
          >Cancelar</Button
        >
        <Button
          type="submit"
          form="sup-form"
          disabled={isSaving}
          class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold"
          >Salvar</Button
        >
      {/snippet}
      <form id="sup-form" onsubmit={handleSave} class="flex flex-col gap-4">
        <FormField label="Nome do Fornecedor" for="sup-name">
          <Input id="sup-name" required placeholder="Ex: COUTALE" bind:value={formName} />
        </FormField>
        <FormSelectField
          label="Status"
          id="sup-status"
          bind:value={formStatus}
          options={[
            { value: "Ativo", label: "Ativo" },
            { value: "Inativo", label: "Inativo" },
          ]}
        />
      </form>
    </AdminModal>
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes do Fornecedor">
      {#snippet footer()}
        <Button
          onclick={crud.close}
          class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold"
          >Fechar</Button
        >
      {/snippet}
      <DetailGrid
        items={[
          { label: "Nome", value: crud.selected.name },
          { label: "Status", value: crud.selected.status },
        ]}
      />
      <div class="border-t border-slate-100 dark:border-slate-800/60 my-3"></div>
      <div>
        <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
          >Produtos Associados ({selectedProducts.length})</span
        >
        {#if selectedProducts.length > 0}
          <div
            class="max-h-[200px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40"
          >
            {#each selectedProducts as prod (prod.id)}
              <div class="p-3 flex items-center justify-between text-sm">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{prod.name}</span>
                  <span class="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                </div>
                <span
                  class="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded"
                  >Qtd: {prod.quantity}</span
                >
              </div>
            {/each}
          </div>
        {:else}
          <span class="text-sm text-slate-500 italic"
            >Nenhum produto cadastrado para este fornecedor.</span
          >
        {/if}
      </div>
    </AdminModal>
  {/if}

  <ConfirmDeleteModal
    open={crud.isDelete}
    onClose={crud.close}
    onConfirm={handleDelete}
    title="Eliminar Fornecedor"
    itemName={crud.selected?.name || ""}
  />
</div>
