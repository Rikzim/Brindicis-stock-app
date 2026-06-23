<script>
  import { X, Info, ChevronLeft, Trash2, FileText, RotateCcw } from "@/lib/utils/icon-map";
  import { getReservations, deleteReservation, restoreReservation, resetReservation } from "@/lib/utils/stock-api";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import ConfirmDeleteModal from "@/lib/components/ui/confirm-delete-modal.svelte";

  let {
    product,
    onClose = () => {},
    onAddReservation = () => {},
    onProductChange = () => {},
  } = $props();

  const reservationsStore = createAsyncStore(() => getReservations({ productId: product.id }));
  let deletingReservation = $state(null);

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }

  async function handleReset(id) {
    try {
      await resetReservation(id);
      reservationsStore.refetch();
      onProductChange();
      toast.success("Reserva redefinida para pendente.");
    } catch {
      toast.error("Erro ao redefinir reserva.");
    }
  }

  async function handleRestore(id) {
    try {
      await restoreReservation(id);
      reservationsStore.refetch();
      onProductChange();
      toast.success("Reserva restaurada.");
    } catch {
      toast.error("Erro ao restaurar reserva.");
    }
  }

  function handleDelete(id) {
    deletingReservation = reservationsStore.data?.find((r) => r.id === id) ?? null;
  }

  async function handleDeleteConfirm() {
    if (!deletingReservation) return;
    const id = deletingReservation.id;
    deletingReservation = null;

    try {
      await deleteReservation(id);
      toast.success("Reserva apagada com sucesso!");
      reservationsStore.refetch();
      onProductChange();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao apagar reserva.");
    }
  }
</script>

<div class="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200">
  <!-- Header -->
  <div class="flex items-start justify-between p-5 pb-3">
    <div class="flex flex-col">
      <span class="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">
        PRODUTO • {product.ref} {product.name}
      </span>
      <h2 class="text-xl font-extrabold text-slate-850 dark:text-slate-100 leading-tight">
        Reservas do Produto
      </h2>
    </div>
    <Button variant="ghost" size="icon" onclick={onClose} class="size-7">
      <X class="size-4" />
    </Button>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-4">
    <!-- Table Container -->
    <div class="w-full rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col min-h-[200px]">
      <!-- Table Header -->
      <div class="grid grid-cols-[1fr_1fr_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto] bg-[#F8FAFC] px-4 py-2.5 text-[10px] font-bold text-slate-500 tracking-wider dark:bg-slate-900/50 gap-x-2">
        <span class="text-left">COMERCIAL</span>
        <span class="text-center">VARIANTE</span>
        <span class="text-center w-12">QTD</span>
        <span class="text-center w-12">AÇÕES</span>
        <span class="hidden sm:inline text-center w-16">DATA</span>
      </div>

      <!-- Table Body -->
      <div class="flex-1 flex flex-col">
        {#if reservationsStore.isLoading}
          <div class="flex-1 flex items-center justify-center py-12 text-xs text-slate-500 font-semibold">
            A carregar reservas...
          </div>
        {:else if !reservationsStore.data || reservationsStore.data.length === 0}
          <div class="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText class="size-10 text-slate-300 dark:text-slate-700 mb-2.5" />
            <p class="text-sm font-bold text-slate-600 dark:text-slate-300">
              Nenhuma reserva encontrada
            </p>
            <p class="text-xs text-slate-500 mt-1 dark:text-slate-500">
              Este produto ainda não tem reservas registadas.
            </p>
          </div>
        {:else}
          <div class="flex flex-col max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {#each reservationsStore.data as r (r.id)}
              <div
                class="grid grid-cols-[1fr_1fr_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto] px-4 py-3 items-center text-slate-750 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors gap-x-2"
              >
                <span class="text-sm font-semibold truncate pr-2" title={r.user?.name || ""}>
                  {r.user?.name || ""}
                </span>
                <span class="text-center text-sm truncate">
                  {r.variant?.color ?? "—"}{r.variant?.size ? ` / ${r.variant.size}` : ""}
                </span>
                <span class="text-center text-sm font-semibold w-12">
                  {r.quantity}
                </span>
                <div class="text-right flex justify-end gap-1 w-12">
                  {#if r.status === 1}
                    <Button variant="ghost" size="icon" onclick={() => handleReset(r.id)} class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Reverter para pendente">
                      <RotateCcw class="size-4" />
                    </Button>
                  {:else if r.status === 2}
                    <Button variant="ghost" size="icon" onclick={() => handleRestore(r.id)} class="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Restaurar reserva">
                      <RotateCcw class="size-4" />
                    </Button>
                  {:else}
                    <Button variant="ghost" size="icon" onclick={() => handleDelete(r.id)} class="text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 size-8">
                      <Trash2 class="size-4" />
                    </Button>
                  {/if}
                </div>
                <span class="hidden sm:inline text-center text-xs text-slate-455 dark:text-slate-500 w-16">
                  {formatDate(r.createdAt)}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Note -->
    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500/95 dark:text-slate-500">
      <Info class="size-4 shrink-0 text-slate-450/80 dark:text-slate-650" />
      <span>As reservas são válidas por 8 dias úteis.</span>
    </div>
  </div>

  <ConfirmDeleteModal
    open={deletingReservation !== null}
    onClose={() => deletingReservation = null}
    onConfirm={handleDeleteConfirm}
    title="Eliminar Reserva"
    itemName={deletingReservation ? `${deletingReservation.quantity}x ${deletingReservation.name}` : ""}
  />

  <!-- Footer Buttons -->
  <div class="absolute bottom-0 left-0 right-0 border-t-2 border-slate-200 bg-slate-50 px-6 py-3 flex items-center gap-3 dark:border-slate-700 dark:bg-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <Button variant="outline" onclick={onClose} class="h-11 px-5">
      <ChevronLeft class="size-4" />
      <span>Voltar</span>
    </Button>

    <Button variant="default" onclick={onAddReservation} class="flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-semibold active:scale-95">
      <span class="text-base">+</span>
      <span>Adicionar Reserva</span>
    </Button>
  </div>
</div>
