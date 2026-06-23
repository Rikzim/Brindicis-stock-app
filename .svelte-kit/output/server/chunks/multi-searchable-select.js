import { b as attr, a as attr_class, c as clsx, i as escape_html, e as ensure_array_like, o as bind_props, j as derived } from "./root.js";
import { c as cn } from "./button.js";
import { X } from "./x.js";
import { b as Chevrons_up_down } from "./url-sync.svelte.js";
function Multi_searchable_select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = void 0,
      value = "",
      options = [],
      placeholder = "Selecionar",
      searchPlaceholder = "Pesquisar...",
      emptyMessage = "Sem resultados.",
      class: className = "",
      disabled = false
    } = $$props;
    let open = false;
    let selectedValues = derived(() => value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);
    let selected = derived(() => options.filter((o) => selectedValues().includes(o.value)));
    $$renderer2.push(`<div class="relative"><button type="button"${attr("id", id)}${attr("disabled", disabled, true)} role="combobox"${attr("aria-expanded", open)}${attr("aria-controls", id ? `${id}-listbox` : void 0)}${attr_class(clsx(cn("flex w-full min-w-0 shrink items-center justify-between gap-1 overflow-hidden font-normal h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)))}><div class="flex items-center gap-1 flex-1 min-w-0 truncate">`);
    if (selected().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="truncate">${escape_html(placeholder)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(selected().slice(0, 2));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let opt = each_array[$$index];
        $$renderer2.push(`<span class="inline-flex items-center gap-0.5 rounded bg-amber-100 dark:bg-amber-900/30 px-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 shrink-0">${escape_html(opt.label)} <span role="button" tabindex="-1" class="inline-flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800 rounded-sm cursor-pointer"${attr("aria-label", `Remover ${opt.label}`)}>`);
        X($$renderer2, { class: "size-3" });
        $$renderer2.push(`<!----></span></span>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (selected().length > 2) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-xs font-semibold text-slate-500 shrink-0">+${escape_html(selected().length - 2)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    Chevrons_up_down($$renderer2, { class: "size-4 shrink-0 opacity-50" });
    $$renderer2.push(`<!----></button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
export {
  Multi_searchable_select as M
};
