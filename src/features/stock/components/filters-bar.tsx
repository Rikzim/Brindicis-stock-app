import { SearchableSelect } from "@/components/ui/searchable-select";
import type { StockFamily } from "@/lib/stock-types";

type FiltersBarProps = {
  families: StockFamily[];
  availableColors: string[];
  availableSizes: string[];
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
};

const availabilityOptions = [
  { value: "Todas", label: "Todas" },
  { value: "Com Stock", label: "Com Stock" },
  { value: "Esgotado", label: "Esgotado" },
];

export function FiltersBar({
  families,
  availableColors,
  availableSizes,
  filters,
  onFilterChange,
}: FiltersBarProps) {
  const familyOptions = [
    { value: "Todas", label: "Todas" },
    ...families.map((f) => ({ value: f.name, label: f.name })),
  ];

  const colorOptions = [
    { value: "Todas", label: "Todas" },
    ...availableColors.map((c) => ({ value: c, label: c })),
  ];

  const sizeOptions = [
    { value: "Todas", label: "Todas" },
    ...availableSizes.map((s) => ({ value: s, label: s })),
  ];

  const setFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-slate-50 border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              Família
            </span>
            <SearchableSelect
              value={filters.familia || "Todas"}
              onValueChange={(v) => setFilter("familia", v)}
              options={familyOptions}
              placeholder="Todas"
              searchPlaceholder="Procurar família..."
              emptyMessage="Nenhuma família encontrada."
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              Disponibilidade
            </span>
            <SearchableSelect
              value={filters.disponibilidade || "Todas"}
              onValueChange={(v) => setFilter("disponibilidade", v)}
              options={availabilityOptions}
              placeholder="Todas"
              searchPlaceholder="Procurar..."
              emptyMessage="Nenhuma opção encontrada."
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              Cor
            </span>
            <SearchableSelect
              value={filters.cor || "Todas"}
              onValueChange={(v) => setFilter("cor", v)}
              options={colorOptions}
              placeholder="Todas"
              searchPlaceholder="Procurar cor..."
              emptyMessage="Nenhuma cor encontrada."
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              Tamanho
            </span>
            <SearchableSelect
              value={filters.tamanho || "Todas"}
              onValueChange={(v) => setFilter("tamanho", v)}
              options={sizeOptions}
              placeholder="Todas"
              searchPlaceholder="Procurar tamanho..."
              emptyMessage="Nenhum tamanho encontrado."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
