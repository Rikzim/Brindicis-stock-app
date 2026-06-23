<script>
  import { navigateTo } from "@/lib/utils/navigate";
  import { getProducts, getReservationsPaginated, approveReservation, rejectReservation, restoreReservation, resetReservation } from "@/lib/utils/stock-api";
  import { Archive, Package, Check, X, RotateCcw } from "lucide-svelte";
  import AuthedImage from "@/lib/components/ui/authed-image.svelte";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { toast } from "svelte-sonner";
  import PageCard from "@/lib/components/ui/page-card.svelte";
  import DataTable from "@/lib/components/ui/data-table.svelte";
  import StatusBadge from "@/lib/components/ui/status-badge.svelte";
  import Button from "@/lib/components/ui/button.svelte";

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);

  let displayStock = $derived(productsStore.isLoading ? "..." : (productsStore.data?.reduce((sum, p) => sum + (p.quantity - p.reserved), 0) || 98617));
  let displayReserved = $derived(productsStore.isLoading ? "..." : (productsStore.data?.reduce((sum, p) => sum + p.reserved, 0) || 0));

  let serverReservations = $state([]);
  let serverTotal = $state(0);
  let serverPage = $state(1);
  let serverSize = $state(5);
  let serverLoading = $state(false);

  async function doFetch(page, size) {
    serverLoading = true;
    try {
      const result = await getReservationsPaginated({ page, limit: size, status: "0" });
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

  let didInit = $state(false);

  $effect(() => {
    if (!didInit) {
      didInit = true;
      doFetch(1, 5);
    }
  });

  function handlePageChange(page, size) {
    doFetch(page, size);
  }

  function getStatusInfo(status) {
    switch (status) {
      case 0: return { label: "Pendente" };
      case 1: return { label: "Confirmada" };
      case 2: return { label: "Cancelada" };
      default: return { label: "Cancelada" };
    }
  }

  function refetchAll() { doFetch(serverPage, serverSize); productsStore.refetch(); }

  function handleApprove(id) {
    approveReservation(id)
      .then(() => { refetchAll(); toast.success("Reserva aprovada com sucesso."); })
      .catch(() => toast.error("Erro ao aprovar reserva."));
  }

  function handleReject(id) {
    rejectReservation(id)
      .then(() => { refetchAll(); toast.success("Reserva rejeitada."); })
      .catch(() => toast.error("Erro ao rejeitar reserva."));
  }

  function handleReset(id) {
    resetReservation(id)
      .then(() => { refetchAll(); toast.success("Reserva redefinida para pendente."); })
      .catch(() => toast.error("Erro ao redefinir reserva."));
  }

  function handleRestore(id) {
    restoreReservation(id)
      .then(() => { refetchAll(); toast.success("Reserva restaurada."); })
      .catch(() => toast.error("Erro ao restaurar reserva."));
  }

  const columns = [
    { key: "image", header: "Imagem" },
    { key: "ref", header: "Referência", render: (r) => `<span class="font-semibold">${r.ref || r.product?.ref || "-"}</span>` },
    { key: "comercial", header: "Comercial", render: (r) => r.user?.name || "-" },
    { key: "cor", header: "Cor", render: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", render: (r) => r.variant?.size || "-" },
    { key: "qnt", header: "Qnt. Reservada", render: (r) => `<span class="font-bold">${r.quantity}</span>` },
    { key: "estado", header: "Estado" },
    { key: "data", header: "Data", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "-", className: "text-slate-500" },
    { key: "acoes", header: "Ações", className: "text-right", headerClassName: "text-right" },
  ];
</script>

<div class="flex flex-col gap-3 animate-fade-in duration-200 overflow-y-auto flex-1 h-full">
  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
    <PageCard class="flex items-center justify-between p-6">
      <div class="flex flex-col gap-1">
        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos em stock:</span>
        <span class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{displayStock}</span>
      </div>
      <div class="flex size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400">
        <Archive class="size-7 stroke-[1.5]" />
      </div>
    </PageCard>
    <PageCard class="flex items-center justify-between p-6">
      <div class="flex flex-col gap-1">
        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos Reservados:</span>
        <span class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{displayReserved}</span>
      </div>
      <div class="flex size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400">
        <Package class="size-7 stroke-[1.5]" />
      </div>
    </PageCard>
  </div>

  <PageCard class="overflow-hidden flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700">
      <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Reservas Recentes</h2>
      <a href="/admin/reservas" onclick={(e) => { e.preventDefault(); navigateTo("/admin/reservas"); }} class="text-xs font-bold border-2 border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
        Ver tudo
      </a>
    </div>
    <DataTable
      {columns}
      data={serverReservations}
      isLoading={serverLoading}
      loadingMessage="A carregar dados..."
      emptyMessage="Sem dados disponíveis."
      rowKey={(r) => r.id}
      totalRows={serverTotal}
      bind:page={serverPage}
      bind:size={serverSize}
      pageSizeOptions={[5, 10, 15]}
      onPageChange={handlePageChange}
    >
      {#snippet cell(row, col)}
        {#if col.key === "image"}
          {#if row.image}
            <AuthedImage path={row.image} width={200} alt={row.ref || 'produto'} class="size-9 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
          {:else}
            <div class="size-9 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 text-xs">-</div>
          {/if}
        {:else if col.key === "estado"}
          <StatusBadge status={getStatusInfo(row.status).label} />
        {:else if col.key === "acoes"}
          <div class="flex items-center gap-1">
            {#if row.status === 0}
              <Button onclick={() => handleApprove(row.id)} class="h-8 gap-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-none px-3">
                <Check class="size-3.5" />
                <span>Aprovar</span>
              </Button>
              <Button onclick={() => handleReject(row.id)} class="h-8 gap-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-none px-3">
                <X class="size-3.5" />
                <span>Rejeitar</span>
              </Button>
            {:else if row.status === 1}
              <Button onclick={() => handleReset(row.id)} class="h-8 gap-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-none px-3">
                <RotateCcw class="size-3.5" />
                <span>Reverter</span>
              </Button>
            {:else if row.status === 2}
              <Button onclick={() => handleRestore(row.id)} class="h-8 gap-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-none px-3">
                <RotateCcw class="size-3.5" />
                <span>Restaurar</span>
              </Button>
            {/if}
          </div>
        {:else if col.render}
          {@html col.render(row)}
        {/if}
      {/snippet}
    </DataTable>
  </PageCard>
</div>
