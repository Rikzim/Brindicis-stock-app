<script>
  import SearchableSelect from "./searchable-select.svelte";

  let {
    label = "",
    value = $bindable(""),
    options = [],
    placeholder = undefined,
  } = $props();

  let id = $state(`filter-${Math.random().toString(36).slice(2, 9)}`);
</script>

<div class="flex flex-col gap-1.5">
  <label for={id} class="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
  <SearchableSelect
    {id}
    bind:value
    {options}
    placeholder={placeholder ?? label}
  />
</div>
