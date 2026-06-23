<script>
  import { getReservationsPaginated, deleteReservation, getProducts, createReservation, updateReservation, approveReservation, rejectReservation, restoreReservation, resetReservation, getCommercialUsers, getQuotes } from "@/lib/utils/stock-api";
  import { Plus, Check, X, RotateCcw } from "lucide-svelte";
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
  import { getStringParam, getNumberParam, writeSearchParams } from "@/lib/utils/url-sync.svelte";

  function getStatusInfo(status) {
    switch (status) {
      case 0: return { label: "Pendente" };
      case 1: return { label: "Confirmada" };
      case 2: return { label: "Cancelada" };
      default: return { label: "Cancelada" };
    }
  }

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);
  const commercialUsersStore = createAsyncStore(getCommercialUsers);
  const quotesStore = createAsyncStore(() => getQuotes({ limit: 200 }));

  let crud = createCrudModal();
  let selectedEstado = $state(getStringParam("estado", "Todos"));
  let form = $state({ userId: "", productId: "", variantId: "", quantity: "1", message: "", status: "0", quoteId: "" });

  let selectedProduct = $derived(
    form.productId ? (productsStore.data || []).find((p) => p.id.toString() === form.productId) || null : null
  );

  // --- Server-side pagination ---
  let serverReservations = $state([]);
  let serverTotal = $state(0);
  let serverPage = $state(getNumberParam("page", 1));
  let serverSize = $state(getNumberParam("size", 25));
  let serverLoading = $state(false);

  function statusToBackend(status) {
    if (status === "Todos") return undefined;
    if (status === "Pendente") return "0";
    if (status === "Confirmada") return "1";
    return "2";
  }

  async function doFetch(page, size) {
    serverLoading = true;
    try {
      const result = await getReservationsPaginated({
        page,
        limit: size,
        search: searchQuery || undefined,
        status: statusToBackend(selectedEstado),
      });
      serverReservations = result.reservations;
      serverTotal = result.total;
      serverPage = page;
    } catch {
      serverReservations = [];
      serverTotal = 0;
    } finally {
      serverLoading = false;
    }
  }

  $effect(() => {
    searchQuery;
    selectedEstado;
    doFetch(1, serverSize);
  });

  $effect(() => {
    writeSearchParams({
      page: serverPage > 1 ? serverPage : undefined,
      size: serverSize !== 25 ? serverSize : undefined,
      estado: selectedEstado !== "Todos" ? selectedEstado : undefined,
    });
  });

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  function refetchReservations() {
    doFetch(serverPage, serverSize);
  }

  let userOptions = $derived(
    (commercialUsersStore.data || []).map((u) => ({ value: u.id.toString(), label: u.name }))
  );
  let quoteOptions = $derived(
    (quotesStore.data?.data || []).map((q) => ({ value: q.id.toString(), label: q.reference }))
  );
  let productOptions = $derived((productsStore.data || []).map((p) => ({ value: p.id.toString(), label: `${p.ref} - ${p.name}` })));
  let variantOptions = $derived(
    selectedProduct?.variants ? selectedProduct.variants.map((v) => ({
      value: v.id.toString(), label: `${v.color}${v.size ? ` / ${v.size}` : ""} (Disp: ${v.quantity - v.reserved})`,
    })) : []
  );

  function resetForm() { form = { userId: "", productId: "", variantId: "", quantity: "1", message: "", status: "0", quoteId: "" }; }

  function handleOpenAdd() {
    resetForm();
    form.userId = commercialUsersStore.data?.[0]?.id?.toString() || "";
    form.productId = productsStore.data?.[0]?.id?.toString() || "";
    crud.openAdd();
  }

  function handleOpenEdit(res) {
    form = { userId: res.userId?.toString() || "", productId: res.productId.toString(), variantId: res.variantId?.toString() || "",
      quantity: res.quantity.toString(), message: res.message || "", status: res.status.toString(), quoteId: res.quoteId?.toString() || "" };
    crud.openEdit(res);
  }

  async function handleSaveAdd(e) {
    e.preventDefault();
    if (!form.userId || !form.productId) { toast.error("Comercial e Produto são obrigatórios."); return; }
    const prod = (productsStore.data || []).find((p) => p.id.toString() === form.productId);
    if (!prod) return;
    let colorName = "Geral";
    if (form.variantId && prod.variants) {
      const v = prod.variants.find((v) => v.id.toString() === form.variantId);
      if (v) colorName = v.color;
    }
    try {
      await createReservation({
        userId: parseInt(form.userId), id_product: parseInt(form.productId), quantity: parseInt(form.quantity) || 1,
        message: form.message, color: colorName, size: "",
        quoteId: form.quoteId ? parseInt(form.quoteId) : undefined,
      });
      refetchReservations();
      toast.success("Reserva criada com sucesso."); crud.close();
    } catch {
      toast.error("Erro ao criar reserva."); crud.close();
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!crud.selected) return;
    try {
      await updateReservation(crud.selected.id, {
        quantity: parseInt(form.quantity) || 1,
        message: form.message,
        status: parseInt(form.status),
        quoteId: form.quoteId ? parseInt(form.quoteId) : undefined,
      });
      refetchReservations();
      toast.success("Reserva atualizada com sucesso.");
      crud.close();
    } catch {
      toast.error("Erro ao atualizar reserva.");
    }
  }

  async function handleApprove(id) {
    try {
      await approveReservation(id);
      refetchReservations();
      toast.success("Reserva confirmada com sucesso.");
    } catch {
      toast.error("Erro ao confirmar reserva.");
    }
  }

  async function handleReject(id) {
    try {
      await rejectReservation(id);
      refetchReservations();
      toast.success("Reserva rejeitada.");
    } catch {
      toast.error("Erro ao rejeitar reserva.");
    }
  }

  async function handleRestore(id) {
    try {
      await restoreReservation(id);
      refetchReservations();
      toast.success("Reserva restaurada.");
    } catch {
      toast.error("Erro ao restaurar reserva.");
    }
  }

  async function handleReset(id) {
    try {
      await resetReservation(id);
      refetchReservations();
      toast.success("Reserva redefinida para pendente.");
    } catch {
      toast.error("Erro ao redefinir reserva.");
    }
  }

  async function handleDelete() {
    if (!crud.selected) return;
    try {
      await deleteReservation(crud.selected.id);
      refetchReservations();
      toast.success("Reserva eliminada com sucesso.");
      crud.close();
    } catch {
      toast.error("Erro ao eliminar reserva.");
    }
  }

  const columns = [
    { key: "comercial", header: "Comercial", render: (r) => `<span class="font-semibold">${r.user?.name || "-"}</span>` },
    { key: "ref", header: "Referência", render: (r) => `<span class="font-semibold">${r.ref || r.product?.ref || "-"}</span>` },
    { key: "cor", header: "Cor", render: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", render: (r) => r.variant?.size || "-" },
    { key: "quantidade", header: "Quantidade", render: (r) => `<span class="font-bold">${r.quantity}</span>` },
    { key: "mensagem", header: "Mensagem", render: (r) => `<span class="max-w-[150px] truncate block" title="${r.message || ''}">${r.message || "-"}</span>` },
    { key: "orcamento", header: "Orçamento", render: (r) => r.quote ? `${r.quote.reference}` : "-" },
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
          { value: "Confirmada", label: "Confirmada" }, { value: "Cancelada", label: "Cancelada" }]} />
    </div>
  </PageCard>

  <DataTable columns={columns} data={serverReservations} isLoading={serverLoading}
    loadingMessage="A carregar reservas..." emptyMessage="Sem reservas disponíveis." rowKey={(r) => r.id}
    totalRows={serverTotal} bind:page={serverPage} bind:size={serverSize} onPageChange={handlePageChange}>
    {#snippet cell(row, col)}
      {#if col.key === "estado"}
        {@const info = getStatusInfo(row.status)}
        <StatusBadge status={info.label} />
      {:else if col.key === "acoes"}
        <div class="flex items-center justify-end gap-1">
          {#if row.status === 0}
            <Button variant="ghost" size="icon" onclick={() => handleApprove(row.id)} class="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Confirmar reserva">
              <Check class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onclick={() => handleReject(row.id)} class="size-8 text-red-500 hover:text-red-700 hover:bg-red-50" title="Rejeitar reserva">
              <X class="size-4" />
            </Button>
          {:else if row.status === 1}
            <Button variant="ghost" size="icon" onclick={() => handleReset(row.id)} class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Reverter para pendente">
              <RotateCcw class="size-4" />
            </Button>
          {:else if row.status === 2}
            <Button variant="ghost" size="icon" onclick={() => handleRestore(row.id)} class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Restaurar reserva">
              <RotateCcw class="size-4" />
            </Button>
          {/if}
          <RowActions
            onView={() => crud.openView(row)}
            onEdit={() => handleOpenEdit(row)}
            onDelete={() => crud.openDelete(row)}
          />
        </div>
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
        <FormSelectField label="Comercial" id="res-comercial" bind:value={form.userId} options={userOptions} placeholder="Selecione um comercial" />
        <div class="flex flex-col gap-1.5">
          <label for="res-quote" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Orçamento</label>
          <SearchableSelect id="res-quote" bind:value={form.quoteId} options={quoteOptions} placeholder="Selecionar orçamento (opcional)" searchPlaceholder="Procurar por referência..." emptyMessage="Nenhum orçamento encontrado." />
        </div>
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label for="res-produto" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Selecionar Produto</label>
          <SearchableSelect id="res-produto" bind:value={form.productId} options={productOptions} disabled={crud.isEdit} placeholder="Selecione o produto" />
        </div>
        {#if selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0}
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label for="res-variant" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Variante (Cor / Tamanho)</label>
            <SearchableSelect id="res-variant" bind:value={form.variantId} options={variantOptions} disabled={crud.isEdit} placeholder="Geral (Sem variante específica)" />
          </div>
        {/if}
        <FormField label="Quantidade" for="res-qty">
          <Input id="res-qty" type="number" required min="1" bind:value={form.quantity} />
        </FormField>

        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label for="res-message" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Mensagem / Observações</label>
          <textarea id="res-message" bind:value={form.message} placeholder="Nota ou comentário da reserva..."
            class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]"></textarea>
        </div>
        {#if crud.isEdit}
          <FormSelectField label="Estado da Reserva" id="res-status" bind:value={form.status}
            options={[{ value: "0", label: "Pendente" }, { value: "1", label: "Confirmada" }, { value: "2", label: "Cancelada" }]}
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
        { label: "Comercial", value: crud.selected.user?.name || "Sem Nome" },
        { label: "Produto (Ref)", value: `${crud.selected.product?.name || "Produto"} (${crud.selected.ref || crud.selected.product?.ref})` },
        { label: "Variante", value: `${crud.selected.variant?.color || "-"}${crud.selected.variant?.size ? ` / ${crud.selected.variant.size}` : ""}` },
        { label: "Quantidade", value: `${crud.selected.quantity} unidades` },
        { label: "Orçamento", value: crud.selected.quote?.reference || "-" },
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
    itemName={crud.selected ? `${crud.selected.quantity}x ${crud.selected.product?.name || "Produto"} (${crud.selected.user?.name || "-"})` : ""} />
</div>
