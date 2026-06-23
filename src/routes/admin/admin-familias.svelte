<script>
  import { getFamiliesPaginated, getProducts, createFamily, updateFamily, deleteFamily } from "@/lib/utils/stock-api";
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
  import { getNumberParam, writeSearchParams } from "@/lib/utils/url-sync.svelte";

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);

  let crud = createCrudModal();
  let form = $state({ name: "", status: "1" });

  // --- Server-side pagination ---
  let serverFamilies = $state([]);
  let serverTotal = $state(0);
  let serverPage = $state(getNumberParam("page", 1));
  let serverSize = $state(getNumberParam("size", 25));
  let serverLoading = $state(false);

  async function doFetch(page, size) {
    serverLoading = true;
    try {
      const result = await getFamiliesPaginated({
        page,
        limit: size,
        search: searchQuery || undefined,
      });
      serverFamilies = result.families;
      serverTotal = result.total;
      serverPage = page;
    } catch {
      serverFamilies = [];
      serverTotal = 0;
    } finally {
      serverLoading = false;
    }
  }

  $effect(() => {
    searchQuery;
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

  function refetchFamilies() { doFetch(serverPage, serverSize); }

  function handleOpenAdd() { form = { name: "", status: "1" }; crud.openAdd(); }
  function handleOpenEdit(fam) { form = { name: fam.name, status: fam.status.toString() }; crud.openEdit(fam); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("O nome da família é obrigatório."); return; }
    try {
      if (crud.isAdd) {
        await createFamily({ name: form.name.trim().toUpperCase(), status: parseInt(form.status) });
      } else if (crud.selected) {
        await updateFamily(crud.selected.id, { name: form.name.trim().toUpperCase(), status: parseInt(form.status) });
      }
      refetchFamilies();
      toast.success(crud.isAdd ? "Família adicionada com sucesso." : "Família atualizada com sucesso.");
      crud.close();
    } catch {
      toast.error("Erro ao guardar família.");
    }
  }

  async function handleDelete() {
    if (!crud.selected) return;
    try {
      await deleteFamily(crud.selected.id);
      refetchFamilies();
      toast.success("Família removida com sucesso.");
      crud.close();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao eliminar família.");
    }
  }

  let familyProducts = $derived(
    crud.selected ? (productsStore.data || []).filter((p) => p.familyId === crud.selected.id || p.family?.name.toUpperCase() === crud.selected.name.toUpperCase()) : []
  );

  let productCountsByFamily = $derived.by(() => {
    const counts = {};
    (productsStore.data || []).forEach((p) => {
      const famName = p.family?.name || "Sem Família";
      counts[famName.toUpperCase()] = (counts[famName.toUpperCase()] || 0) + 1;
    });
    return counts;
  });

  const columns = [
    { key: "name", header: "Nome da Família", render: (r) => `<span class="font-semibold">${r.name}</span>`, className: "w-1/4" },
    { key: "products", header: "Produtos Associados", className: "w-1/4 text-center", headerClassName: "text-center" },
    { key: "status", header: "Status", className: "w-1/4 text-center", headerClassName: "text-center" },
    { key: "acoes", header: "Ações", className: "w-1/4 text-right", headerClassName: "text-right" },
  ];
</script>

<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
  <PageCard class="p-6 flex flex-col gap-4 shrink-0">
    <h1 class="text-lg font-bold text-slate-800 dark:text-white">Gestão de Famílias de Produtos</h1>
    <Button onclick={handleOpenAdd} class="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none w-fit">
      <Plus class="size-4" /><span>Adicionar Família</span>
    </Button>
  </PageCard>

  <DataTable columns={columns} data={serverFamilies} isLoading={serverLoading}
    loadingMessage="A carregar famílias..." emptyMessage="Sem famílias disponíveis." rowKey={(r) => r.id}
    totalRows={serverTotal} bind:page={serverPage} bind:size={serverSize} onPageChange={handlePageChange}>
    {#snippet cell(row, col)}
      {#if col.key === "products"}
        <span class="text-center font-medium">{productCountsByFamily[row.name.toUpperCase()] || 0}</span>
      {:else if col.key === "status"}
        <StatusBadge status={row.status === 1 ? "Ativo" : "Inativo"} />
      {:else if col.key === "acoes"}
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
    <AdminModal open onClose={crud.close} title={crud.isAdd ? "Adicionar Família" : "Editar Família"}>
      {#snippet footer()}
        <Button variant="outline" onclick={crud.close} class="h-10 px-4">Cancelar</Button>
        <Button type="submit" form="fam-form" class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button>
      {/snippet}
      <form id="fam-form" onsubmit={handleSave} class="flex flex-col gap-4">
        <FormField label="Nome da Família" for="fam-name">
          <Input id="fam-name" required placeholder="Ex: TEXTIL" bind:value={form.name} />
        </FormField>
        <FormSelectField label="Status" id="fam-status" bind:value={form.status}
          options={[{ value: "1", label: "Ativo" }, { value: "0", label: "Inativo" }]} />
      </form>
    </AdminModal>
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes da Família">
      {#snippet footer()}
        <Button onclick={crud.close} class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>
      {/snippet}
      <DetailGrid items={[
        { label: "Nome da Família", value: crud.selected.name },
        { label: "Status", value: crud.selected.status === 1 ? "Ativo" : "Inativo" },
      ]} />
      <div class="border-t border-slate-100 dark:border-slate-800/60 my-3"></div>
      <div>
        <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Produtos Associados ({familyProducts.length})
        </span>
        {#if familyProducts.length > 0}
          <div class="max-h-[200px] overflow-y-auto border border-slate-150 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
            {#each familyProducts as prod (prod.id)}
              <div class="p-3 flex items-center justify-between text-sm">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{prod.name}</span>
                  <span class="text-xs text-slate-400 font-mono">Ref: {prod.ref}</span>
                </div>
                <span class="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">Stock: {prod.quantity}</span>
              </div>
            {/each}
          </div>
        {:else}
          <span class="text-sm text-slate-450 italic">Nenhum produto cadastrado nesta família.</span>
        {/if}
      </div>
    </AdminModal>
  {/if}

  <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDelete}
    title="Eliminar Família" itemName={crud.selected?.name || ""} />
</div>
