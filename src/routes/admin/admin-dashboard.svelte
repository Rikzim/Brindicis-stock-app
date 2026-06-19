<script>
  import { navigateTo } from "@/lib/utils/navigate";
  import { getProducts, getReservations } from "@/lib/utils/stock-api";
  import { Archive, Package } from "lucide-svelte";
  import AuthedImage from "@/lib/components/ui/authed-image.svelte";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import PageCard from "@/lib/components/ui/page-card.svelte";
  import DataTable from "@/lib/components/ui/data-table.svelte";

  let { searchQuery = "" } = $props();

  const productsStore = createAsyncStore(getProducts);
  const reservationsStore = createAsyncStore(() => getReservations());

  let filteredReservations = $derived.by(() => {
    const all = reservationsStore.data || [];
    if (!searchQuery) return all.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return all.filter((r) =>
      (r.ref || r.product?.ref || "").toLowerCase().includes(q) ||
      (r.name || "").toLowerCase().includes(q)
    ).slice(0, 5);
  });

  let displayStock = $derived(productsStore.isLoading ? "..." : (productsStore.data?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 98617));
  let displayReserved = $derived(reservationsStore.isLoading ? "..." : (reservationsStore.data?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0));
  let isLoading = $derived(productsStore.isLoading || reservationsStore.isLoading);

  const columns = [
    { key: "image", header: "Imagem" },
    { key: "ref", header: "Referência", render: (r) => `<span class="font-semibold">${r.ref || r.product?.ref || "-"}</span>` },
    { key: "comercial", header: "Comercial", render: (r) => r.name || "-" },
    { key: "cor", header: "Cor", render: (r) => r.variant?.color || "-" },
    { key: "tamanho", header: "Tamanho", render: (r) => r.variant?.size || "-" },
    { key: "qnt", header: "Qnt. Reservada", render: (r) => `<span class="font-bold">${r.quantity}</span>` },
    { key: "data", header: "Data", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "-", className: "text-slate-400" },
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
      data={filteredReservations}
      {isLoading}
      loadingMessage="A carregar dados..."
      emptyMessage="Sem dados disponíveis."
      rowKey={(r) => r.id}
    >
      {#snippet cell(row, col)}
        {#if col.key === "image"}
          {#if row.image}
            <AuthedImage path={row.image} width={200} alt={row.ref || 'produto'} class="size-9 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
          {:else}
            <div class="size-9 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 text-xs">-</div>
          {/if}
        {:else if col.render}
          {@html col.render(row)}
        {/if}
      {/snippet}
    </DataTable>
  </PageCard>
</div>
