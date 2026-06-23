import { o as bind_props, e as ensure_array_like, a as attr_class, k as stringify, i as escape_html, b as attr, c as clsx, j as derived } from "./root.js";
import { L as Loader_circle, P as Pagination } from "./pagination.js";
import { c as cn } from "./button.js";
function Data_table($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      columns,
      data,
      isLoading = false,
      loadingMessage = "A carregar...",
      emptyMessage = "Sem dados disponíveis.",
      rowKey = (row) => row.id,
      onRowClick = void 0,
      pageSize = 25,
      showPagination = true,
      pageSizeOptions = [25, 50, 100, 250],
      cell = void 0,
      totalRows,
      page = 1,
      size = pageSize,
      onPageChange
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden flex flex-col flex-1 min-h-0"><div class="flex-1 overflow-y-auto overflow-x-auto min-h-0"><table class="w-full text-left border-collapse"><thead class="sticky top-0 z-10 bg-white dark:bg-slate-900"><tr class="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80"><!--[-->`);
      const each_array = ensure_array_like(columns);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let col = each_array[$$index];
        $$renderer3.push(`<th${attr_class(`px-3 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${stringify(col.headerClassName ?? "")}`)}>${escape_html(col.header)}</th>`);
      }
      $$renderer3.push(`<!--]--></tr></thead><tbody>`);
      if (isLoading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<tr><td${attr("colspan", columns.length)} class="px-6 py-16 text-center"><div class="flex flex-col items-center justify-center gap-2">`);
        Loader_circle($$renderer3, { class: "size-6 animate-spin text-amber-400" });
        $$renderer3.push(`<!----> <span class="text-sm text-slate-400 dark:text-slate-500">${escape_html(loadingMessage)}</span></div></td></tr>`);
      } else if (data.length === 0) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<tr><td${attr("colspan", columns.length)} class="px-6 py-24 text-center"><span class="text-sm font-medium text-slate-400 dark:text-slate-500">${escape_html(emptyMessage)}</span></td></tr>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let row = each_array_1[i];
          $$renderer3.push(`<tr${attr_class(`border-b border-slate-100 last:border-0 transition-colors dark:border-slate-800/60 ${onRowClick ? "cursor-pointer" : ""} hover:bg-slate-50/30 active:bg-slate-50/50 dark:hover:bg-slate-800/10 dark:active:bg-slate-800/20 ${i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/20 dark:bg-slate-800/5"}`)}${attr("role", onRowClick ? "button" : void 0)}${attr("tabindex", onRowClick ? 0 : void 0)}><!--[-->`);
          const each_array_2 = ensure_array_like(columns);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let col = each_array_2[$$index_1];
            $$renderer3.push(`<td${attr_class(`px-3 sm:px-5 py-3 text-sm ${stringify(col.className ?? "text-slate-800 dark:text-slate-200")}`)}>`);
            if (cell) {
              $$renderer3.push("<!--[0-->");
              cell($$renderer3, row, col);
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></td>`);
          }
          $$renderer3.push(`<!--]--></tr>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></tbody></table></div> `);
      if (showPagination) {
        $$renderer3.push("<!--[0-->");
        Pagination($$renderer3, {
          totalRows,
          pageSizeOptions,
          onPageChange,
          get page() {
            return page;
          },
          set page($$value) {
            page = $$value;
            $$settled = false;
          },
          get size() {
            return size;
          },
          set size($$value) {
            size = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { page, size });
  });
}
function Status_badge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { status = "", class: className = "" } = $$props;
    const statusStyles = {
      active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      ativo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      inativo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      pendente: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      rejeitado: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      reserved: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      reservado: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    };
    let key = derived(() => status?.toLowerCase().trim() || "");
    let style = derived(() => statusStyles[key()] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400");
    $$renderer2.push(`<span${attr_class(clsx(cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", style(), className)))}>${escape_html(status)}</span>`);
  });
}
export {
  Data_table as D,
  Status_badge as S
};
