<script lang="ts">
  import {
    getReservationsPaginated,
    deleteReservation,
    getProducts,
    createReservation,
    updateReservation,
    approveReservation,
    rejectReservation,
    restoreReservation,
    resetReservation,
    getCommercialUsers,
    getQuotes,
  } from "$lib/utils/stock-api";
  import { reservationStatusInfo } from "$lib/utils/stock-types";
  import { Plus, Check, X, RotateCcw } from "lucide-svelte";
  import ReservationFormModal from "$lib/components/admin/reservation-form-modal.svelte";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import { createCrudModal } from "$lib/state/crud-modal.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import FormSelectField from "$lib/components/ui/form-select-field.svelte";
  import AdminFiltersDrawer from "$lib/components/admin/admin-filters-drawer.svelte";
  import DataTable from "$lib/components/ui/data-table.svelte";
  import StatusBadge from "$lib/components/ui/status-badge.svelte";
  import RowActions from "$lib/components/ui/row-actions.svelte";
  import AdminModal from "$lib/components/ui/admin-modal.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirm-delete-modal.svelte";
  import DetailGrid from "$lib/components/ui/detail-grid.svelte";
  import { getStringParam, getNumberParam, writeSearchParams } from "$lib/utils/url-sync.svelte";

  function getStatusInfo(status: number) {
    return reservationStatusInfo(status);
  }

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);
  const commercialUsersStore = createAsyncStore(getCommercialUsers);
  const quotesStore = createAsyncStore(() => getQuotes({ limit: 200 }));

  let crud = createCrudModal();

  let appliedEstado = $state(getStringParam("estado", "Todos"));
  let pendingEstado = $state(getStringParam("estado", "Todos"));

  let form = $state({
    userId: "",
    productId: "",
    variantId: "",
    quantity: "1",
    message: "",
    status: "0",
    quoteId: "",
  });

  let selectedProduct = $derived(
    form.productId
      ? (productsStore.data || []).find((p) => p.id.toString() === form.productId) || null
      : null
  );

  // --- Server-side pagination ---
  let serverReservations = $state<any[]>([]);
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
        status: statusToBackend(appliedEstado),
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
    appliedEstado;
    doFetch(1, serverSize);
  });

  $effect(() => {
    writeSearchParams({
      page: serverPage > 1 ? serverPage : undefined,
      size: serverSize !== 25 ? serverSize : undefined,
      estado: appliedEstado !== "Todos" ? appliedEstado : undefined,
    });
  });

  function applyFilters() {
    appliedEstado = pendingEstado;
  }

  function clearAll() {
    pendingEstado = "Todos";
    applyFilters();
  }

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  function refetchReservations() {
    doFetch(serverPage, serverSize);
  }

  let userOptions = $derived(
    (commercialUsersStore.data || []).map((u) => ({
      value: u.id.toString(),
      label: u.name,
    }))
  );
  let quoteOptions = $derived(
    (quotesStore.data?.data || []).map((q) => ({
      value: q.id.toString(),
      label: q.reference,
    }))
  );
  let productOptions = $derived(
    (productsStore.data || []).map((p) => ({
      value: p.id.toString(),
      label: `${p.ref} - ${p.name}`,
    }))
  );
  let variantOptions = $derived(
    selectedProduct?.variants
      ? selectedProduct.variants.map((v) => ({
          value: v.id.toString(),
          label: `${v.color}${v.size ? ` / ${v.size}` : ""} (Disp: ${v.quantity - v.reserved})`,
        }))
      : []
  );

  function resetForm() {
    form = {
      userId: "",
      productId: "",
      variantId: "",
      quantity: "1",
      message: "",
      status: "0",
      quoteId: "",
    };
  }

  function handleOpenAdd() {
    resetForm();
    form.userId = commercialUsersStore.data?.[0]?.id?.toString() || "";
    form.productId = productsStore.data?.[0]?.id?.toString() || "";
    crud.openAdd();
  }

  function handleOpenEdit(res) {
    form = {
      userId: res.userId?.toString() || "",
      productId: res.productId.toString(),
      variantId: res.variantId?.toString() || "",
      quantity: res.quantity.toString(),
      message: res.message || "",
      status: res.status.toString(),
      quoteId: res.quoteId?.toString() || "",
    };
    crud.openEdit(res);
  }

  async function handleSaveAdd(data: {
    userId: number;
    productId: number;
    variantId?: number;
    quantity: number;
    message: string;
    status: number;
    quoteId?: number;
  }) {
    const prod = (productsStore.data || []).find((p) => p.id === data.productId);
    let colorName = "Geral";
    if (data.variantId && prod?.variants) {
      const v = prod.variants.find((v: any) => v.id === data.variantId);
      if (v) colorName = v.color;
    }
    try {
      await createReservation({
        userId: data.userId,
        id_product: data.productId,
        quantity: data.quantity,
        message: data.message,
        color: colorName,
        size: "",
        quoteId: data.quoteId,
      });
      refetchReservations();
      toast.success("Reserva criada com sucesso.");
    } catch {
      toast.error("Erro ao criar reserva.");
    }
  }

  async function handleSaveEdit(data: {
    userId: number;
    productId: number;
    variantId?: number;
    quantity: number;
    message: string;
    status: number;
    quoteId?: number;
  }) {
    if (!crud.selected?.id) return;
    try {
      await updateReservation(crud.selected.id, {
        quantity: data.quantity,
        message: data.message,
        status: data.status,
        quoteId: data.quoteId,
      });
      refetchReservations();
      toast.success("Reserva atualizada com sucesso.");
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
    if (!crud.selected?.id) return;
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
    { key: "comercial", header: "Comercial" },
    { key: "ref", header: "Referência" },
    { key: "cor", header: "Cor" },
    { key: "tamanho", header: "Tamanho" },
    { key: "quantidade", header: "Quantidade" },
    { key: "mensagem", header: "Mensagem" },
    { key: "orcamento", header: "Orçamento" },
    { key: "estado", header: "Estado" },
    { key: "data", header: "Data", className: "text-slate-400" },
    {
      key: "acoes",
      header: "Ações",
      className: "text-right",
      headerClassName: "text-right",
    },
  ];
</script>

<div
  class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative p-3 sm:p-0"
>
  <AdminFiltersDrawer
    title="Gestão de Reservas"
    activeCount={appliedEstado !== "Todos" ? 1 : 0}
    hasPendingChanges={pendingEstado !== appliedEstado}
    onApply={applyFilters}
    onClear={clearAll}
  >
    {#snippet children()}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <FormSelectField
          label="Estado"
          id="filter-estado-res"
          bind:value={pendingEstado}
          options={[
            { value: "Todos", label: "Todos" },
            { value: "Pendente", label: "Pendente" },
            { value: "Confirmada", label: "Confirmada" },
            { value: "Cancelada", label: "Cancelada" },
          ]}
          class="h-8"
        />
      </div>
    {/snippet}
  </AdminFiltersDrawer>

  <div class="flex items-center gap-2">
    <Button
      onclick={handleOpenAdd}
      class="h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs"
    >
      <Plus class="size-3.5" /><span>Criar Reserva</span>
    </Button>
  </div>

  <DataTable
    {columns}
    data={serverReservations}
    isLoading={serverLoading}
    loadingMessage="A carregar reservas..."
    emptyMessage="Sem reservas disponíveis."
    rowKey={(r) => r.id}
    totalRows={serverTotal}
    bind:page={serverPage}
    bind:size={serverSize}
    onPageChange={handlePageChange}
  >
    {#snippet cell(row, col)}
      {#if col.key === "comercial"}
        <span class="font-semibold">{row.user?.name || "-"}</span>
      {:else if col.key === "ref"}
        <span class="font-semibold">{row.ref || row.product?.ref || "-"}</span>
      {:else if col.key === "cor"}
        {row.variant?.color || "-"}
      {:else if col.key === "tamanho"}
        {row.variant?.size || "-"}
      {:else if col.key === "quantidade"}
        <span class="font-bold">{row.quantity}</span>
      {:else if col.key === "mensagem"}
        <span class="max-w-[150px] truncate block" title={row.message || ""}>
          {row.message || "-"}
        </span>
      {:else if col.key === "orcamento"}
        {row.quote?.reference || "-"}
      {:else if col.key === "estado"}
        {@const info = getStatusInfo(row.status)}
        <StatusBadge status={info.label} />
      {:else if col.key === "data"}
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString("pt-PT") : "-"}
      {:else if col.key === "acoes"}
        <div class="flex items-center justify-end gap-1">
          {#if row.status === 0}
            <Button
              variant="ghost"
              size="icon"
              onclick={() => handleApprove(row.id)}
              class="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Confirmar reserva"
            >
              <Check class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onclick={() => handleReject(row.id)}
              class="size-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Rejeitar reserva"
            >
              <X class="size-4" />
            </Button>
          {:else if row.status === 1}
            <Button
              variant="ghost"
              size="icon"
              onclick={() => handleReset(row.id)}
              class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              title="Reverter para pendente"
            >
              <RotateCcw class="size-4" />
            </Button>
          {:else if row.status === 2}
            <Button
              variant="ghost"
              size="icon"
              onclick={() => handleRestore(row.id)}
              class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              title="Restaurar reserva"
            >
              <RotateCcw class="size-4" />
            </Button>
          {/if}
          <RowActions
            onView={() => crud.openView(row)}
            onEdit={() => handleOpenEdit(row)}
            onDelete={() => crud.openDelete(row)}
          />
        </div>
      {/if}
    {/snippet}
  </DataTable>

  {#if crud.isAdd || crud.isEdit}
    <ReservationFormModal
      open={crud.isAdd || crud.isEdit}
      isEdit={crud.isEdit}
      initial={{
        id: crud.selected?.id,
        userId: form.userId,
        productId: form.productId,
        variantId: form.variantId,
        quantity: form.quantity,
        message: form.message,
        status: form.status,
        quoteId: form.quoteId,
      }}
      onClose={crud.close}
      onSave={crud.isAdd ? handleSaveAdd : handleSaveEdit}
    />
  {/if}

  {#if crud.isView && crud.selected}
    <AdminModal open onClose={crud.close} title="Detalhes da Reserva">
      {#snippet footer()}
        <Button
          onclick={crud.close}
          class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold"
          >Fechar</Button
        >
      {/snippet}
      <DetailGrid
        items={[
          {
            label: "Comercial",
            value: crud.selected.user?.name || "Sem Nome",
          },
          {
            label: "Produto (Ref)",
            value: `${crud.selected.product?.name || "Produto"} (${crud.selected.ref || crud.selected.product?.ref})`,
          },
          {
            label: "Variante",
            value: `${crud.selected.variant?.color || "-"}${crud.selected.variant?.size ? ` / ${crud.selected.variant.size}` : ""}`,
          },
          {
            label: "Quantidade",
            value: `${crud.selected.quantity} unidades`,
          },
          {
            label: "Orçamento",
            value: crud.selected.quote?.reference || "-",
          },
          {
            label: "Estado",
            value: getStatusInfo(Number(crud.selected.status)).label,
          },
        ]}
      />
      {#if crud.selected.message}
        <div class="mt-2">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"
            >Mensagem</span
          >
          <p
            class="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800"
          >
            {crud.selected.message}
          </p>
        </div>
      {/if}
    </AdminModal>
  {/if}

  <ConfirmDeleteModal
    open={crud.isDelete}
    onClose={crud.close}
    onConfirm={handleDelete}
    title="Eliminar Reserva"
    itemName={crud.selected
      ? `${crud.selected.quantity}x ${crud.selected.product?.name || "Produto"} (${crud.selected.user?.name || "-"})`
      : ""}
  />
</div>
