import * as React from "react";
import { Loader2 } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  isLoading,
  loadingMessage = "A carregar...",
  emptyMessage = "Sem dados disponíveis.",
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
            <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-400 dark:text-slate-500">{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{emptyMessage}</span>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-slate-100 last:border-0 transition-colors dark:border-slate-800/60 ${onRowClick ? "cursor-pointer" : ""} hover:bg-slate-50/30 dark:hover:bg-slate-800/10 ${i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/20 dark:bg-slate-800/5"}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3 text-sm ${col.className ?? "text-slate-800 dark:text-slate-200"}`}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
