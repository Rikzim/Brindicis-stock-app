import { SearchableSelect, type SelectOption } from "@/components/ui/searchable-select";

type FilterSelectFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
};

export function FilterSelectField({ label, value, onValueChange, options, placeholder }: FilterSelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      <SearchableSelect value={value} onValueChange={onValueChange} options={options} placeholder={placeholder ?? label} />
    </div>
  );
}
