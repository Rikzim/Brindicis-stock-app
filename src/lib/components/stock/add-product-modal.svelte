<script>
  import { X, Plus, Image, Loader2 } from "@/lib/utils/icon-map";
  import { createProduct, getFamilies } from "@/lib/utils/stock-api";
  import { createAsyncStore } from "@/lib/state/async-store.svelte";
  import { toast } from "svelte-sonner";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import FormField from "@/lib/components/ui/form-field.svelte";
  import SearchableSelect from "@/lib/components/ui/searchable-select.svelte";

  let {
    open = false,
    onClose = () => {},
    onSuccess = () => {},
    fornecedores = [],
  } = $props();

  const familiesStore = createAsyncStore(getFamilies);

  let isLoading = $state(false);
  let errors = $state({});

  let form = $state({
    type: "",
    familyId: "",
    name: "",
    description: "",
    ref: "",
    pc: "0",
    pvp: "0",
  });

  let variants = $state([
    createEmptyVariant(),
  ]);

  function createEmptyVariant() {
    return { color: "", cx: "", drawer: "", quantity: "0", images: [], previews: [] };
  }

  let familyOptions = $derived(
    (familiesStore.data || []).map((f) => ({ value: String(f.id), label: f.name }))
  );

  let fornecedorOptions = $derived(
    fornecedores.map((f) => ({ value: f, label: f }))
  );

  function addVariant() {
    variants = [...variants, createEmptyVariant()];
  }

  function removeVariant(index) {
    if (variants.length <= 1) return;
    revokePreviews(index);
    variants = variants.filter((_, i) => i !== index);
  }

  function revokePreviews(index) {
    for (const url of variants[index].previews) {
      URL.revokeObjectURL(url);
    }
  }

  function handleImageSelect(variantIndex, e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    revokePreviews(variantIndex);

    const newImages = [...variants[variantIndex].images, ...files];
    const newPreviews = files.map((f) => URL.createObjectURL(f));

    variants[variantIndex] = {
      ...variants[variantIndex],
      images: newImages,
      previews: [...variants[variantIndex].previews, ...newPreviews],
    };

    e.target.value = "";
  }

  function removeImage(variantIndex, imageIndex) {
    URL.revokeObjectURL(variants[variantIndex].previews[imageIndex]);
    variants[variantIndex] = {
      ...variants[variantIndex],
      images: variants[variantIndex].images.filter((_, i) => i !== imageIndex),
      previews: variants[variantIndex].previews.filter((_, i) => i !== imageIndex),
    };
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nome é obrigatório";
    if (!form.ref.trim()) errs.ref = "Referência é obrigatória";
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
      fd.append("familyId", form.familyId);
      fd.append("name", form.name.trim());
      fd.append("description", form.description);
      fd.append("ref", form.ref.trim());
      fd.append("pc", form.pc);
      fd.append("pvp", form.pvp);

      variants.forEach((v, i) => {
        fd.append(`variants[${i}][color]`, v.color);
        fd.append(`variants[${i}][cx]`, v.cx);
        fd.append(`variants[${i}][drawer]`, v.drawer);
        fd.append(`variants[${i}][quantity]`, v.quantity);
        for (const file of v.images) {
          fd.append(`variants[${i}][images]`, file);
        }
      });

      await createProduct(fd);
      toast.success("Produto adicionado com sucesso!");
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create product error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao adicionar produto.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    for (const v of variants) {
      revokePreviews(variants.indexOf(v));
    }
    form = { type: "", familyId: "", name: "", description: "", ref: "", pc: "0", pvp: "0" };
    variants = [createEmptyVariant()];
    errors = {};
  }

  function handleClose() {
    resetForm();
    onClose();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl border-2 border-slate-200 shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-700">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700 shrink-0">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Adicionar Produto</h3>
        <Button variant="ghost" size="icon" onclick={handleClose} class="size-7">
          <X class="size-4" />
        </Button>
      </div>

      <!-- Body -->
      <form id="add-product-form" onsubmit={handleSubmit} class="flex-1 overflow-y-auto px-6 py-5 space-y-0">

        <!-- Dados Gerais -->
        <div class="space-y-4 pb-5 border-b-2 border-slate-100 dark:border-slate-700">
          <span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">
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
        <div class="space-y-3 py-5 border-b-2 border-slate-100 dark:border-slate-700">
          <span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">
            Variantes
          </span>

          {#each variants as variant, i (i)}
            <div class="rounded-xl border-2 border-slate-100 bg-slate-50/50 p-4 space-y-3 dark:border-slate-700 dark:bg-slate-800/30 animate-in fade-in duration-200">
              <div class="flex items-center justify-between">
                {#if variants.length > 1}
                  <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Variante #{i + 1}
                  </span>
                {:else}
                  <span></span>
                {/if}
                {#if variants.length > 1}
                  <button
                    type="button"
                    onclick={() => removeVariant(i)}
                    class="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X class="size-4" />
                  </button>
                {/if}
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormField label="Cor" for="ap-vc-{i}" error={errors[`variant_${i}_color`]}>
                  <Input id="ap-vc-{i}" placeholder="Ex: Vermelho" bind:value={variant.color} />
                </FormField>
                <FormField label="Caixa" for="ap-vcx-{i}">
                  <Input id="ap-vcx-{i}" placeholder="CX" bind:value={variant.cx} />
                </FormField>
                <FormField label="Gaveta" for="ap-vd-{i}">
                  <Input id="ap-vd-{i}" placeholder="Gaveta" bind:value={variant.drawer} />
                </FormField>
                <FormField label="Quantidade" for="ap-vq-{i}">
                  <Input id="ap-vq-{i}" type="number" min="0" bind:value={variant.quantity} />
                </FormField>
              </div>

              <!-- Images -->
              <div class="space-y-2">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Imagens</span>
                <div class="flex flex-wrap gap-2">
                  {#each variant.previews as preview, imgIdx (imgIdx)}
                    <div class="relative group size-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={preview} alt="" class="size-full object-cover" />
                      <button
                        type="button"
                        onclick={() => removeImage(i, imgIdx)}
                        class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X class="size-4 text-white" />
                      </button>
                    </div>
                  {/each}
                  <label class="flex size-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-slate-600 dark:hover:border-amber-400">
                    <Image class="size-5 mb-0.5" />
                    <span class="text-[9px] font-bold">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      class="hidden"
                      onchange={(e) => handleImageSelect(i, e)}
                    />
                  </label>
                </div>
              </div>
            </div>
          {/each}

          <Button
            type="button"
            variant="outline"
            onclick={addVariant}
            class="w-full h-9 border-dashed border-2 border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 dark:border-slate-600 dark:text-slate-400"
          >
            <Plus class="size-4" />
            <span>Adicionar Cor</span>
          </Button>
        </div>

        <!-- Preço -->
        <div class="space-y-4 pt-5">
          <span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">
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
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-100 dark:border-slate-700 shrink-0">
        <Button variant="outline" onclick={handleClose} disabled={isLoading} class="h-10 px-4">
          Cancelar
        </Button>
        <Button
          type="submit"
          form="add-product-form"
          disabled={isLoading}
          class="h-10 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-5 font-semibold shadow-none"
        >
          {#if isLoading}
            <Loader2 class="animate-spin" />
          {/if}
          Adicionar Produto
        </Button>
      </div>
    </div>
  </div>
{/if}
