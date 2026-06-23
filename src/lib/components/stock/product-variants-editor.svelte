<script lang="ts">
  import { X, Plus } from "lucide-svelte";
  import AuthedImage from "$lib/components/ui/authed-image.svelte";
  import Button from "$lib/components/ui/button.svelte";

  type Props = {
    variants: any[];
    errors?: Record<string, string>;
    onAddVariant: () => void;
    onRemoveVariant: (index: number) => void;
    onAddSize: (variantIndex: number) => void;
    onRemoveSize: (variantIndex: number, sizeIndex: number) => void;
    onAddImage: (variantIndex: number, files: File[]) => void;
    onRemoveImage: (variantIndex: number, imageIndex: number) => void;
  };

  let {
    variants,
    errors = {},
    onAddVariant,
    onRemoveVariant,
    onAddSize,
    onRemoveSize,
    onAddImage,
    onRemoveImage,
  }: Props = $props();

  function handleImageSelect(variantIndex: number, e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;
    onAddImage(variantIndex, files);
    input.value = "";
  }
</script>

<div class="space-y-3 py-5 border-b-2 border-slate-100 dark:border-slate-700">
  <span
    class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400"
  >
    Variantes
  </span>

  {#each variants as variant, i (i)}
    <div
      class="rounded-xl border-2 border-slate-100 bg-slate-50/50 p-4 space-y-3 dark:border-slate-700 dark:bg-slate-800/30 animate-in fade-in duration-200"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Variante #{i + 1}</span>
        <button
          type="button"
          onclick={() => onRemoveVariant(i)}
          class="text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Remover variante"
        >
          <X class="size-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="flex flex-col gap-0.5">
          <label
            for={`ap-vc-${i}`}
            class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cor</label
          >
          <input
            id={`ap-vc-${i}`}
            placeholder="Ex: Vermelho"
            value={variant.color}
            oninput={(e) => (variant.color = (e.currentTarget as HTMLInputElement).value)}
            class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700 {errors[
              `variant_${i}_color`
            ]
              ? 'border-red-400'
              : ''}"
          />
          {#if errors[`variant_${i}_color`]}
            <span class="text-[10px] text-red-500 mt-0.5">{errors[`variant_${i}_color`]}</span>
          {/if}
        </div>
        <div class="flex flex-col gap-0.5">
          <label
            for={`ap-vcx-${i}`}
            class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Caixa</label
          >
          <input
            id={`ap-vcx-${i}`}
            placeholder="CX"
            value={variant.cx}
            oninput={(e) => (variant.cx = (e.currentTarget as HTMLInputElement).value)}
            class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          <label
            for={`ap-vd-${i}`}
            class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gaveta</label
          >
          <input
            id={`ap-vd-${i}`}
            placeholder="Gaveta"
            value={variant.drawer}
            oninput={(e) => (variant.drawer = (e.currentTarget as HTMLInputElement).value)}
            class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"
          />
        </div>
      </div>

      <div class="space-y-2">
        {#if variant.sizes.length > 0}
          <div class="space-y-1.5">
            {#each variant.sizes as size, si (si)}
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tam."
                  value={size.size}
                  oninput={(e) => (size.size = (e.currentTarget as HTMLInputElement).value)}
                  class="w-16 rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm text-center dark:border-slate-700"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Qtd"
                  value={size.quantity}
                  oninput={(e) => (size.quantity = (e.currentTarget as HTMLInputElement).value)}
                  class="w-20 rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm text-center dark:border-slate-700"
                />
                <button
                  type="button"
                  onclick={() => onRemoveSize(i, si)}
                  class="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remover tamanho"
                >
                  <X class="size-4" />
                </button>
              </div>
            {/each}
            <Button
              type="button"
              variant="outline"
              onclick={() => onAddSize(i)}
              class="h-7 text-xs gap-1"
            >
              <Plus class="size-3" />
              <span>Adicionar Tamanho</span>
            </Button>
          </div>
        {:else}
          <div class="flex flex-col gap-0.5">
            <label
              for={`ap-vq-${i}`}
              class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
              >Quantidade</label
            >
            <input
              id={`ap-vq-${i}`}
              type="number"
              min="0"
              value={variant.quantity}
              oninput={(e) => (variant.quantity = (e.currentTarget as HTMLInputElement).value)}
              class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"
            />
            <button
              type="button"
              onclick={() => onAddSize(i)}
              class="mt-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
            >
              <Plus class="size-3" />
              <span>Adicionar tamanhos</span>
            </button>
          </div>
        {/if}
      </div>

      <div class="space-y-2">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Imagens</span>
        <div class="flex flex-wrap gap-2">
          {#each variant.existingImages as url}
            <div
              class="size-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <AuthedImage path={url} width={200} alt="" class="size-full object-contain" />
            </div>
          {/each}
          {#each variant.previews as preview, imgIdx (imgIdx)}
            <div
              class="relative group size-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <img src={preview} alt="" class="size-full object-cover" />
              <button
                type="button"
                onclick={() => onRemoveImage(i, imgIdx)}
                class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover imagem"
              >
                <X class="size-4 text-white" />
              </button>
            </div>
          {/each}
          <label
            class="flex size-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-slate-600 dark:hover:border-amber-400"
          >
            <span class="text-[10px] font-bold">+</span>
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
    onclick={onAddVariant}
    class="w-full h-9 border-dashed border-2 border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 dark:border-slate-600 dark:text-slate-400"
  >
    <Plus class="size-4" />
    <span>Adicionar Cor</span>
  </Button>
</div>
