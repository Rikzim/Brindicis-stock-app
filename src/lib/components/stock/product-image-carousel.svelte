<script lang="ts">
  import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-svelte";
  import AuthedImage from "$lib/components/ui/authed-image.svelte";

  type Props = {
    images: Array<{ id?: number; url: string; color: string }>;
    name: string;
    size?: "square" | "compact";
  };

  let { images, name, size = "square" }: Props = $props();

  let index = $state(0);
  let currentImage = $derived(images[index] ?? null);
  let hasMultiple = $derived(images.length > 1);

  function goPrev() {
    if (!hasMultiple) return;
    index = (index - 1 + images.length) % images.length;
  }
  function goNext() {
    if (!hasMultiple) return;
    index = (index + 1) % images.length;
  }
</script>

<div
  class="relative {size === 'square'
    ? 'aspect-square min-w-[130px] w-[150px] h-[150px]'
    : 'w-full'} bg-slate-100 border-r border-slate-200 dark:bg-slate-950 dark:border-slate-700 overflow-hidden"
>
  {#if currentImage}
    <AuthedImage
      path={currentImage.url}
      width={400}
      alt={name}
      class="size-full {size === 'square' ? 'object-cover' : 'object-contain'}"
    />
  {:else}
    <div class="size-full flex items-center justify-center">
      <ImageIcon class="text-slate-300 size-9 dark:text-slate-600" />
      <span
        class="text-[9px] font-bold text-slate-600 tracking-wider absolute bottom-2 dark:text-slate-600"
        >SEM IMAGEM</span
      >
    </div>
  {/if}

  {#if hasMultiple}
    <div class="absolute left-1 top-1/2 -translate-y-1/2 z-10">
      <button
        type="button"
        onclick={goPrev}
        aria-label="Imagem anterior"
        class="size-6 opacity-80 hover:opacity-100 bg-secondary text-secondary-foreground rounded-md shadow-xs inline-flex items-center justify-center"
      >
        <ChevronLeft class="size-3.5" />
      </button>
    </div>
    <div class="absolute right-1 top-1/2 -translate-y-1/2 z-10">
      <button
        type="button"
        onclick={goNext}
        aria-label="Próxima imagem"
        class="size-6 opacity-80 hover:opacity-100 bg-secondary text-secondary-foreground rounded-md shadow-xs inline-flex items-center justify-center"
      >
        <ChevronRight class="size-3.5" />
      </button>
    </div>
    <div class="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-10">
      {#each images as _, i}
        <div
          class="size-1.5 rounded-full transition-all duration-300 {i === index
            ? 'bg-amber-400 dark:bg-amber-400 w-3'
            : 'bg-slate-300 dark:bg-slate-700'}"
        ></div>
      {/each}
    </div>
  {/if}
</div>
