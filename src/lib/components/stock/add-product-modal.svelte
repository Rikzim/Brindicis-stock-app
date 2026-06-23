<script lang="ts">
  import { X, Plus, Loader2 } from "lucide-svelte";
  import { createProduct, updateProduct, getCategories, getFamilies } from "$lib/utils/stock-api";
  import { createAsyncStore } from "$lib/state/async-store.svelte";
  import { toast } from "svelte-sonner";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import FormField from "$lib/components/ui/form-field.svelte";
  import SearchableSelect from "$lib/components/ui/searchable-select.svelte";
  import ProductVariantsEditor from "./product-variants-editor.svelte";

  type VariantSize = { size: string; quantity: string; id: number | null };
  type Variant = {
    id: number | null;
    color: string;
    cx: string;
    drawer: string;
    quantity: string;
    reserved: string;
    sizes: VariantSize[];
    images: File[];
    previews: string[];
    existingImages: string[];
  };

  let {
    open = false,
    onClose = () => {},
    onSuccess = () => {},
    fornecedores = [] as string[],
    editProduct = null as Record<string, any> | null,
  }: {
    open?: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
    fornecedores?: string[];
    editProduct?: Record<string, any> | null;
  } = $props();

  const categoriesStore = createAsyncStore(getCategories);
  const familiesStore = createAsyncStore(getFamilies);

  $effect(() => {
    if (open || editProduct) {
      categoriesStore.refetch();
      familiesStore.refetch();
    }
  });

  let isLoading = $state(false);
  let errors = $state<Record<string, string>>({});

  let isEditMode = $derived(!!editProduct);

  $effect(() => {
    if (editProduct) {
      form = {
        type: editProduct.type || "",
        categoryId: String(editProduct.categoryId || ""),
        familyId: String(editProduct.familyId || ""),
        name: editProduct.name || "",
        description: editProduct.description || "",
        ref: editProduct.ref || "",
        pc: String(editProduct.pc || "0"),
        pvp: String(editProduct.pvp || "0"),
      };
      const byColor = new Map<string, any[]>();
      for (const v of editProduct.variants || []) {
        if (!byColor.has(v.color)) {
          byColor.set(v.color, []);
        }
        byColor.get(v.color)!.push(v);
      }
      const mapped: Variant[] = [];
      for (const [, group] of byColor) {
        const first = group[0];
        const images = (editProduct.images || [])
          .filter((img: any) => img.color === first.color)
          .map((img: any) => img.url);
        const hasSizes = group.some((g) => g.size !== null);
        if (hasSizes) {
          mapped.push({
            id: null,
            color: first.color,
            cx: first.cx,
            drawer: first.drawer,
            quantity: "0",
            reserved: "0",
            sizes: group.map((g) => ({ size: g.size, quantity: String(g.quantity), id: g.id })),
            images: [],
            previews: [],
            existingImages: images,
          });
        } else {
          mapped.push({
            id: first.id || null,
            color: first.color,
            cx: first.cx,
            drawer: first.drawer,
            quantity: String(first.quantity),
            reserved: String(first.reserved),
            sizes: [],
            images: [],
            previews: [],
            existingImages: images,
          });
        }
      }
      variants = mapped.length > 0 ? mapped : [createEmptyVariant()];
      deletedVariantIds = [];
      errors = {};
    }
  });

  let form = $state({
    type: "",
    categoryId: "",
    familyId: "",
    name: "",
    description: "",
    ref: "",
    pc: "0",
    pvp: "0",
  });

  let variants = $state<Variant[]>([createEmptyVariant()]);
  let deletedVariantIds = $state<number[]>([]);
  let deletedSizes = $state<{ color: string; size: string }[]>([]);

  function createEmptyVariant(): Variant {
    return {
      id: null,
      color: "",
      cx: "",
      drawer: "",
      quantity: "0",
      reserved: "0",
      sizes: [],
      images: [],
      previews: [],
      existingImages: [],
    };
  }

  let familyOptions = $derived(
    (familiesStore.data || []).map((f) => ({ value: String(f.id), label: f.name }))
  );

  let fornecedorOptions = $derived(
    fornecedores.filter((f) => f !== "Todas").map((f) => ({ value: f, label: f }))
  );

  let categoryOptions = $derived(
    (categoriesStore.data || []).map((c) => ({ value: String(c.id), label: c.name }))
  );

  function addVariant() {
    variants = [...variants, createEmptyVariant()];
  }

  function removeVariant(index) {
    const v = variants[index];
    if (v.id) deletedVariantIds = [...deletedVariantIds, v.id];
    revokePreviews(index);
    variants = variants.filter((_, i) => i !== index);
  }

  function addSize(variantIndex) {
    variants = variants.map((v, i) =>
      i === variantIndex ? { ...v, sizes: [...v.sizes, { size: "", quantity: "0", id: null }] } : v
    );
  }

  function removeSize(variantIndex, sizeIndex) {
    const size = variants[variantIndex].sizes[sizeIndex];
    if (size.id) {
      deletedSizes = [...deletedSizes, { color: variants[variantIndex].color, size: size.size }];
    }
    variants = variants.map((v, i) =>
      i === variantIndex ? { ...v, sizes: v.sizes.filter((_, j) => j !== sizeIndex) } : v
    );
  }

  function revokePreviews(index) {
    for (const url of variants[index].previews) {
      URL.revokeObjectURL(url);
    }
  }

  function addImage(variantIndex: number, files: File[]) {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    variants = variants.map((v, i) =>
      i === variantIndex
        ? {
            ...v,
            images: [...v.images, ...files],
            previews: [...v.previews, ...newPreviews],
          }
        : v
    );
  }

  function removeImage(variantIndex: number, imageIndex: number) {
    URL.revokeObjectURL(variants[variantIndex].previews[imageIndex]);
    variants = variants.map((v, i) =>
      i === variantIndex
        ? {
            ...v,
            images: v.images.filter((_, j) => j !== imageIndex),
            previews: v.previews.filter((_, j) => j !== imageIndex),
          }
        : v
    );
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nome é obrigatório";
    if (!form.ref.trim()) errs.ref = "Referência é obrigatória";
    if (!form.categoryId) errs.categoryId = "Categoria é obrigatória";
    if (!form.familyId) errs.familyId = "Família é obrigatória";

    variants.forEach((v, i) => {
      if (!v.color.trim()) errs[`variant_${i}_color`] = "Cor é obrigatória";
    });

    errors = errs;
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    isLoading = true;
    try {
      const fd = new FormData();
      fd.append("type", form.type);
      fd.append("categoryId", form.categoryId);
      fd.append("familyId", form.familyId);
      fd.append("name", form.name.trim());
      fd.append("description", form.description);
      fd.append("ref", form.ref.trim());
      fd.append("pc", form.pc);
      fd.append("pvp", form.pvp);

      if (!isEditMode && variants.length > 0) {
        fd.append("drawer", variants[0].drawer || "");
        fd.append("cx", variants[0].cx || "");
      }

      if (isEditMode && deletedVariantIds.length > 0) {
        fd.append("variantsToDelete", JSON.stringify(deletedVariantIds));
      }
      if (isEditMode && deletedSizes.length > 0) {
        fd.append("sizesToDelete", JSON.stringify(deletedSizes));
      }

      variants.forEach((v, i) => {
        fd.append(`variants[${i}][color]`, v.color);
        fd.append(`variants[${i}][cx]`, v.cx);
        fd.append(`variants[${i}][drawer]`, v.drawer);
        fd.append(`variants[${i}][reserved]`, v.reserved);
        if (v.sizes.length > 0) {
          v.sizes.forEach((s, j) => {
            if (s.id) fd.append(`variants[${i}][sizes][${j}][id]`, String(s.id));
            fd.append(`variants[${i}][sizes][${j}][size]`, s.size);
            fd.append(`variants[${i}][sizes][${j}][quantity]`, s.quantity);
          });
        } else {
          if (v.id) fd.append(`variants[${i}][id]`, String(v.id));
          fd.append(`variants[${i}][quantity]`, v.quantity);
        }
        for (const file of v.images) {
          fd.append(`variants[${i}][images]`, file);
        }
      });

      if (isEditMode && editProduct) {
        await updateProduct(editProduct.id, fd);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduct(fd);
        toast.success("Produto adicionado com sucesso!");
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Product save error:", err);
      console.error("Response data:", err?.response?.data);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        (isEditMode ? "Erro ao atualizar produto." : "Erro ao adicionar produto.");
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    variants.forEach((_, i) => revokePreviews(i));
    form = {
      type: "",
      categoryId: "",
      familyId: "",
      name: "",
      description: "",
      ref: "",
      pc: "0",
      pvp: "0",
    };
    variants = [createEmptyVariant()];
    deletedVariantIds = [];
    deletedSizes = [];
    errors = {};
  }

  function handleClose() {
    resetForm();
    onClose();
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") handleClose();
  }}
/>

{#if open}
  {#if isEditMode && !editProduct}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="flex items-center justify-center p-8 bg-white rounded-2xl dark:bg-slate-900">
        <Loader2 class="animate-spin size-8 text-slate-400" />
      </div>
    </div>
  {:else}
    <div
      class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/30 animate-in fade-in duration-200"
      onclick={handleClose}
      onkeydown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-modal-title"
      tabindex="-1"
    >
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        class="bg-white rounded-none sm:rounded-2xl border-0 sm:border-2 border-slate-200 shadow-lg w-full sm:max-w-2xl sm:mx-4 sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 sm:dark:border-slate-700"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="document"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"
        >
          <h3
            id="add-product-modal-title"
            class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100"
          >
            {isEditMode ? "Editar Produto" : "Adicionar Produto"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onclick={handleClose}
            class="size-10"
            aria-label="Fechar"
          >
            <X class="size-4" />
          </Button>
        </div>

        <!-- Body -->
        <form
          id="add-product-form"
          onsubmit={handleSubmit}
          class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-0"
        >
          <!-- Dados Gerais -->
          <div class="space-y-4 pb-5 border-b-2 border-slate-100 dark:border-slate-700">
            <span
              class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400"
            >
              Dados Gerais
            </span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Fornecedor" for="ap-type">
                <SearchableSelect
                  id="ap-type"
                  bind:value={form.type}
                  options={fornecedorOptions}
                  placeholder="Selecione um Fornecedor"
                  searchPlaceholder="Procurar fornecedor..."
                  emptyMessage="Nenhum fornecedor encontrado."
                />
              </FormField>
              <FormField label="Categoria" for="ap-category" error={errors.categoryId}>
                <SearchableSelect
                  id="ap-category"
                  bind:value={form.categoryId}
                  options={categoryOptions}
                  placeholder="Selecione uma Categoria"
                />
              </FormField>
              <FormField label="Família" for="ap-family" error={errors.familyId}>
                <SearchableSelect
                  id="ap-family"
                  bind:value={form.familyId}
                  options={familyOptions}
                  placeholder="Selecione uma Família"
                />
              </FormField>
              <FormField label="Nome" for="ap-name" error={errors.name}>
                <Input id="ap-name" placeholder="Nome do produto" bind:value={form.name} />
              </FormField>
              <FormField label="Referência" for="ap-ref" error={errors.ref}>
                <Input id="ap-ref" placeholder="Ex: REF-001" bind:value={form.ref} />
              </FormField>
            </div>
            <FormField label="Descrição" for="ap-desc">
              <textarea
                id="ap-desc"
                rows="3"
                placeholder="Descrição do produto..."
                bind:value={form.description}
                class="flex w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 resize-none"
              ></textarea>
            </FormField>
          </div>

          <!-- Variantes -->
          <ProductVariantsEditor
            {variants}
            {errors}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
            onAddSize={addSize}
            onRemoveSize={removeSize}
            onAddImage={addImage}
            onRemoveImage={removeImage}
          />

          <!-- Preço -->
          <div class="space-y-4 pt-5">
            <span
              class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400"
            >
              Preço
            </span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="P. Custo (€)" for="ap-pc">
                <Input id="ap-pc" type="number" step="0.01" min="0" bind:value={form.pc} />
              </FormField>
              <FormField label="PVP (€)" for="ap-pvp">
                <Input id="ap-pvp" type="number" step="0.01" min="0" bind:value={form.pvp} />
              </FormField>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div
          class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-slate-100 dark:border-slate-700 shrink-0 pb-safe"
        >
          <Button
            variant="outline"
            onclick={handleClose}
            disabled={isLoading}
            class="h-12 sm:h-10 px-4"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="add-product-form"
            disabled={isLoading}
            class="h-12 sm:h-10 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-5 font-semibold shadow-none"
          >
            {#if isLoading}
              <Loader2 class="animate-spin" />
            {/if}
            {isEditMode ? "Salvar Alterações" : "Adicionar Produto"}
          </Button>
        </div>
      </div>
    </div>
  {/if}
{/if}
