<script>
  import { X, Info, ChevronLeft, Trash2, FileText } from "@/lib/utils/icon-map";
  import { getReservations, deleteReservation } from "@/lib/utils/stock-api";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import Button from "@/lib/components/ui/button.svelte";

  let {
    product,
    onClose = () => {},
    onAddReservation = () => {},
  } = $props();

  const reservationsStore = createAsyncStore(() => getReservations({ productId: product.id }));
  let isDeletingId = $state(null);

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

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja apagar esta reserva?")) return;

    try {
      isDeletingId = id;
      await deleteReservation(id);
      toast.success("Reserva apagada com sucesso!");
      reservationsStore.refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao apagar reserva.");
    } finally {
      isDeletingId = null;
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
      <div class="grid grid-cols-12 bg-[#F8FAFC] px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-wider dark:bg-slate-900/50">
        <span class="col-span-5 text-left">COMERCIAL</span>
        <span class="col-span-3 text-center">QUANTIDADE</span>
        <span class="col-span-2 text-center">DATA</span>
        <span class="col-span-2 text-right">AÇÕES</span>
      </div>

      <!-- Table Body -->
      <div class="flex-1 flex flex-col">
        {#if reservationsStore.isLoading}
          <div class="flex-1 flex items-center justify-center py-12 text-xs text-slate-400 font-semibold">
            A carregar reservas...
          </div>
        {:else if !reservationsStore.data || reservationsStore.data.length === 0}
          <div class="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText class="size-10 text-slate-300 dark:text-slate-700 mb-2.5" />
            <p class="text-sm font-bold text-slate-600 dark:text-slate-300">
              Nenhuma reserva encontrada
            </p>
            <p class="text-xs text-slate-400 mt-1 dark:text-slate-500">
              Este produto ainda não tem reservas registadas.
            </p>
          </div>
        {:else}
          <div class="flex flex-col max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {#each reservationsStore.data as r (r.id)}
              <div
                class="grid grid-cols-12 px-4 py-3 items-center text-slate-750 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
              >
                <span class="col-span-5 text-sm font-semibold truncate pr-2" title={r.name}>
                  {r.name}
                </span>
                <span class="col-span-3 text-center text-sm font-semibold">
                  {r.quantity}
                </span>
                <span class="col-span-2 text-center text-xs text-slate-455 dark:text-slate-500">
                  {formatDate(r.createdAt)}
                </span>
                <div class="col-span-2 text-right flex justify-end">
                  <Button variant="ghost" size="icon" disabled={isDeletingId === r.id} onclick={() => handleDelete(r.id)} class="text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 size-8">
                    <Trash2 class="size-4" />
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Note -->
    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400/95 dark:text-slate-500">
      <Info class="size-4 shrink-0 text-slate-450/80 dark:text-slate-650" />
      <span>As reservas são válidas por 48 horas.</span>
    </div>
  </div>

  <!-- Footer Buttons -->
  <div class="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
