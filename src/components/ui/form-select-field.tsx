import { SearchableSelect, type SelectOption } from "@/components/ui/searchable-select";
import { FormField } from "@/components/ui/form-field";

type FormSelectFieldProps = {
  label: string;
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function FormSelectField({ label, id, value, onValueChange, options, placeholder, disabled }: FormSelectFieldProps) {
  return (
    <FormField label={label} htmlFor={id}>
      <SearchableSelect id={id} value={value} onValueChange={onValueChange} options={options} placeholder={placeholder} disabled={disabled} />
    </FormField>
  );
}
