<script>
  import { getProducts, getFamilies } from "@/lib/utils/stock-api";
  import { Plus, Download } from "lucide-svelte";
  import { apiClient } from "@/lib/utils/api-client";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { createCrudModal } from "@/lib/state/crud-modal.svelte";
  import { getImageUrl } from "@/lib/utils";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";
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

  const productsStore = createAsyncStore(getProducts);
  const familiesStore = createAsyncStore(getFamilies);

  let crud = createCrudModal();
  let showAddModal = $state(false);
  let filters = $state({
    selectedFornecedor: "Todas",
    selectedFamilia: "Todas",
    selectedDisponibilidade: "Todos",
    selectedEstado: "Todos",
    searchCaixa: "",
    searchGaveta: "",
  });
  let form = $state({ ref: "", name: "", family: "", quantity: "0", pvp: "0", estado: "Ativo" });

  let fornecedores = $derived.by(() => {
    const set = new Set(["Todas"]);
    productsStore.data?.forEach((p) => { if (p.type) set.add(p.type); });
    return Array.from(set);
  });

  let stockRows = $derived.by(() => {
    const rows = [];
    const products = productsStore.data || [];
    for (const product of products) {
      if (filters.selectedFornecedor !== "Todas" && product.type !== filters.selectedFornecedor) continue;
      if (filters.selectedFamilia !== "Todas" && product.family?.name !== filters.selectedFamilia) continue;
      if (filters.selectedEstado !== "Todos" && (filters.selectedEstado === "Ativo" ? product.active !== 1 : product.active !== 0)) continue;

      const variants = (product.variants && product.variants.length > 0) ? product.variants : [{
        id: 0, productId: product.id, color: "-", size: null, quantity: product.quantity,
        reserved: product.reserved, cx: product.cx, drawer: product.drawer,
      }];

      for (const v of variants) {
        const avail = v.quantity - v.reserved;
        if (filters.selectedDisponibilidade === "Com Stock" && avail <= 0) continue;
        if (filters.selectedDisponibilidade === "Esgotado" && avail > 0) continue;
        if (filters.searchCaixa && !v.cx?.toLowerCase().includes(filters.searchCaixa.toLowerCase())) continue;
        if (filters.searchGaveta && !v.drawer?.toLowerCase().includes(filters.searchGaveta.toLowerCase())) continue;

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
  });

  let familyOptions = $derived((familiesStore.data || []).map((f) => ({ value: f.name, label: f.name })));
  let fornecedorOptions = $derived(fornecedores.map((f) => ({ value: f, label: f })));

  const statusFilterOptions = [
    { value: "Todos", label: "Todos" }, { value: "Com Stock", label: "Com Stock" }, { value: "Esgotado", label: "Esgotado" },
  ];
  const activeStatusFilterOptions = [
    { value: "Todos", label: "Todos" }, { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" },
  ];

  function resetForm() { form = { ref: "", name: "", family: familiesStore.data?.[0]?.name || "", quantity: "0", pvp: "0", estado: "Ativo" }; }
  function handleAdd() { showAddModal = true; }
  function handleView(row) { crud.openView(row); }
  function handleEdit(row) {
    form = { ref: row.ref, name: row.name, family: row.family, quantity: row.quantity.toString(), pvp: row.pvp.toString(), estado: row.estado };
    crud.openEdit(row);
  }
  function handleDelete(row) { crud.openDelete(row); }

  function handleSave(e) {
    e.preventDefault();
    toast.success("Produto atualizado com sucesso.");
    crud.close();
  }

  function handleDeleteConfirm() {
    toast.success("Produto removido com sucesso."); crud.close();
  }

  const columns = [
    { key: "image", header: "Imagem", render: (row) => row.image ? `<img src="${getImageUrl(row.image)}" alt="${row.name}" class="size-10 object-contain rounded-md border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900" />` : `<div class="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">-</div>` },
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

  <DataTable columns={columns} data={stockRows} isLoading={productsStore.isLoading}
    loadingMessage="A carregar produtos..." emptyMessage="Nenhum produto encontrado." rowKey={(r) => r.id}>
    {#snippet cell(row, col)}
      {#if col.key === "estado"}
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

  {#if crud.isEdit}
    <AdminModal open onClose={crud.close} title="Editar Produto">
      {#snippet footer()}
        <Button variant="outline" onclick={crud.close} class="h-10 px-4">Cancelar</Button>
        <Button type="submit" form="product-form" class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button>
      {/snippet}
      <form id="product-form" onsubmit={handleSave} class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Referência" for="prod-ref">
          <Input id="prod-ref" required placeholder="Ex: REF-001" bind:value={form.ref} />
        </FormField>
        <FormField label="Nome" for="prod-name">
          <Input id="prod-name" required placeholder="Nome do produto" bind:value={form.name} />
        </FormField>
        <FormField label="Família" for="prod-family">
          <SearchableSelect id="prod-family" bind:value={form.family} options={familyOptions} placeholder="Selecionar família" />
        </FormField>
        <FormField label="Estado" for="prod-estado">
          <SearchableSelect id="prod-estado" bind:value={form.estado} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} placeholder="Selecionar estado" />
        </FormField>
        <FormField label="Quantidade" for="prod-qty">
          <Input id="prod-qty" type="number" min="0" bind:value={form.quantity} />
        </FormField>
        <FormField label="PVP (€)" for="prod-pvp">
          <Input id="prod-pvp" type="number" step="0.01" min="0" bind:value={form.pvp} />
        </FormField>
      </form>
    </AdminModal>
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes do Produto">
      {#snippet footer()}
        <Button onclick={crud.close} class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>
      {/snippet}
      <div class="col-span-2 flex justify-center mb-2">
        {#if crud.selected.image}
          <img src={getImageUrl(crud.selected.image)} alt={crud.selected.name} class="h-24 object-contain rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900" />
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
    onSuccess={() => productsStore.refetch()}
    fornecedores={fornecedores}
  />
</div>
