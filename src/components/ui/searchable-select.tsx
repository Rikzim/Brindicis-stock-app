import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  allowCustom?: boolean;
};

export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled,
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value) || null;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const matched = options.find((o) => o.label === e.target.value);
    if (matched) {
      onValueChange(matched.value === value ? "" : matched.value);
      setSearch("");
    } else {
      setSearch(e.target.value);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (!search && selectedOption) {
      setSearch("");
    }
  };

  const displayValue = focused ? search : (selectedOption?.label ?? "");

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleSelect}
        onFocus={() => { setFocused(true); setSearch(""); }}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal pr-8 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950 dark:hover:bg-slate-800/80",
          !selectedOption && !focused && "text-muted-foreground",
          className,
        )}
      />
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
      <datalist id="searchable-select-list">
        {options.map((opt) => (
          <option key={opt.value} value={opt.label} label={opt.label}>{opt.label}</option>
        ))}
      </datalist>
    </div>
  );
}
