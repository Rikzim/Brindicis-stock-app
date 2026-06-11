import * as React from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
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
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  disabled,
  allowCustom,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = React.useMemo(() => {
    let result = search
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

    if (allowCustom && search && !options.some((o) => o.label.toLowerCase() === search.toLowerCase())) {
      result = [{ value: search, label: search }, ...result];
    }

    return result;
  }, [options, search, allowCustom]);


  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  const selectedOption = options.find((o) => o.value === value) || (value ? { value, label: value } : undefined);

  const selectOption = (optionValue: string) => {
    onValueChange(optionValue === value ? "" : optionValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          selectOption(filteredOptions[highlightedIndex].value);
        }
        break;
    }
  };

  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);

  const handleTriggerClick = () => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setTriggerRect(rect);
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={handleTriggerClick}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950 dark:hover:bg-slate-800/80",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDownIcon
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open &&
        triggerRect &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            onKeyDown={handleKeyDown}
            style={{
              position: "fixed",
              top: `${triggerRect.bottom + 4}px`,
              left: `${triggerRect.left}px`,
              width: `${triggerRect.width}px`,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-850 dark:bg-slate-950"
          >
            <div className="flex items-center border-b border-slate-200 px-3 dark:border-slate-800">
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                      highlightedIndex === index &&
                        "bg-slate-100 dark:bg-slate-800",
                      value === option.value
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300",
                    )}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
