<script>
  import { getProducts, getProductsPaginated, getFamilies } from "@/lib/utils/stock-api";
  import { Plus, Download } from "lucide-svelte";
  import { apiClient } from "@/lib/utils/api-client";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { createCrudModal } from "@/lib/state/crud-modal.svelte";
  import AuthedImage from "@/lib/components/ui/authed-image.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import FormField from "@/lib/components/ui/form-field.svelte";
  import FilterSelectField from "@/lib/components/ui/filter-select-field.svelte";
  import PageCard from "@/lib/components/ui/page-card.svelte";
  import DataTable from "@/lib/components/ui/data-table.svelte";
  import StatusBadge from "@/lib/components/ui/status-badge.svelte";
  import RowActions from "@/lib/components/ui/row-actions.svelte";
  import AdminModal from "@/lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "@/lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "@/lib/components/ui/detail-grid.svelte";
  import AddProductModal from "@/lib/components/stock/add-product-modal.svelte";
  import { getStringParam, getNumberParam, writeSearchParams } from "@/lib/utils/url-sync.svelte";

  async function downloadExport(url) {
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

  const allProductsStore = createAsyncStore(getProducts);
  const familiesStore = createAsyncStore(getFamilies);

  let { searchQuery = "" } = $props();

  let crud = createCrudModal();
  let showAddModal = $state(false);
  let editFullProduct = $state(null);
  let filters = $state({
    selectedFornecedor: getStringParam("fornecedor", "Todas"),
    selectedFamilia: getStringParam("familia", "Todas"),
    selectedDisponibilidade: getStringParam("disponibilidade", "Todos"),
    selectedEstado: getStringParam("estado", "Todos"),
    searchCaixa: getStringParam("caixa"),
    searchGaveta: getStringParam("gaveta"),
  });

  let fornecedores = $derived.by(() => {
    const set = new Set(["Todas"]);
    allProductsStore.data?.forEach((p) => { if (p.type) set.add(p.type); });
    return Array.from(set);
  });

  let familyOptions = $derived((familiesStore.data || []).map((f) => ({ value: f.name, label: f.name })));
  let fornecedorOptions = $derived(fornecedores.map((f) => ({ value: f, label: f })));

  const statusFilterOptions = [
    { value: "Todos", label: "Todos" }, { value: "Com Stock", label: "Com Stock" }, { value: "Esgotado", label: "Esgotado" },
  ];
  const activeStatusFilterOptions = [
    { value: "Todos", label: "Todos" }, { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" },
  ];

  // --- Server-side pagination ---

  let serverProducts = $state([]);
  let serverTotal = $state(0);
  let serverPage = $state(getNumberParam("page", 1));
  let serverSize = $state(getNumberParam("size", 50));
  let serverLoading = $state(false);

  function buildQueryParams(page, size) {
    return {
      page,
      limit: size,
      search: searchQuery || undefined,
      fornecedor: filters.selectedFornecedor !== "Todas" ? filters.selectedFornecedor : undefined,
      familia: filters.selectedFamilia !== "Todas" ? filters.selectedFamilia : undefined,
      disponibilidade: filters.selectedDisponibilidade !== "Todos" ? filters.selectedDisponibilidade : undefined,
      estado: filters.selectedEstado !== "Todos" ? filters.selectedEstado : undefined,
      caixa: filters.searchCaixa || undefined,
      gaveta: filters.searchGaveta || undefined,
    };
  }

  async function doFetch(page, size) {
    serverLoading = true;
    try {
      const result = await getProductsPaginated(buildQueryParams(page, size));
      serverProducts = result.products;
      serverTotal = result.total;
      serverPage = page;
    } catch {
      serverProducts = [];
      serverTotal = 0;
    } finally {
      serverLoading = false;
    }
  }

  $effect(() => {
    searchQuery;
    JSON.stringify(filters);
    doFetch(1, serverSize);
  });

  $effect(() => {
    writeSearchParams({
      page: serverPage > 1 ? serverPage : undefined,
      size: serverSize !== 50 ? serverSize : undefined,
      fornecedor: filters.selectedFornecedor !== "Todas" ? filters.selectedFornecedor : undefined,
      familia: filters.selectedFamilia !== "Todas" ? filters.selectedFamilia : undefined,
      disponibilidade: filters.selectedDisponibilidade !== "Todos" ? filters.selectedDisponibilidade : undefined,
      estado: filters.selectedEstado !== "Todos" ? filters.selectedEstado : undefined,
      caixa: filters.searchCaixa || undefined,
      gaveta: filters.searchGaveta || undefined,
    });
  });

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  // --- Row mapping (no client-side filtering — server handles it) ---

  let stockRows = $derived(serverProducts.map((product) => {
    const totalQty = product.variants.reduce((sum, v) => sum + v.quantity, 0);
    const totalReserved = product.variants.reduce((sum, v) => sum + v.reserved, 0);
    const colorList = (product.colors || []).map((c) => c.name).join(", ") || "-";
    const drawerList = [...new Set(product.variants.map((v) => v.drawer).filter(Boolean))].join(", ") || product.drawer || "-";
    const cxList = [...new Set(product.variants.map((v) => v.cx).filter(Boolean))].join(", ") || product.cx || "-";
    return {
      id: product.id, productId: product.id,
      name: product.name, ref: product.ref,
      image: product.images?.[0]?.url || null,
      color: colorList,
      quantity: totalQty,
      reserved: totalReserved,
      drawer: drawerList,
      cx: cxList,
      pvp: product.pvp,
      fornecedor: product.type || "-",
      family: product.family?.name || "-",
      estado: product.active === 1 ? "Ativo" : "Inativo",
    };
  }));

  function handleAdd() { showAddModal = true; }
  function handleView(row) { crud.openView(row); }
  function handleEdit(row) {
    editFullProduct = allProductsStore.data?.find((p) => p.id === row.productId) || null;
    crud.openEdit(row);
  }
  function handleDelete(row) { crud.openDelete(row); }

  function handleDeleteConfirm() {
    toast.success("Produto removido com sucesso."); crud.close();
  }

  function handleMutationSuccess() {
    allProductsStore.refetch();
    doFetch(serverPage, serverSize);
  }

  const columns = [
    { key: "image", header: "Imagem" },
    { key: "ref", header: "Ref", render: (row) => `<span class="font-semibold">${row.ref}</span>` },
    { key: "color", header: "Cor", render: (row) => row.color },
    { key: "qntd", header: "Qntd", render: (row) => row.quantity },
    { key: "qntdR", header: "Qntd R.", render: (row) => row.reserved },
    { key: "gaveta", header: "Gaveta", render: (row) => row.drawer },
    { key: "cx", header: "Cx", render: (row) => row.cx },
    { key: "pvp", header: "Pvp", render: (row) => `${row.pvp.toFixed(2)} €` },
    { key: "fornecedor", header: "Fornecedor", render: (row) => row.fornecedor },
    { key: "estado", header: "Estado" },
    { key: "acoes", header: "Ações", className: "text-right", headerClassName: "text-right" },
  ];
</script>

<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
  <PageCard class="p-6 flex flex-col gap-4 shrink-0">
    <h1 class="text-lg font-bold text-slate-800 dark:text-white">Gestão de Stock</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <FilterSelectField label="Fornecedor" bind:value={filters.selectedFornecedor} options={fornecedorOptions} />
      <FilterSelectField label="Família" bind:value={filters.selectedFamilia} options={[{ value: "Todas", label: "Todas" }, ...familyOptions]} />
      <FilterSelectField label="Disponibilidade" bind:value={filters.selectedDisponibilidade} options={statusFilterOptions} />
      <FilterSelectField label="Estado" bind:value={filters.selectedEstado} options={activeStatusFilterOptions} />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Pesquisar por Caixa (CX)" for="filter-cx">
        <Input id="filter-cx" placeholder="Digite o nome da caixa..." bind:value={filters.searchCaixa} class="h-10" />
      </FormField>
      <FormField label="Pesquisar por Gaveta" for="filter-gaveta">
        <Input id="filter-gaveta" placeholder="Digite o nome da gaveta..." bind:value={filters.searchGaveta} class="h-10" />
      </FormField>
    </div>
    <div class="flex items-center gap-3">
      <Button onclick={handleAdd} class="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none">
        <Plus class="size-4" /><span>Adicionar Produto</span>
      </Button>
      <Button variant="outline" size="sm" class="h-10 gap-1.5" onclick={() => downloadExport("/exports/stock-by-cx")}>
        <Download class="size-4" /><span>Exportar por Caixa</span>
      </Button>
      <Button variant="outline" size="sm" class="h-10 gap-1.5" onclick={() => downloadExport("/exports/products")}>
        <Download class="size-4" /><span>Exportar</span>
      </Button>
    </div>
  </PageCard>

  <DataTable columns={columns} data={stockRows} isLoading={serverLoading}
    loadingMessage="A carregar produtos..." emptyMessage="Nenhum produto encontrado." rowKey={(r) => r.id}
    bind:page={serverPage} bind:size={serverSize} totalRows={serverTotal} onPageChange={handlePageChange}>
    {#snippet cell(row, col)}
      {#if col.key === "image"}
        {#if row.image}
          <AuthedImage path={row.image} width={200} alt={row.name} class="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
        {:else}
          <div class="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">-</div>
        {/if}
      {:else if col.key === "estado"}
        <StatusBadge status={row.estado} />
      {:else if col.key === "acoes"}
        <RowActions
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
        />
      {:else if col.render}
        {@html col.render(row)}
      {/if}
    {/snippet}
  </DataTable>

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes do Produto">
      {#snippet footer()}
        <Button onclick={crud.close} class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>
      {/snippet}
      <div class="col-span-2 flex justify-center mb-2">
        {#if crud.selected.image}
              <AuthedImage path={crud.selected.image} width={200} alt={crud.selected.name} class="size-24 object-contain rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
        {:else}
          <div class="h-24 w-24 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">Sem imagem</div>
        {/if}
      </div>
      <DetailGrid items={[
        { label: "Referência", value: crud.selected.ref }, { label: "Nome", value: crud.selected.name },
        { label: "Cor", value: crud.selected.color }, { label: "Quantidade", value: crud.selected.quantity },
        { label: "Gaveta", value: crud.selected.drawer }, { label: "Cx", value: crud.selected.cx },
        { label: "PVP", value: `${crud.selected.pvp.toFixed(2)} €` }, { label: "Fornecedor", value: crud.selected.fornecedor },
        { label: "Família", value: crud.selected.family }, { label: "Estado", value: crud.selected.estado },
      ]} />
    </AdminModal>
  {/if}

  <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDeleteConfirm}
    title="Eliminar Produto" itemName={crud.selected ? `${crud.selected.ref} - ${crud.selected.name}` : ""} />

  <AddProductModal
    open={showAddModal}
    onClose={() => showAddModal = false}
    onSuccess={handleMutationSuccess}
    {fornecedores}
  />

  <AddProductModal
    open={crud.isEdit}
    editProduct={editFullProduct}
    onClose={() => { editFullProduct = null; crud.close(); }}
    onSuccess={handleMutationSuccess}
    {fornecedores}
  />
</div>
