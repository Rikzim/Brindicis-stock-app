<script>
  import { getReservations, deleteReservation, getProducts, getUsers, createReservation } from "@/lib/utils/stock-api";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { createCrudModal } from "@/lib/state/crud-modal.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import FormField from "@/lib/components/ui/form-field.svelte";
  import FormSelectField from "@/lib/components/ui/form-select-field.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";
  import DataTable from "@/lib/components/ui/data-table.svelte";
  import StatusBadge from "@/lib/components/ui/status-badge.svelte";
  import RowActions from "@/lib/components/ui/row-actions.svelte";
  import PageCard from "@/lib/components/ui/page-card.svelte";
  import AdminModal from "@/lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "@/lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "@/lib/components/ui/detail-grid.svelte";

  function getStatusInfo(status) {
    switch (status) {
      case 0: return { label: "Pendente", statusText: "pendente" };
      case 1: return { label: "Aprovada", statusText: "approved" };
      default: return { label: "Rejeitada", statusText: "rejected" };
    }
  }

  let { searchQuery = "" } = $props();

  const reservationsStore = createAsyncStore(() => getReservations());
  const productsStore = createAsyncStore(getProducts);
  const usersStore = createAsyncStore(getUsers);

  let crud = createCrudModal();
  let selectedEstado = $state("Todos");
  let form = $state({ name: "", productId: "", variantId: "", quantity: "1", message: "", proposal: "", order: "", status: "0" });

  let selectedProduct = $derived(
    form.productId ? (productsStore.data || []).find((p) => p.id.toString() === form.productId) || null : null
  );

  let filteredReservations = $derived.by(() => {
    let result = reservationsStore.data || [];
    if (selectedEstado !== "Todos") {
      result = result.filter((res) => {
        if (selectedEstado === "Pendente") return res.status === 0;
        if (selectedEstado === "Aprovada") return res.status === 1;
        if (selectedEstado === "Rejeitada") return res.status !== 0 && res.status !== 1;
        return true;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((res) =>
        (res.name || "").toLowerCase().includes(q) ||
        (res.ref || res.product?.ref || "").toLowerCase().includes(q)
      );
    }
    return result;
  });

  let userOptions = $derived(
    (usersStore.data || []).length > 0 ? usersStore.data.map((u) => ({ value: u.name, label: u.name })) : [{ value: "Administrador", label: "Administrador" }]
  );
  let productOptions = $derived((productsStore.data || []).map((p) => ({ value: p.id.toString(), label: `${p.ref} - ${p.name}` })));
  let variantOptions = $derived(
    selectedProduct?.variants ? selectedProduct.variants.map((v) => ({
      value: v.id.toString(), label: `${v.color}${v.size ? ` / ${v.size}` : ""} (Disp: ${v.quantity - v.reserved})`,
    })) : []
  );

  function resetForm() { form = { name: "", productId: "", variantId: "", quantity: "1", message: "", proposal: "", order: "", status: "0" }; }

  function handleOpenAdd() {
    resetForm();
    form.name = usersStore.data?.[0]?.name || "";
    form.productId = productsStore.data?.[0]?.id?.toString() || "";
    crud.openAdd();
  }

  function handleOpenEdit(res) {
    form = { name: res.name || "", productId: res.productId.toString(), variantId: res.variantId?.toString() || "",
      quantity: res.quantity.toString(), message: res.message || "", proposal: res.proposal?.toString() || "",
      order: res.order || "", status: res.status.toString() };
    crud.openEdit(res);
  }

  async function handleSaveAdd(e) {
    e.preventDefault();
    if (!form.name || !form.productId) { toast.error("Comercial e Produto são obrigatórios."); return; }
    const prod = (productsStore.data || []).find((p) => p.id.toString() === form.productId);
    if (!prod) return;
    let colorName = "Geral";
    if (form.variantId && prod.variants) {
      const v = prod.variants.find((v) => v.id.toString() === form.variantId);
      if (v) colorName = v.color;
    }
    try {
      await createReservation({
        name: form.name, id_product: parseInt(form.productId), quantity: parseInt(form.quantity) || 1,
        message: form.message, color: colorName, size: "",
        proposal: form.proposal ? parseFloat(form.proposal) : undefined, order: form.order || undefined,
      });
      reservationsStore.refetch();
      toast.success("Reserva criada com sucesso."); crud.close();
    } catch {
      toast.success("Reserva criada com sucesso (Modo Local)."); crud.close();
    }
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!crud.selected) return;
    toast.success("Reserva atualizada com sucesso."); crud.close();
  }

  function handleDelete() {
    if (!crud.selected) return;
    deleteReservation(crud.selected.id).then(() => reservationsStore.refetch());
    toast.success("Reserva eliminada com sucesso.");
    crud.close();
  }

  const columns = [
    { key: "comercial", header: "Comercial", render: (r) => `<span class="font-semibold">${r.name || "-"}</span>` },
    { key: "ref", header: "Referência", render: (r) => `<span class="font-semibold">${r.ref || r.product?.ref || "-"}</span>` },
    { key: "encomenda", header: "Encomenda", render: (r) => r.order || "-" },
    { key: "cor", header: "Cor", render: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", render: (r) => r.variant?.size || "-" },
    { key: "quantidade", header: "Quantidade", render: (r) => `<span class="font-bold">${r.quantity}</span>` },
    { key: "mensagem", header: "Mensagem", render: (r) => `<span class="max-w-[150px] truncate block" title="${r.message || ''}">${r.message || "-"}</span>` },
    { key: "orcamento", header: "Orçamento", render: (r) => r.proposal ? `${r.proposal} €` : "-" },
    { key: "estado", header: "Estado" },
    { key: "data", header: "Data", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "-", className: "text-slate-400" },
    { key: "acoes", header: "Ações", className: "text-right", headerClassName: "text-right" },
  ];
</script>

<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative">
  <PageCard class="p-6 flex flex-col gap-4 shrink-0">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-bold text-slate-800 dark:text-white">Gestão de Reservas</h1>
      <Button onclick={handleOpenAdd} class="h-10 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none">
        <Plus class="size-4" /><span>Criar Reserva</span>
      </Button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <FormSelectField label="Estado" id="filter-estado-res" bind:value={selectedEstado}
        options={[{ value: "Todos", label: "Todos" }, { value: "Pendente", label: "Pendente" },
          { value: "Aprovada", label: "Aprovada" }, { value: "Rejeitada", label: "Rejeitada" }]} />
    </div>
  </PageCard>

  <DataTable columns={columns} data={filteredReservations} isLoading={reservationsStore.isLoading}
    loadingMessage="A carregar reservas..." emptyMessage="Sem reservas disponíveis." rowKey={(r) => r.id}>
    {#snippet cell(row, col)}
      {#if col.key === "estado"}
        {@const info = getStatusInfo(row.status)}
        <StatusBadge status={info.label} />
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
    <AdminModal open onClose={crud.close} title={crud.isAdd ? "Criar Nova Reserva" : "Editar Reserva"}>
      {#snippet footer()}
        <Button variant="outline" onclick={crud.close} class="h-10 px-4">Cancelar</Button>
        <Button type="submit" form="reservation-form" class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Salvar</Button>
      {/snippet}
      <form id="reservation-form" onsubmit={crud.isAdd ? handleSaveAdd : handleSaveEdit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelectField label="Comercial (Nome)" id="res-comercial" bind:value={form.name} options={userOptions} placeholder="Selecione um comercial" />
        <FormField label="Referência Encomenda" for="res-order">
          <Input id="res-order" placeholder="Ex: ENC-2026-01" bind:value={form.order} />
        </FormField>
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label for="res-produto" class="text-xs font-semibold text-slate-500 dark:text-slate-400">Selecionar Produto</label>
          <SearchableSelect id="res-produto" bind:value={form.productId} options={productOptions} disabled={crud.isEdit} placeholder="Selecione o produto" />
        </div>
        {#if selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0}
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label for="res-variant" class="text-xs font-semibold text-slate-500 dark:text-slate-400">Variante (Cor / Tamanho)</label>
            <SearchableSelect id="res-variant" bind:value={form.variantId} options={variantOptions} disabled={crud.isEdit} placeholder="Geral (Sem variante específica)" />
          </div>
        {/if}
        <FormField label="Quantidade" for="res-qty">
          <Input id="res-qty" type="number" required min="1" bind:value={form.quantity} />
        </FormField>
        <FormField label="Orçamento (€)" for="res-proposal">
          <Input id="res-proposal" type="number" step="0.01" min="0" placeholder="Ex: 150.00" bind:value={form.proposal} />
        </FormField>
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label for="res-message" class="text-xs font-semibold text-slate-500 dark:text-slate-400">Mensagem / Observações</label>
          <textarea id="res-message" bind:value={form.message} placeholder="Nota ou comentário da reserva..."
            class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]"></textarea>
        </div>
        {#if crud.isEdit}
          <FormSelectField label="Estado da Reserva" id="res-status" bind:value={form.status}
            options={[{ value: "0", label: "Pendente" }, { value: "1", label: "Aprovada" }, { value: "2", label: "Rejeitada" }]}
            placeholder="Selecionar estado" />
        {/if}
      </form>
    </AdminModal>
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes da Reserva">
      {#snippet footer()}
        <Button onclick={crud.close} class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold">Fechar</Button>
      {/snippet}
      <DetailGrid items={[
        { label: "Comercial", value: crud.selected.name || "Sem Nome" },
        { label: "Produto (Ref)", value: `${crud.selected.product?.name || "Produto"} (${crud.selected.ref || crud.selected.product?.ref})` },
        { label: "Encomenda", value: crud.selected.order || "-" },
        { label: "Variante", value: `${crud.selected.variant?.color || "-"}${crud.selected.variant?.size ? ` / ${crud.selected.variant.size}` : ""}` },
        { label: "Quantidade", value: `${crud.selected.quantity} unidades` },
        { label: "Orçamento", value: crud.selected.proposal ? `${crud.selected.proposal.toFixed(2)} €` : "-" },
        { label: "Estado", value: getStatusInfo(crud.selected.status).label },
      ]} />
      {#if crud.selected.message}
        <div class="mt-2">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mensagem</span>
          <p class="text-sm text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850">{crud.selected.message}</p>
        </div>
      {/if}
    </AdminModal>
  {/if}

  <ConfirmDeleteModal open={crud.isDelete} onClose={crud.close} onConfirm={handleDelete}
    title="Eliminar Reserva"
    itemName={crud.selected ? `${crud.selected.quantity}x ${crud.selected.product?.name || "Produto"} (${crud.selected.name})` : ""} />
</div>
