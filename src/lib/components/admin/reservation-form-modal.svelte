<script lang="ts">
  import {
    getProducts,
    createReservation,
    updateReservation,
    getCommercialUsers,
    getQuotes,
  } from "$lib/utils/stock-api";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import FormField from "$lib/components/ui/form-field.svelte";
  import FormSelectField from "$lib/components/ui/form-select-field.svelte";
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import AdminModal from "$lib/components/ui/admin-modal.svelte";

  type Props = {
    open: boolean;
    isEdit: boolean;
    initial: {
      id?: number;
      userId: string;
      productId: string;
      variantId: string;
      quantity: string;
      message: string;
      status: string;
      quoteId: string;
    };
    onClose: () => void;
    onSave: (data: {
      userId: number;
      productId: number;
      variantId?: number;
      quantity: number;
      message: string;
      status: number;
      quoteId?: number;
    }) => Promise<void>;
  };

  let { open, isEdit, initial, onClose, onSave }: Props = $props();

  const productsStore = createAsyncStore(getProducts);
  const commercialUsersStore = createAsyncStore(getCommercialUsers);
  const quotesStore = createAsyncStore(() => getQuotes({ limit: 200 }));

  // svelte-ignore state_referenced_locally
  let form = $state(structuredClone(initial));
  let isSubmitting = $state(false);

  $effect(() => {
    if (open) form = structuredClone(initial);
  });

  let selectedProduct = $derived(
    form.productId
      ? (productsStore.data || []).find((p) => p.id.toString() === form.productId) || null
      : null
  );

  let userOptions = $derived(
    (commercialUsersStore.data || []).map((u) => ({ value: u.id.toString(), label: u.name }))
  );

  let quoteOptions = $derived(
    (quotesStore.data?.data || []).map((q) => ({ value: q.id.toString(), label: q.reference }))
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

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!form.userId || !form.productId) {
      toast.error("Comercial e Produto são obrigatórios.");
      return;
    }
    isSubmitting = true;
    try {
      await onSave({
        userId: parseInt(form.userId),
        productId: parseInt(form.productId),
        variantId: form.variantId ? parseInt(form.variantId) : undefined,
        quantity: parseInt(form.quantity) || 1,
        message: form.message,
        status: parseInt(form.status),
        quoteId: form.quoteId ? parseInt(form.quoteId) : undefined,
      });
      onClose();
    } catch {
      toast.error("Erro ao guardar reserva.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if open}
  <AdminModal {open} {onClose} title={isEdit ? "Editar Reserva" : "Criar Nova Reserva"}>
    {#snippet footer()}
      <Button variant="outline" onclick={onClose} class="h-10 px-4">Cancelar</Button>
      <Button
        type="submit"
        form="reservation-form"
        class="h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold"
      >
        Salvar
      </Button>
    {/snippet}
    <form
      id="reservation-form"
      onsubmit={handleSubmit}
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <FormSelectField
        label="Comercial"
        id="res-comercial"
        bind:value={form.userId}
        options={userOptions}
        placeholder="Selecione um comercial"
      />
      <div class="flex flex-col gap-1.5">
        <label for="res-quote" class="text-xs font-semibold text-slate-600 dark:text-slate-400"
          >Orçamento</label
        >
        <SearchableSelect
          id="res-quote"
          bind:value={form.quoteId}
          options={quoteOptions}
          placeholder="Selecionar orçamento (opcional)"
          searchPlaceholder="Procurar por referência..."
          emptyMessage="Nenhum orçamento encontrado."
        />
      </div>
      <div class="flex flex-col gap-1.5 md:col-span-2">
        <label for="res-produto" class="text-xs font-semibold text-slate-600 dark:text-slate-400"
          >Selecionar Produto</label
        >
        <SearchableSelect
          id="res-produto"
          bind:value={form.productId}
          options={productOptions}
          disabled={isEdit}
          placeholder="Selecione o produto"
        />
      </div>
      {#if selectedProduct && selectedProduct.variants?.length > 0}
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label for="res-variant" class="text-xs font-semibold text-slate-600 dark:text-slate-400"
            >Variante (Cor / Tamanho)</label
          >
          <SearchableSelect
            id="res-variant"
            bind:value={form.variantId}
            options={variantOptions}
            disabled={isEdit}
            placeholder="Geral (Sem variante específica)"
          />
        </div>
      {/if}
      <FormField label="Quantidade" for="res-qty">
        <Input id="res-qty" type="number" required min="1" bind:value={form.quantity} />
      </FormField>
      <div class="flex flex-col gap-1.5 md:col-span-2">
        <label for="res-message" class="text-xs font-semibold text-slate-600 dark:text-slate-400"
          >Mensagem / Observações</label
        >
        <textarea
          id="res-message"
          bind:value={form.message}
          placeholder="Nota ou comentário da reserva..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]"
        ></textarea>
      </div>
      {#if isEdit}
        <FormSelectField
          label="Estado da Reserva"
          id="res-status"
          bind:value={form.status}
          options={[
            { value: "0", label: "Pendente" },
            { value: "1", label: "Confirmada" },
            { value: "2", label: "Cancelada" },
          ]}
          placeholder="Selecionar estado"
        />
      {/if}
    </form>
  </AdminModal>
{/if}
