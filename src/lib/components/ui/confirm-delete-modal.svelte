<script>
  import { AlertTriangle } from "@/lib/utils/icon-map";
  import Button from "./button.svelte";
  import AdminModal from "./admin-modal.svelte";

  let {
    open = false,
    onClose,
    onConfirm,
    title = "",
    itemName = "",
  } = $props();
</script>

<AdminModal {open} {onClose} {title}>
  {#snippet footer()}
    <Button variant="outline" onclick={onClose} class="h-10 px-4 rounded-lg text-sm font-medium">Cancelar</Button>
    <Button onclick={onConfirm} class="h-10 bg-red-600 hover:bg-red-700 text-white px-5 rounded-lg text-sm font-medium shadow-none">Eliminar</Button>
  {/snippet}

  <div class="flex flex-col items-center text-center gap-4">
    <div class="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
      <AlertTriangle class="size-6" />
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400">
      Tem a certeza que deseja eliminar <strong class="text-slate-800 dark:text-slate-100 font-bold">{itemName}</strong>? Esta ação não pode ser desfeita.
    </p>
  </div>
</AdminModal>
