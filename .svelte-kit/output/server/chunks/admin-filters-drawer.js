import { i as escape_html } from "./root.js";
import "clsx";
import { B as Button } from "./button.js";
import { P as Page_card } from "./page-card.js";
import { F as Funnel, C as Chevron_down } from "./funnel.js";
function Admin_filters_drawer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      title = "",
      activeCount = 0,
      hasPendingChanges = false,
      onApply = () => {
      },
      onClear = () => {
      },
      children
    } = $$props;
    $$renderer2.push(`<button type="button" class="lg:hidden flex w-full items-center justify-between gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] transition-all min-h-touch dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Abrir filtros"><span class="flex items-center gap-2">`);
    Funnel($$renderer2, { class: "size-4 text-slate-500 dark:text-slate-400" });
    $$renderer2.push(`<!----> <span class="truncate">${escape_html(title)}</span> `);
    if (activeCount > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-extrabold text-[#1F2937]">${escape_html(activeCount)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></span> `);
    Chevron_down($$renderer2, { class: "size-4 text-slate-400 shrink-0" });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="hidden lg:block">`);
    Page_card($$renderer2, {
      class: "p-2.5 sm:p-3 flex flex-col gap-1.5 shrink-0",
      children: ($$renderer3) => {
        $$renderer3.push(`<h1 class="text-sm sm:text-base font-bold text-slate-800 dark:text-white">${escape_html(title)}</h1> <div class="flex flex-col gap-1.5 sm:gap-2">`);
        children?.($$renderer3);
        $$renderer3.push(`<!----></div> <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60"><div class="flex items-center gap-2">`);
        if (activeCount > 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<span class="text-[11px] text-slate-500 dark:text-slate-400">${escape_html(activeCount)}
            ${escape_html(activeCount === 1 ? "filtro ativo" : "filtros ativos")}</span> <button type="button" class="text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 min-h-touch inline-flex items-center">Limpar</button>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<span class="text-[11px] text-slate-400 dark:text-slate-500">Nenhum filtro ativo</span>`);
        }
        $$renderer3.push(`<!--]--> `);
        if (hasPendingChanges) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"><span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span> Alterações por aplicar</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        Button($$renderer3, {
          type: "button",
          onclick: onApply,
          disabled: !hasPendingChanges,
          class: "h-8 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-3 rounded-lg text-xs font-semibold shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Aplicar`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  Admin_filters_drawer as A
};
