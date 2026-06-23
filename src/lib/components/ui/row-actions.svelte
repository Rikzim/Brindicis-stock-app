<script lang="ts">
  import { Eye, Pencil, Trash2 } from "lucide-svelte";
  import Button from "./button.svelte";

  let {
    onView = undefined,
    onEdit = undefined,
    onDelete = undefined,
    viewLabel = "Ver",
    editLabel = "Editar",
    deleteLabel = "Eliminar",
  } = $props();
</script>

<div class="flex items-center justify-end gap-0.5 sm:gap-1">
  {#if onView}
    <Button
      variant="ghost"
      size="icon"
      onclick={onView}
      title={viewLabel}
      class="size-9 sm:size-8 text-amber-500 hover:text-amber-600"
    >
      <Eye class="size-4" />
    </Button>
  {/if}
  {#if onEdit}
    <Button
      variant="ghost"
      size="icon"
      onclick={onEdit}
      title={editLabel}
      class="size-9 sm:size-8 text-amber-500 hover:text-amber-600"
    >
      <Pencil class="size-4" />
    </Button>
  {/if}
  {#if onDelete}
    <Button
      variant="ghost"
      size="icon"
      onclick={onDelete}
      title={deleteLabel}
      class="size-9 sm:size-8 text-red-500 hover:text-red-600"
    >
      <Trash2 class="size-4" />
    </Button>
  {/if}
</div>
