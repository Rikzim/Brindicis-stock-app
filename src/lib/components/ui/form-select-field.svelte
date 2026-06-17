<script>
  import SearchableSelect from "./searchable-select.svelte";
  import FormField from "./form-field.svelte";

  let {
    label = "",
    id = undefined,
    value = $bindable(""),
    options = [],
    placeholder = undefined,
    disabled = false,
  } = $props();
</script>

<FormField {label} for={id}>
  <SearchableSelect
    {id}
    bind:value
    {options}
    {placeholder}
    {disabled}
  />
</FormField>
