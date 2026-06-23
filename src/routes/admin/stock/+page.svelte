<script lang="ts">
  import {
    getProducts,
    getProductsPaginated,
    getFamilies,
    deleteProduct,
  } from "$lib/utils/stock-api";
  import type { ProductStock } from "$lib/utils/stock-types";
  import { Plus, Download } from "lucide-svelte";
  import { apiClient } from "$lib/utils/api-client";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import { createCrudModal } from "$lib/state/crud-modal.svelte";
  import AuthedImage from "$lib/components/ui/authed-image.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import MultiSearchableSelect from "$lib/components/ui/multi-searchable-select.svelte";
  import AdminFiltersDrawer from "$lib/components/admin/admin-filters-drawer.svelte";
  import DataTable from "$lib/components/ui/data-table.svelte";
  import StatusBadge from "$lib/components/ui/status-badge.svelte";
  import RowActions from "$lib/components/ui/row-actions.svelte";
  import AdminModal from "$lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "$lib/components/ui/detail-grid.svelte";
  import AddProductModal from "$lib/components/stock/add-product-modal.svelte";
  import { getStringParam, getNumberParam, writeSearchParams } from "$lib/utils/url-sync.svelte";
  import { createDebounced } from "$lib/utils/debounce.svelte";

  async function downloadExport(url) {
    try {
      const response = await apiClient.get(url, { responseType: "blob" });
      const disposition = response.headers["content-disposition"];
      const match = disposition?.match(/filename="?(.+?)"?$/);
      const filename = match ? match[1] : `export-${Date.now()}.xlsx`;
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
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
  let editFullProduct = $state<any>(null);

  const defaultFilters = () => ({
    fornecedor: getStringParam("fornecedor", ""),
    familia: getStringParam("familia", ""),
    disponibilidade: getStringParam("disponibilidade", "Todos"),
    estado: getStringParam("estado", "Todos"),
    caixa: getStringParam("caixa") || "",
    gaveta: getStringParam("gaveta") || "",
  });

  let appliedFilters = $state(defaultFilters());
  let pendingFilters = $state(defaultFilters());

  let fornecedores = $derived.by<string[]>(() => {
    const set = new Set<string>();
    allProductsStore.data?.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return Array.from(set);
  });

  let familyOptions = $derived(
    (familiesStore.data || []).map((f) => ({ value: f.name, label: f.name }))
  );
  let fornecedorOptions = $derived(fornecedores.map((f) => ({ value: f, label: f })));

  const statusFilterOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Com Stock", label: "Com Stock" },
    { value: "Esgotado", label: "Esgotado" },
  ];
  const activeStatusFilterOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Ativo", label: "Ativo" },
    { value: "Inativo", label: "Inativo" },
  ];

  // --- Server-side pagination ---

  let serverProducts = $state<ProductStock[]>([]);
  let serverTotal = $state(0);
  let serverPage = $state(getNumberParam("page", 1));
  let serverSize = $state(getNumberParam("size", 50));
  let serverLoading = $state(false);

  function buildQueryParams(page, size) {
    return {
      page,
      limit: size,
      search: searchQuery || undefined,
      fornecedor: appliedFilters.fornecedor ? appliedFilters.fornecedor.split(",") : undefined,
      familia: appliedFilters.familia ? appliedFilters.familia.split(",") : undefined,
      disponibilidade:
        appliedFilters.disponibilidade !== "Todos" ? appliedFilters.disponibilidade : undefined,
      estado: appliedFilters.estado !== "Todos" ? appliedFilters.estado : undefined,
      caixa: appliedFilters.caixa || undefined,
      gaveta: appliedFilters.gaveta || undefined,
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

  const debouncedSearch = createDebounced(() => searchQuery, 300);

  $effect(() => {
    debouncedSearch.current;
    appliedFilters.fornecedor;
    appliedFilters.familia;
    appliedFilters.disponibilidade;
    appliedFilters.estado;
    appliedFilters.caixa;
    appliedFilters.gaveta;
    doFetch(1, serverSize);
  });

  $effect(() => {
    writeSearchParams({
      page: serverPage > 1 ? serverPage : undefined,
      size: serverSize !== 50 ? serverSize : undefined,
      fornecedor: appliedFilters.fornecedor || undefined,
      familia: appliedFilters.familia || undefined,
      disponibilidade:
        appliedFilters.disponibilidade !== "Todos" ? appliedFilters.disponibilidade : undefined,
      estado: appliedFilters.estado !== "Todos" ? appliedFilters.estado : undefined,
      caixa: appliedFilters.caixa || undefined,
      gaveta: appliedFilters.gaveta || undefined,
    });
  });

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  // --- Row mapping (no client-side filtering — server handles it) ---

  let stockRows = $derived(
    serverProducts.map((product) => {
      const totalQty = product.variants.reduce((sum, v) => sum + v.quantity, 0);
      const totalReserved = product.variants.reduce((sum, v) => sum + v.reserved, 0);
      const colorList = (product.colors || []).map((c) => c.name).join(", ") || "-";
      const drawerList =
        [...new Set(product.variants.map((v) => v.drawer).filter(Boolean))].join(", ") ||
        product.drawer ||
        "-";
      const cxList =
        [...new Set(product.variants.map((v) => v.cx).filter(Boolean))].join(", ") ||
        product.cx ||
        "-";
      return {
        id: product.id,
        productId: product.id,
        name: product.name,
        ref: product.ref,
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
    })
  );

  function handleAdd() {
    showAddModal = true;
  }
  function handleView(row) {
    crud.openView(row);
  }
  function handleEdit(row) {
    editFullProduct = allProductsStore.data?.find((p) => p.id === row.productId) || null;
    crud.openEdit(row);
  }
  function handleDelete(row) {
    crud.openDelete(row);
  }

  async function handleDeleteConfirm() {
    if (!crud.selected) return;
    try {
      await deleteProduct(crud.selected.productId);
      toast.success("Produto removido com sucesso.");
      crud.close();
      handleMutationSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao eliminar produto.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  }

  function handleMutationSuccess() {
    allProductsStore.refetch();
    doFetch(serverPage, serverSize);
  }

  function countActive(f) {
    return (
      (f.fornecedor ? 1 : 0) +
      (f.familia ? 1 : 0) +
      (f.disponibilidade !== "Todos" ? 1 : 0) +
      (f.estado !== "Todos" ? 1 : 0)
    );
  }

  let activeFilterCount = $derived(countActive(appliedFilters));
  let hasPendingChanges = $derived(
    pendingFilters.fornecedor !== appliedFilters.fornecedor ||
      pendingFilters.familia !== appliedFilters.familia ||
      pendingFilters.disponibilidade !== appliedFilters.disponibilidade ||
      pendingFilters.estado !== appliedFilters.estado ||
      pendingFilters.caixa !== appliedFilters.caixa ||
      pendingFilters.gaveta !== appliedFilters.gaveta
  );

  function syncPendingToApplied() {
    appliedFilters.fornecedor = pendingFilters.fornecedor;
    appliedFilters.familia = pendingFilters.familia;
    appliedFilters.disponibilidade = pendingFilters.disponibilidade;
    appliedFilters.estado = pendingFilters.estado;
    appliedFilters.caixa = pendingFilters.caixa;
    appliedFilters.gaveta = pendingFilters.gaveta;
  }

  function applyFilters() {
    syncPendingToApplied();
  }

  function clearAll() {
    pendingFilters.fornecedor = "";
    pendingFilters.familia = "";
    pendingFilters.disponibilidade = "Todos";
    pendingFilters.estado = "Todos";
    pendingFilters.caixa = "";
    pendingFilters.gaveta = "";
    applyFilters();
  }

  const columns = [
    { key: "image", header: "Imagem" },
    { key: "ref", header: "Ref" },
    { key: "color", header: "Cor" },
    { key: "qntd", header: "Qntd" },
    { key: "qntdR", header: "Qntd R." },
    { key: "gaveta", header: "Gaveta" },
    { key: "cx", header: "Cx" },
    { key: "pvp", header: "Pvp" },
    { key: "fornecedor", header: "Fornecedor" },
    { key: "estado", header: "Estado" },
    { key: "acoes", header: "Ações", className: "text-right", headerClassName: "text-right" },
  ];
</script>

<div
  class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative p-3 sm:p-0"
>
  <AdminFiltersDrawer
    title="Gestão de Stock"
    activeCount={activeFilterCount}
    {hasPendingChanges}
    onApply={applyFilters}
    onClear={clearAll}
  >
    {#snippet children()}
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1.5 sm:gap-2">
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
            >Fornecedor</span
          >
          <MultiSearchableSelect
            bind:value={pendingFilters.fornecedor}
            options={fornecedorOptions}
            placeholder="Todos"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhum encontrado."
            class="h-8"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Família</span>
          <MultiSearchableSelect
            bind:value={pendingFilters.familia}
            options={familyOptions}
            placeholder="Todas"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhuma encontrada."
            class="h-8"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
            >Disponibilidade</span
          >
          <SearchableSelect
            bind:value={pendingFilters.disponibilidade}
            options={statusFilterOptions}
            placeholder="Todos"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhuma opção."
            class="h-8"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</span>
          <SearchableSelect
            bind:value={pendingFilters.estado}
            options={activeStatusFilterOptions}
            placeholder="Todos"
            searchPlaceholder="Procurar..."
            emptyMessage="Nenhuma opção."
            class="h-8"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
            >Caixa (CX)</span
          >
          <Input
            placeholder="Digite o nome da caixa..."
            bind:value={pendingFilters.caixa}
            class="h-8 text-sm"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gaveta</span>
          <Input
            placeholder="Digite o nome da gaveta..."
            bind:value={pendingFilters.gaveta}
            class="h-8 text-sm"
          />
        </div>
      </div>
    {/snippet}
  </AdminFiltersDrawer>

  <div class="flex flex-wrap items-center gap-2">
    <Button
      onclick={handleAdd}
      class="h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs"
    >
      <Plus class="size-3.5" /><span>Adicionar Produto</span>
    </Button>
    <Button
      variant="outline"
      size="sm"
      class="h-8 gap-1 text-xs"
      onclick={() => downloadExport("/exports/stock-by-cx")}
    >
      <Download class="size-3.5" /><span class="hidden sm:inline">Exportar por Caixa</span><span
        class="sm:hidden">Por Caixa</span
      >
    </Button>
    <Button
      variant="outline"
      size="sm"
      class="h-8 gap-1 text-xs"
      onclick={() => downloadExport("/exports/products")}
    >
      <Download class="size-3.5" /><span>Exportar</span>
    </Button>
  </div>

  <DataTable
    {columns}
    data={stockRows}
    isLoading={serverLoading}
    loadingMessage="A carregar produtos..."
    emptyMessage="Nenhum produto encontrado."
    rowKey={(r) => r.id}
    bind:page={serverPage}
    bind:size={serverSize}
    totalRows={serverTotal}
    onPageChange={handlePageChange}
  >
    {#snippet cell(row, col)}
      {#if col.key === "image"}
        {#if row.image}
          <AuthedImage
            path={row.image}
            width={200}
            alt={row.name}
            class="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          />
        {:else}
          <div
            class="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900"
          >
            -
          </div>
        {/if}
      {:else if col.key === "ref"}
        <span class="font-semibold">{row.ref}</span>
      {:else if col.key === "color"}
        {row.color}
      {:else if col.key === "qntd"}
        {row.quantity}
      {:else if col.key === "qntdR"}
        {row.reserved}
      {:else if col.key === "gaveta"}
        {row.drawer}
      {:else if col.key === "cx"}
        {row.cx}
      {:else if col.key === "pvp"}
        {row.pvp.toFixed(2)} €
      {:else if col.key === "fornecedor"}
        {row.fornecedor}
      {:else if col.key === "estado"}
        <StatusBadge status={row.estado} />
      {:else if col.key === "acoes"}
        <RowActions
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
        />
      {/if}
    {/snippet}
  </DataTable>

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes do Produto">
      {#snippet footer()}
        <Button
          onclick={crud.close}
          class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold"
          >Fechar</Button
        >
      {/snippet}
      <div class="col-span-2 flex justify-center mb-2">
        {#if crud.selected.image}
          <AuthedImage
            path={crud.selected.image}
            width={200}
            alt={crud.selected.name}
            class="size-24 object-contain rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          />
        {:else}
          <div
            class="h-24 w-24 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900"
          >
            Sem imagem
          </div>
        {/if}
      </div>
      <DetailGrid
        items={[
          { label: "Referência", value: crud.selected.ref },
          { label: "Nome", value: crud.selected.name },
          { label: "Cor", value: crud.selected.color },
          { label: "Quantidade", value: crud.selected.quantity },
          { label: "Gaveta", value: crud.selected.drawer },
          { label: "Cx", value: crud.selected.cx },
          { label: "PVP", value: `${crud.selected.pvp.toFixed(2)} €` },
          { label: "Fornecedor", value: crud.selected.fornecedor },
          { label: "Família", value: crud.selected.family },
          { label: "Estado", value: crud.selected.estado },
        ]}
      />
    </AdminModal>
  {/if}

  <ConfirmDeleteModal
    open={crud.isDelete}
    onClose={crud.close}
    onConfirm={handleDeleteConfirm}
    title="Eliminar Produto"
    itemName={crud.selected ? `${crud.selected.ref} - ${crud.selected.name}` : ""}
  />

  <AddProductModal
    open={showAddModal}
    onClose={() => (showAddModal = false)}
    onSuccess={handleMutationSuccess}
    {fornecedores}
  />

  <AddProductModal
    open={crud.isEdit}
    editProduct={editFullProduct}
    onClose={() => {
      editFullProduct = null;
      crud.close();
    }}
    onSuccess={handleMutationSuccess}
    {fornecedores}
  />
</div>
