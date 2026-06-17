<script>
  import { Check, ChevronsUpDown } from "@/lib/utils/icon-map";
  import { cn } from "@/lib/utils";
  import { fly } from "svelte/transition";

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
  let triggerEl = $state(null);

  let selected = $derived(options.find((o) => o.value === value));

  let filteredOptions = $derived(
    search
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase())
        )
      : options
  );

  function handleSelect(optValue) {
    value = optValue === value ? "" : optValue;
    open = false;
    search = "";
  }

  function handleClickOutside(e) {
    if (triggerEl && !triggerEl.contains(e.target)) {
      open = false;
      search = "";
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

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
      open = !open;
    }}
  >
    <span class="truncate">{selected?.label ?? placeholder}</span>
    <ChevronsUpDown class="ml-1 size-4 shrink-0 opacity-50" />
  </button>

  {#if open}
    <div
      id={id ? `${id}-listbox` : undefined}
      role="listbox"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
      transition:fly={{ y: -4, duration: 150 }}
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
                class={cn(
                  "size-4 shrink-0",
                  value === opt.value ? "opacity-100" : "opacity-0"
                )}
              />
              {opt.label}
            </button>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>
