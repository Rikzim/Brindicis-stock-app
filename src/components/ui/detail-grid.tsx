import type { ReactNode } from "react";

type DetailItem = {
  label: string;
  value: ReactNode;
};

type DetailGridProps = {
  items: DetailItem[];
  columns?: 1 | 2;
};

export function DetailGrid({ items, columns = 2 }: DetailGridProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {items.map((item, i) => (
        <div key={`${item.label}-${i}`}>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
