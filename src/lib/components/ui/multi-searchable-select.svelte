<script lang="ts">
  import { Check, ChevronsUpDown, X } from "lucide-svelte";
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

  let selectedValues = $derived(
    value
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : []
  );

  let selected = $derived(options.filter((o) => selectedValues.includes(o.value)));

  let filteredOptions = $derived(
    search ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options
  );

  function isSelected(optValue) {
    return selectedValues.includes(optValue);
  }

  async function handleToggle(optValue) {
    const current = new Set(selectedValues);
    if (current.has(optValue)) {
      current.delete(optValue);
    } else {
      current.add(optValue);
    }
    value = Array.from(current).join(",");
    search = "";
  }

  function removeValue(val) {
    const current = new Set(selectedValues);
    current.delete(val);
    value = Array.from(current).join(",");
  }

  function updatePosition() {
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const dropdownH = Math.min(320, window.innerHeight * 0.6);
    const viewportH = window.innerHeight;
    const margin = 8;
    const spaceBelow = viewportH - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUpward = spaceBelow < dropdownH && spaceAbove > spaceBelow;
    const top = openUpward
      ? Math.max(margin, rect.top - dropdownH - 4)
      : Math.min(viewportH - dropdownH - margin, rect.bottom + 4);
    const width = Math.max(rect.width, 200);
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
      "flex w-full min-w-0 shrink items-center justify-between gap-1 overflow-hidden font-normal h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onclick={(e) => {
      e.stopPropagation();
      if (open) closeDropdown();
      else openDropdown();
    }}
  >
    <div class="flex items-center gap-1 flex-1 min-w-0 truncate">
      {#if selected.length === 0}
        <span class="truncate">{placeholder}</span>
      {:else}
        {#each selected.slice(0, 2) as opt}
          <span
            class="inline-flex items-center gap-0.5 rounded bg-amber-100 dark:bg-amber-900/30 px-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 shrink-0"
          >
            {opt.label}
            <span
              role="button"
              tabindex="-1"
              onclick={(e) => {
                e.stopPropagation();
                removeValue(opt.value);
              }}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  removeValue(opt.value);
                }
              }}
              class="inline-flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800 rounded-sm cursor-pointer"
              aria-label={`Remover ${opt.label}`}
            >
              <X class="size-3" />
            </span>
          </span>
        {/each}
        {#if selected.length > 2}
          <span class="text-xs font-semibold text-slate-500 shrink-0">+{selected.length - 2}</span>
        {/if}
      {/if}
    </div>
    <ChevronsUpDown class="size-4 shrink-0 opacity-50" />
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
            aria-selected={isSelected(opt.value)}
            class="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground"
            onclick={() => handleToggle(opt.value)}
          >
            <div
              class={cn(
                "size-4 shrink-0 rounded border flex items-center justify-center transition-colors",
                isSelected(opt.value)
                  ? "bg-amber-400 border-amber-400 text-[#1F2937]"
                  : "border-slate-300 dark:border-slate-600"
              )}
            >
              {#if isSelected(opt.value)}
                <Check class="size-3" />
              {/if}
            </div>
            <span class="flex-1">{opt.label}</span>
          </button>
        {/each}
      {/if}
    </div>
  </div>
{/if}
