<script lang="ts">
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import { cn } from "$lib/utils";
  import { tick } from "svelte";
  import { portal } from "$lib/utils/portal";

  let {
    id = undefined,
    value = $bindable(""),
    options = [],
    placeholder = "Selecionar",
    searchPlaceholder = "Pesquisar...",
    emptyMessage = "Sem resultados.",
    class: className = "",
    disabled = false,
  } = $props();

  let open = $state(false);
  let search = $state("");
  let triggerEl = $state<HTMLDivElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let listStyle = $state("");
  let openUpward = $state(false);

  let selected = $derived(options.find((o) => o.value === value));

  let filteredOptions = $derived(
    search ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options
  );

  async function handleSelect(optValue) {
    value = optValue === value ? "" : optValue;
    open = false;
    search = "";
  }

  function updatePosition() {
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const dropdownH = Math.min(320, window.innerHeight * 0.6);
    const viewportH = window.innerHeight;
    const margin = 8;
    const spaceBelow = viewportH - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    openUpward = spaceBelow < dropdownH && spaceAbove > spaceBelow;
    const top = openUpward
      ? Math.max(margin, rect.top - dropdownH - 4)
      : Math.min(viewportH - dropdownH - margin, rect.bottom + 4);
    const width = rect.width;
    let left = rect.left;
    const minLeft = margin;
    const maxLeft = window.innerWidth - width - margin;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;
    listStyle = `position: fixed; top: ${top}px; left: ${left}px; width: ${width}px;`;
  }

  async function openDropdown() {
    if (disabled) return;
    open = true;
    search = "";
    await tick();
    updatePosition();
  }

  function closeDropdown() {
    open = false;
    search = "";
  }

  function handleClickOutside(e) {
    if (!open) return;
    if (triggerEl && triggerEl.contains(e.target)) return;
    if (listEl && listEl.contains(e.target)) return;
    closeDropdown();
  }
</script>

<svelte:window onclick={handleClickOutside} onresize={updatePosition} onscroll={updatePosition} />

<div class="relative" bind:this={triggerEl}>
  <button
    type="button"
    {id}
    {disabled}
    role="combobox"
    aria-expanded={open}
    aria-controls={id ? `${id}-listbox` : undefined}
    class={cn(
      "flex w-full min-w-0 shrink items-center justify-between overflow-hidden font-normal h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      !selected && "text-muted-foreground",
      className
    )}
    onclick={(e) => {
      e.stopPropagation();
      if (open) closeDropdown();
      else openDropdown();
    }}
  >
    <span class="truncate">{selected?.label ?? placeholder}</span>
    <ChevronsUpDown class="ml-1 size-4 shrink-0 opacity-50" />
  </button>
</div>

{#if open}
  <div
    use:portal
    bind:this={listEl}
    id={id ? `${id}-listbox` : undefined}
    role="listbox"
    style={listStyle}
    class="z-[200] rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden"
  >
    <div class="flex items-center border-b px-3">
      <input
        type="text"
        class="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        placeholder={searchPlaceholder}
        bind:value={search}
      />
    </div>
    <div class="max-h-[300px] overflow-y-auto p-1">
      {#if filteredOptions.length === 0}
        <div class="py-6 text-center text-sm">{emptyMessage}</div>
      {:else}
        {#each filteredOptions as opt (opt.value)}
          <button
            type="button"
            role="option"
            aria-selected={value === opt.value}
            class="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground"
            onclick={() => handleSelect(opt.value)}
          >
            <Check
              class={cn("size-4 shrink-0", value === opt.value ? "opacity-100" : "opacity-0")}
            />
            {opt.label}
          </button>
        {/each}
      {/if}
    </div>
  </div>
{/if}
