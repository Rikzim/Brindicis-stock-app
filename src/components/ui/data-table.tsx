import { useState, useMemo } from "react";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  pageSize?: number;
  showPagination?: boolean;
  pageSizeOptions?: number[];
};

export function DataTable<T>({
  columns,
  data,
  isLoading,
  loadingMessage = "A carregar...",
  emptyMessage = "Sem dados disponíveis.",
  rowKey,
  onRowClick,
  pageSize = 25,
  showPagination = true,
  pageSizeOptions = [25, 50, 100, 250],
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.length / size)), [data.length, size]);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const pageData = data.slice(start, start + size);

  const showBar = showPagination && !isLoading && data.length > 0;

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
              pageData.map((row, i) => (
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

      {showBar && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <select
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
              className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 dark:text-slate-500">linhas por página · {data.length} registos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
              Página {safePage} de {totalPages}
            </span>
            <Button variant="outline" size="icon" disabled={safePage <= 1} onClick={() => setPage(1)} className="size-7">
              <ChevronsLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="size-7">
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="size-7 bg-blue-600 text-white hover:bg-blue-700 border-none cursor-default text-xs font-bold">
              {safePage}
            </Button>
            <Button variant="outline" size="icon" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="size-7">
              <ChevronRight className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" disabled={safePage >= totalPages} onClick={() => setPage(totalPages)} className="size-7">
              <ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
