import { m as sanitize_props, f as spread_props, n as slot, o as bind_props, i as escape_html, j as derived, a as attr_class, c as clsx, e as ensure_array_like, k as stringify, p as store_get, u as unsubscribe_stores } from "../../../chunks/root.js";
import { F as File_text, a as Shield_check, S as Stock_navbar, s as settingsStore } from "../../../chunks/stock-navbar.js";
import { S as Searchable_select, P as Plus, C as Confirm_delete_modal, g as getNumberParam, a as getStringParam } from "../../../chunks/url-sync.svelte.js";
import { M as Multi_searchable_select } from "../../../chunks/multi-searchable-select.js";
import { B as Button, c as cn } from "../../../chunks/button.js";
import "clsx";
import { F as Funnel, C as Chevron_down } from "../../../chunks/funnel.js";
import { X } from "../../../chunks/x.js";
import { A as Authed_image } from "../../../chunks/authed-image.js";
import { P as Package } from "../../../chunks/package.js";
import { L as Loader_circle, P as Pagination, i as deleteReservation, C as Chevron_left, l as Chevron_right, m as getProductById, k as getProductsPaginated } from "../../../chunks/pagination.js";
import "../../../chunks/api-client.js";
import "../../../chunks/auth-store.js";
import { I as Input } from "../../../chunks/input.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { a as toast } from "../../../chunks/toast-state.svelte.js";
import { c as createDebounced } from "../../../chunks/debounce.svelte.js";
function Calendar($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.511.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "M3 10h18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calendar" },
    $$sanitized_props,
    {
      /**
       * @component @name Calendar
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/calendar
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Image($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.511.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["circle", { "cx": "9", "cy": "9", "r": "2" }],
    ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
  ];
  Icon($$renderer, spread_props([
    { name: "image" },
    $$sanitized_props,
    {
      /**
       * @component @name Image
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Info($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.511.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function createAsyncStore(fetcher) {
  let data = null;
  let isLoading = true;
  let error = null;
  return {
    get data() {
      return data;
    },
    get isLoading() {
      return isLoading;
    },
    get error() {
      return error;
    },
    refetch() {
    }
  };
}
function Filters_bar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      families = [],
      availableColors = [],
      availableSizes = [],
      pendingFilters = {
        familia: "Todas",
        disponibilidade: "Todas",
        cor: "",
        tamanho: ""
      },
      onApply = () => {
      },
      onClear = () => {
      },
      hasPendingChanges = false,
      activeCount = 0
    } = $$props;
    const availabilityOptions = [
      { value: "Todas", label: "Todas" },
      { value: "Com Stock", label: "Com Stock" },
      { value: "Esgotado", label: "Esgotado" }
    ];
    let familyOptions = derived(() => families.map((f) => ({ value: f.name, label: f.name })));
    let colorOptions = derived(() => availableColors.map((c) => ({ value: c, label: c })));
    let sizeOptions = derived(() => availableSizes.map((s) => ({ value: s, label: s })));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="hidden lg:block bg-slate-50 border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-300"><div class="px-4 sm:px-6 py-2"><div class="flex flex-col lg:flex-row lg:items-end gap-2"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 min-w-0"><div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">Família</span> `);
      Multi_searchable_select($$renderer3, {
        options: familyOptions(),
        placeholder: "Todas",
        searchPlaceholder: "Procurar família...",
        emptyMessage: "Nenhuma família encontrada.",
        class: "h-8",
        get value() {
          return pendingFilters.familia;
        },
        set value($$value) {
          pendingFilters.familia = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">Disponibilidade</span> `);
      Searchable_select($$renderer3, {
        options: availabilityOptions,
        placeholder: "Todas",
        searchPlaceholder: "Procurar...",
        emptyMessage: "Nenhuma opção encontrada.",
        class: "h-8",
        get value() {
          return pendingFilters.disponibilidade;
        },
        set value($$value) {
          pendingFilters.disponibilidade = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">Cor</span> `);
      Multi_searchable_select($$renderer3, {
        options: colorOptions(),
        placeholder: "Todas",
        searchPlaceholder: "Procurar cor...",
        emptyMessage: "Nenhuma cor encontrada.",
        class: "h-8",
        get value() {
          return pendingFilters.cor;
        },
        set value($$value) {
          pendingFilters.cor = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">Tamanho</span> `);
      Multi_searchable_select($$renderer3, {
        options: sizeOptions(),
        placeholder: "Todos",
        searchPlaceholder: "Procurar tamanho...",
        emptyMessage: "Nenhum tamanho encontrado.",
        class: "h-8",
        get value() {
          return pendingFilters.tamanho;
        },
        set value($$value) {
          pendingFilters.tamanho = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="flex items-center gap-2 shrink-0"><div class="flex items-center gap-2">`);
      if (activeCount > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">${escape_html(activeCount)}
              ${escape_html(activeCount === 1 ? "filtro ativo" : "filtros ativos")}</span> <button type="button" class="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 min-h-touch inline-flex items-center">Limpar</button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<span class="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">Nenhum filtro ativo</span>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (hasPendingChanges) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<span class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap"><span class="size-1.5 rounded-full bg-amber-500 animate-pulse"></span> Alterações por aplicar</span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      Button($$renderer3, {
        type: "button",
        onclick: onApply,
        disabled: !hasPendingChanges,
        class: "h-8 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-4 rounded-lg text-xs font-semibold shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
        children: ($$renderer4) => {
          $$renderer4.push(`<span>Aplicar Filtros</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { pendingFilters });
  });
}
function Filters_trigger($$renderer, $$props) {
  let { activeCount = 0 } = $$props;
  $$renderer.push(`<button type="button" class="lg:hidden flex w-full items-center justify-between gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] transition-all min-h-touch dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Abrir filtros"><span class="flex items-center gap-2">`);
  Funnel($$renderer, { class: "size-4 text-slate-500 dark:text-slate-400" });
  $$renderer.push(`<!----> <span>Filtros</span> `);
  if (activeCount > 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-extrabold text-[#1F2937]">${escape_html(activeCount)}</span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></span> `);
  Chevron_down($$renderer, { class: "size-4 text-slate-400" });
  $$renderer.push(`<!----></button>`);
}
function Mobile_filters_sheet($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      pendingFilters = { familia: "", disponibilidade: "Todas", cor: "", tamanho: "" },
      families = [],
      availableColors = [],
      availableSizes = [],
      onApply = () => {
      },
      onClear = () => {
      }
    } = $$props;
    const availabilityOptions = [
      { value: "Todas", label: "Todas" },
      { value: "Com Stock", label: "Com Stock" },
      { value: "Esgotado", label: "Esgotado" }
    ];
    let familyOptions = derived(() => families.map((f) => ({ value: f.name, label: f.name })));
    let colorOptions = derived(() => availableColors.map((c) => ({ value: c, label: c })));
    let sizeOptions = derived(() => availableSizes.map((s) => ({ value: s, label: s })));
    let activeCount = derived(() => (pendingFilters.familia ? 1 : 0) + (pendingFilters.disponibilidade !== "Todas" ? 1 : 0) + (pendingFilters.cor ? 1 : 0) + (pendingFilters.tamanho ? 1 : 0));
    function close() {
      open = false;
    }
    function apply() {
      onApply();
      close();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (open) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button type="button" class="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-default" aria-label="Fechar filtros"></button> <div class="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl flex flex-col max-h-[85dvh] pb-safe" role="dialog" aria-modal="true" aria-label="Filtros" tabindex="-1"><div class="flex flex-col items-center pt-2 pb-1 shrink-0"><div class="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div></div> <div class="flex items-center justify-between px-4 py-2 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"><h3 class="text-base font-bold text-slate-800 dark:text-slate-100">Filtros</h3> <div class="flex items-center gap-2">`);
        if (activeCount() > 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<button type="button" class="text-xs font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded min-h-touch dark:text-amber-400">Limpar</button>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          variant: "ghost",
          size: "icon",
          onclick: close,
          class: "size-10",
          "aria-label": "Fechar",
          children: ($$renderer4) => {
            X($$renderer4, { class: "size-4" });
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div> <div class="flex-1 overflow-y-auto px-4 py-4"><div class="grid grid-cols-2 gap-3"><div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Família</span> `);
        Multi_searchable_select($$renderer3, {
          options: familyOptions(),
          placeholder: "Todas",
          searchPlaceholder: "Procurar família...",
          emptyMessage: "Nenhuma família encontrada.",
          get value() {
            return pendingFilters.familia;
          },
          set value($$value) {
            pendingFilters.familia = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Disponibilidade</span> `);
        Searchable_select($$renderer3, {
          options: availabilityOptions,
          placeholder: "Todas",
          searchPlaceholder: "Procurar...",
          emptyMessage: "Nenhuma opção encontrada.",
          get value() {
            return pendingFilters.disponibilidade;
          },
          set value($$value) {
            pendingFilters.disponibilidade = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Cor</span> `);
        Multi_searchable_select($$renderer3, {
          options: colorOptions(),
          placeholder: "Todas",
          searchPlaceholder: "Procurar cor...",
          emptyMessage: "Nenhuma cor encontrada.",
          get value() {
            return pendingFilters.cor;
          },
          set value($$value) {
            pendingFilters.cor = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="flex flex-col"><span class="text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">Tamanho</span> `);
        Multi_searchable_select($$renderer3, {
          options: sizeOptions(),
          placeholder: "Todos",
          searchPlaceholder: "Procurar tamanho...",
          emptyMessage: "Nenhum tamanho encontrado.",
          get value() {
            return pendingFilters.tamanho;
          },
          set value($$value) {
            pendingFilters.tamanho = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div></div></div> <div class="flex items-center gap-3 px-4 py-3 border-t-2 border-slate-100 dark:border-slate-700 shrink-0">`);
        Button($$renderer3, {
          onclick: apply,
          class: "flex-1 h-12 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Aplicar`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { open, pendingFilters });
  });
}
function Product_card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      name = "",
      reference = "",
      quantity = 0,
      colors = void 0,
      image = void 0,
      isSelected = false
    } = $$props;
    $$renderer2.push(`<button type="button"${attr_class(clsx(cn("flex items-stretch rounded-2xl text-left w-full transition-all duration-200 border-2 animate-in fade-in duration-200 overflow-hidden cursor-pointer", isSelected ? "border-amber-400 shadow-md dark:border-amber-400" : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:hover:border-slate-600")))}><div class="relative w-[80px] sm:w-[90px] shrink-0 bg-slate-50 border-r border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500 overflow-hidden"><div class="relative w-full" style="aspect-ratio: 1/1">`);
    if (image) {
      $$renderer2.push("<!--[0-->");
      Authed_image($$renderer2, {
        path: image,
        width: 200,
        alt: name,
        class: "absolute inset-0 size-full object-contain"
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center">`);
      Package($$renderer2, { class: "size-8" });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex-1 flex flex-col justify-center gap-0.5 px-3 sm:px-4 py-3 bg-white dark:bg-slate-800 min-w-0"><p class="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">${escape_html(reference)}</p> <p class="truncate text-sm"><span class="text-slate-500 font-semibold dark:text-slate-400">Qtd:</span> <span class="text-amber-600 dark:text-amber-400 font-extrabold">${escape_html(quantity)}</span></p> `);
    if (colors) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="truncate text-xs"><span class="text-slate-500 font-semibold dark:text-slate-400">Cor:</span> <span class="text-slate-700 font-medium dark:text-slate-300">${escape_html(colors)}</span></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></button>`);
  });
}
function Product_grid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      products = [],
      totalRows = 0,
      isLoading = false,
      selectedId = null,
      page = 1,
      size = 32,
      pageSizeOptions = [64, 96, 128],
      onPageChange = () => {
      }
    } = $$props;
    let showBar = derived(() => totalRows > 0);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex flex-1 flex-col overflow-hidden">`);
      if (isLoading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex flex-1 items-center justify-center">`);
        Loader_circle($$renderer3, { class: "size-8 animate-spin text-slate-400" });
        $$renderer3.push(`<!----></div>`);
      } else if (products.length === 0) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400"><p class="text-sm font-medium">Nenhum produto encontrado</p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="flex-1 min-h-0 grid grid-cols-4 auto-rows-min gap-2 sm:gap-3 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"><!--[-->`);
        const each_array = ensure_array_like(products);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let product = each_array[$$index];
          const colorNames = product.colors?.map((c) => c.name).join(", ") || "";
          Product_card($$renderer3, {
            name: product.name,
            reference: product.ref,
            quantity: product.quantity - product.reserved,
            colors: colorNames || void 0,
            image: product.images?.[0]?.url,
            isSelected: selectedId === product.id
          });
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (showBar() && products.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex shrink-0 flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-t-2 border-slate-200 px-3 sm:px-6 py-2 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">`);
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
        $$renderer3.push(`<!----></div>`);
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
    bind_props($$props, { selectedId, page, size });
  });
}
function Tooltip($$renderer, $$props) {
  let { content = "", children, class: className = "" } = $$props;
  $$renderer.push(`<div${attr_class(`group relative inline-flex ${stringify(className)}`)}>`);
  children?.($$renderer);
  $$renderer.push(`<!----> `);
  if (content) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 dark:bg-slate-700">${escape_html(content)}</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function Create_reservation_modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      product,
      onClose = () => {
      },
      onSuccess = () => {
      },
      saveDisabled = true,
      isSaving = false,
      onSave = () => {
      }
    } = $$props;
    let selectedColor = "";
    let selectedSize = "";
    let selectedQty = "0";
    const selectedQtyNum = derived(() => parseInt(selectedQty) || 0);
    let reservationLines = [];
    let formState = { userId: "", mensagem: "", quoteId: "" };
    let colorOptions = derived(() => [...new Set(product.variants?.map((v) => v.color) || [])].map((c) => {
      const total = (product.variants || []).filter((v) => v.color === c).reduce((sum, v) => sum + (v.quantity - v.reserved), 0);
      return { value: c, label: `${c} (${total})` };
    }));
    let filteredSizes = derived(() => (product.variants || []).filter((v) => v.color === selectedColor));
    let sizeOptions = derived(() => filteredSizes().map((v) => ({
      value: v.size || "",
      label: `${v.size || "Único"} (${v.quantity - v.reserved})`
    })).filter((v, i, a) => a.findIndex((x) => x.value === v.value) === i));
    let selectedVariant = derived(() => filteredSizes().find((v) => (v.size || "") === (selectedSize || "")) ?? null);
    let availableForSelection = derived(() => selectedVariant() ? selectedVariant().quantity - selectedVariant().reserved : selectedColor ? (product.variants || []).filter((v) => v.color === selectedColor).reduce((sum, v) => sum + (v.quantity - v.reserved), 0) : 0);
    let linesForVariant = derived(() => reservationLines.filter((l) => l.color === selectedColor && l.size === (selectedSize || null)));
    let reservedForVariant = derived(() => linesForVariant().reduce((s, l) => s + l.qty, 0));
    let totalReservedQty = derived(() => reservationLines.reduce((sum, l) => sum + l.qty, 0));
    let userOptions = derived(() => [].map((u) => ({ value: u.id.toString(), label: u.name })));
    let quoteOptions = derived(() => [].map((q) => ({ value: q.id.toString(), label: q.reference })));
    function handleAddLine() {
      if (!selectedColor || selectedQtyNum() <= 0) return;
      if (!selectedVariant() && product.variants?.length) return;
      if (selectedQtyNum() > availableForSelection() - reservedForVariant()) {
        toast.error(`Apenas ${availableForSelection() - reservedForVariant()} unidades disponíveis.`);
        return;
      }
      reservationLines = [
        ...reservationLines,
        {
          color: selectedColor,
          size: selectedSize || null,
          qty: selectedQtyNum()
        }
      ];
      selectedQty = "0";
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200"><div class="flex items-start justify-between p-4 sm:p-5 pb-3"><div class="flex flex-col"><span class="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">NOVA RESERVA</span> <h2 class="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Criar Reserva</h2></div> `);
      Button($$renderer3, {
        variant: "ghost",
        size: "icon",
        onclick: onClose,
        class: "size-7",
        children: ($$renderer4) => {
          X($$renderer4, { class: "size-4" });
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> <div class="flex-1 overflow-y-auto px-4 sm:px-5 pb-28 flex flex-col gap-5"><div class="flex flex-col gap-3"><span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">SELECIONAR VARIANTE</span> <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px] gap-3 items-end"><div class="flex flex-col gap-1.5"><span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Cor</span> `);
      Searchable_select($$renderer3, {
        options: colorOptions(),
        placeholder: "Selecionar cor",
        searchPlaceholder: "Procurar...",
        emptyMessage: "Sem cores disponíveis.",
        get value() {
          return selectedColor;
        },
        set value($$value) {
          selectedColor = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col gap-1.5"><span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Tamanho</span> `);
      Searchable_select($$renderer3, {
        options: sizeOptions(),
        placeholder: "Selecionar tamanho",
        searchPlaceholder: "Procurar...",
        emptyMessage: "Sem tamanhos.",
        get value() {
          return selectedSize;
        },
        set value($$value) {
          selectedSize = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col gap-1.5"><span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Qtd</span> `);
      Input($$renderer3, {
        type: "number",
        min: "0",
        max: Math.max(availableForSelection(), 0),
        placeholder: "0",
        class: "h-9 text-center",
        get value() {
          return selectedQty;
        },
        set value($$value) {
          selectedQty = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> `);
      Button($$renderer3, {
        onclick: handleAddLine,
        disabled: !selectedColor || selectedQtyNum() <= 0,
        class: "w-full h-9 bg-amber-400 hover:bg-amber-500 text-[#1F2937] font-semibold shadow-none rounded-lg",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "size-4" });
          $$renderer4.push(`<!----> <span>Adicionar linha</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      if (selectedColor) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex items-center gap-2"><span class="text-xs font-semibold text-slate-600">Disponível:</span> <span class="inline-flex items-center rounded-lg bg-[#FBBF24] px-2 py-0.5 text-sm font-bold text-[#1F2937] shadow-sm">${escape_html(availableForSelection())}</span> <span class="text-xs font-semibold text-slate-600">un.</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      if (reservationLines.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex flex-col gap-2"><span class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Linhas a reservar (${escape_html(totalReservedQty())} un.)</span> <div class="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"><!--[-->`);
        const each_array = ensure_array_like(reservationLines);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let line = each_array[i];
          $$renderer3.push(`<div class="flex items-center justify-between px-3 py-2.5"><span class="text-sm font-semibold text-slate-700 dark:text-slate-200">${escape_html(line.color)}${escape_html(line.size ? ` / ${line.size}` : "")}</span> <div class="flex items-center gap-3"><span class="text-sm font-extrabold text-amber-600">${escape_html(line.qty)}</span> <button type="button" class="size-8 flex items-center justify-center rounded-md text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors" title="Remover">`);
          X($$renderer3, { class: "size-4" });
          $$renderer3.push(`<!----></button></div></div>`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="border-t border-slate-100/80 dark:border-slate-800/40"></div> <div class="flex flex-col gap-4"><div class="flex flex-col gap-1.5"><label for="comercial" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">COMERCIAL</label> `);
      Searchable_select($$renderer3, {
        id: "comercial",
        options: userOptions(),
        placeholder: "Selecionar comercial",
        searchPlaceholder: "Pesquisar comercial...",
        emptyMessage: "Nenhum comercial encontrado.",
        get value() {
          return formState.userId;
        },
        set value($$value) {
          formState.userId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="quote" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">ORÇAMENTO</label> `);
      Searchable_select($$renderer3, {
        id: "quote",
        options: quoteOptions(),
        placeholder: "Selecionar orçamento (opcional)",
        searchPlaceholder: "Procurar por referência...",
        emptyMessage: "Nenhum orçamento encontrado.",
        get value() {
          return formState.quoteId;
        },
        set value($$value) {
          formState.quoteId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="mensagem" class="text-[10px] font-bold text-slate-600 tracking-wider uppercase">MENSAGEM</label> <textarea id="mensagem" aria-label="Mensagem" placeholder="Adicionar mensagem..." class="h-22 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-700">`);
      const $$body = escape_html(formState.mensagem);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></div></div> <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-600/90 dark:text-slate-600">`);
      Info($$renderer3, { class: "size-4 shrink-0 text-slate-500 dark:text-slate-400" });
      $$renderer3.push(`<!----> <span>As reservas são válidas por 8 dias úteis.</span></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { saveDisabled, isSaving, onSave });
  });
}
function Product_reservations_panel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { product, onClose = () => {
    }, onProductChange = () => {
    } } = $$props;
    const reservationsStore = createAsyncStore();
    let deletingReservation = null;
    async function handleDeleteConfirm() {
      if (!deletingReservation) return;
      const id = deletingReservation.id;
      deletingReservation = null;
      try {
        await deleteReservation(id);
        toast.success("Reserva apagada com sucesso!");
        reservationsStore.refetch();
        onProductChange();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao apagar reserva.");
      }
    }
    $$renderer2.push(`<div class="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200"><div class="flex items-start justify-between p-4 sm:p-5 pb-3"><div class="flex flex-col"><span class="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">PRODUTO • ${escape_html(product.ref)}
        ${escape_html(product.name)}</span> <h2 class="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Reservas do Produto</h2></div> `);
    Button($$renderer2, {
      variant: "ghost",
      size: "icon",
      onclick: onClose,
      class: "size-7",
      children: ($$renderer3) => {
        X($$renderer3, { class: "size-4" });
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="flex-1 overflow-y-auto px-4 sm:px-5 pb-28 flex flex-col gap-4"><div class="w-full rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col min-h-[200px]"><div class="grid grid-cols-[1fr_1fr_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto] bg-[#F8FAFC] px-4 py-2.5 text-[10px] font-bold text-slate-500 tracking-wider dark:bg-slate-900/50 gap-x-2"><span class="text-left">COMERCIAL</span> <span class="text-center">VARIANTE</span> <span class="text-center w-12">QTD</span> <span class="text-center w-12">AÇÕES</span> <span class="hidden sm:inline text-center w-16">DATA</span></div> <div class="flex-1 flex flex-col">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex-1 flex items-center justify-center py-12 text-xs text-slate-500 font-semibold">A carregar reservas...</div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500/95 dark:text-slate-500">`);
    Info($$renderer2, { class: "size-4 shrink-0 text-slate-500 dark:text-slate-400" });
    $$renderer2.push(`<!----> <span>As reservas são válidas por 8 dias úteis.</span></div></div> `);
    Confirm_delete_modal($$renderer2, {
      open: deletingReservation !== null,
      onClose: () => deletingReservation = null,
      onConfirm: handleDeleteConfirm,
      title: "Eliminar Reserva",
      itemName: deletingReservation ? `${deletingReservation.quantity}x ${deletingReservation.name}` : ""
    });
    $$renderer2.push(`<!----></div>`);
  });
}
function Product_image_carousel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { images, name, size = "square" } = $$props;
    let index = 0;
    let currentImage = derived(() => images[index] ?? null);
    let hasMultiple = derived(() => images.length > 1);
    $$renderer2.push(`<div${attr_class(`relative ${size === "square" ? "aspect-square min-w-[130px] w-[150px] h-[150px]" : "w-full"} bg-slate-100 border-r border-slate-200 dark:bg-slate-950 dark:border-slate-700 overflow-hidden`)}>`);
    if (currentImage()) {
      $$renderer2.push("<!--[0-->");
      Authed_image($$renderer2, {
        path: currentImage().url,
        width: 400,
        alt: name,
        class: `size-full ${size === "square" ? "object-cover" : "object-contain"}`
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="size-full flex items-center justify-center">`);
      Image($$renderer2, { class: "text-slate-300 size-9 dark:text-slate-600" });
      $$renderer2.push(`<!----> <span class="text-[9px] font-bold text-slate-600 tracking-wider absolute bottom-2 dark:text-slate-600">SEM IMAGEM</span></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (hasMultiple()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute left-1 top-1/2 -translate-y-1/2 z-10"><button type="button" aria-label="Imagem anterior" class="size-6 opacity-80 hover:opacity-100 bg-secondary text-secondary-foreground rounded-md shadow-xs inline-flex items-center justify-center">`);
      Chevron_left($$renderer2, { class: "size-3.5" });
      $$renderer2.push(`<!----></button></div> <div class="absolute right-1 top-1/2 -translate-y-1/2 z-10"><button type="button" aria-label="Próxima imagem" class="size-6 opacity-80 hover:opacity-100 bg-secondary text-secondary-foreground rounded-md shadow-xs inline-flex items-center justify-center">`);
      Chevron_right($$renderer2, { class: "size-3.5" });
      $$renderer2.push(`<!----></button></div> <div class="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-10"><!--[-->`);
      const each_array = ensure_array_like(images);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        $$renderer2.push(`<div${attr_class(`size-1.5 rounded-full transition-all duration-300 ${i === index ? "bg-amber-400 dark:bg-amber-400 w-3" : "bg-slate-300 dark:bg-slate-700"}`)}></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Product_variant_filters($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      colors,
      sizes,
      selectedColor = "",
      selectedSize = "",
      displayQuantity,
      compact = false
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="px-5 py-3"><span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest mb-2.5 block dark:text-slate-600">Filtrar Variantes</span> <div class="grid grid-cols-3 gap-3">`);
      if (colors && colors.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cor</span> `);
        Searchable_select($$renderer3, {
          options: [
            { value: "", label: "Todas" },
            ...colors.map((c) => ({ value: c.name, label: c.name }))
          ],
          placeholder: "Todas",
          get value() {
            return selectedColor;
          },
          set value($$value) {
            selectedColor = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (sizes && sizes.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tamanho</span> `);
        Searchable_select($$renderer3, {
          options: [
            { value: "", label: "Todos" },
            ...sizes.map((s) => ({ value: s.size, label: s.size }))
          ],
          placeholder: "Todos",
          get value() {
            return selectedSize;
          },
          set value($$value) {
            selectedSize = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponível</span> <span${attr_class(`inline-flex items-center w-fit rounded-lg px-2.5 py-1 text-sm font-bold shadow-sm ${displayQuantity === 0 ? "bg-red-100 text-red-600" : "bg-[#FBBF24] text-[#1F2937]"}`)}>${escape_html(displayQuantity)} <span class="font-semibold opacity-80 ml-1">un.</span></span></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { selectedColor, selectedSize });
  });
}
function Product_variants_table($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { variants } = $$props;
    if (variants.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mx-5 my-3 rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700"><div class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 bg-slate-100 px-4 py-2.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider dark:bg-slate-800 dark:text-slate-300"><span>Cor</span> <span>Tam.</span> <span class="text-right">Qtd.</span> <span class="text-right">Res.</span></div> <div><!--[-->`);
      const each_array = ensure_array_like(variants);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let v = each_array[$$index];
        $$renderer2.push(`<div class="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-x-3 px-4 py-2.5 text-sm transition-colors border-b border-slate-100 last:border-0 dark:border-slate-700/50 hover:bg-amber-50/50 dark:hover:bg-slate-700/30"><span class="font-bold text-slate-800 dark:text-slate-200">${escape_html(v.color)}</span> <span class="text-slate-600 font-medium dark:text-slate-600">${escape_html(v.size || "Único")}</span> <span class="font-extrabold text-right text-emerald-600">${escape_html(v.quantity)}</span> <span class="font-extrabold text-right text-amber-600">${escape_html(v.reserved)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-16 text-sm text-slate-400">Nenhuma variante encontrada</div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Product_data_grid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { cx, number, family, drawer, pc } = $$props;
    $$renderer2.push(`<div class="px-5 py-2.5"><div class="grid grid-cols-3 gap-x-4 gap-y-1"><div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">CX.</span> <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">${escape_html(cx || "—")}</span></div> <div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">NÚMERO</span> <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">${escape_html(number ?? "N/A")}</span></div> <div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">FAMÍLIA</span> <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">${escape_html(family || "—")}</span></div> <div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">GAVETA</span> <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">${escape_html(drawer || "—")}</span></div> <div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">P.C.</span> <span class="text-xs font-extrabold text-amber-600">${escape_html(pc.toFixed(2))} €</span></div></div></div>`);
  });
}
function Product_detail_panel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { product, onClose = () => {
    }, onProductChange = () => {
    } } = $$props;
    let view = "details";
    let selectedColor = "";
    let selectedSize = "";
    let saveDisabled = true;
    let isSaving = false;
    let onSave = () => {
    };
    function formatDate(dateStr) {
      if (!dateStr) return "—";
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("pt-PT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } catch {
        return "—";
      }
    }
    let filteredVariants = derived(() => (product.variants || []).filter((v) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    }));
    let totalStock = derived(() => product.quantity - product.reserved);
    let filteredStock = derived(() => filteredVariants().reduce((sum, v) => sum + (v.quantity - v.reserved), 0));
    let displayQuantity = derived(() => selectedColor || selectedSize ? filteredStock() : totalStock());
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex h-full w-full md:w-[460px] md:shrink-0 md:border-2 md:border-slate-200 md:rounded-2xl md:shadow-sm flex-col overflow-hidden bg-white md:dark:border-slate-700 dark:bg-slate-900 relative">`);
      if (view === "reserving") {
        $$renderer3.push("<!--[0-->");
        Create_reservation_modal($$renderer3, {
          product,
          onClose: () => view = "details",
          onSuccess: onProductChange,
          get saveDisabled() {
            return saveDisabled;
          },
          set saveDisabled($$value) {
            saveDisabled = $$value;
            $$settled = false;
          },
          get isSaving() {
            return isSaving;
          },
          set isSaving($$value) {
            isSaving = $$value;
            $$settled = false;
          },
          get onSave() {
            return onSave;
          },
          set onSave($$value) {
            onSave = $$value;
            $$settled = false;
          }
        });
      } else if (view === "reservations") {
        $$renderer3.push("<!--[1-->");
        Product_reservations_panel($$renderer3, { product, onClose: () => view = "details", onProductChange });
      } else {
        $$renderer3.push("<!--[-1-->");
        Button($$renderer3, {
          variant: "ghost",
          size: "icon",
          onclick: onClose,
          class: "absolute top-3 right-3 z-10 size-7 hover:bg-slate-200 dark:hover:bg-slate-700",
          children: ($$renderer4) => {
            X($$renderer4, { class: "size-4" });
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="flex-1 flex flex-col overflow-hidden"><div class="shrink-0 flex bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">`);
          Product_image_carousel($$renderer3, { images: product.images || [], name: product.name });
          $$renderer3.push(`<!----> <div class="flex-1 flex flex-col justify-between min-w-0 p-5"><div class="flex flex-col gap-1"><span class="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">REF. ${escape_html(product.ref)}</span> `);
          Tooltip($$renderer3, {
            content: "",
            class: "w-full",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="text-xl font-extrabold text-slate-900 uppercase leading-tight dark:text-slate-50 truncate">${escape_html(product.name)}</h2>`);
            }
          });
          $$renderer3.push(`<!----> `);
          if (product.category) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-slate-600 font-semibold dark:text-slate-600">${escape_html(product.category.name)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="flex items-center gap-3 mt-2"><div class="inline-flex items-center rounded-lg bg-[#FBBF24] px-3 py-1 text-sm font-bold text-[#1F2937] shadow-sm">${escape_html(product.quantity)} <span class="font-semibold opacity-80 ml-1">unidades</span></div> <span class="text-base font-extrabold text-slate-900 dark:text-slate-100">${escape_html(product.pvp.toFixed(2))} €<span class="text-xs font-bold text-slate-600 ml-0.5 dark:text-slate-600">PVP</span></span></div></div></div> <div class="shrink-0 bg-white border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">`);
          Product_variant_filters($$renderer3, {
            colors: product.colors || [],
            sizes: product.sizes || [],
            displayQuantity: displayQuantity(),
            get selectedColor() {
              return selectedColor;
            },
            set selectedColor($$value) {
              selectedColor = $$value;
              $$settled = false;
            },
            get selectedSize() {
              return selectedSize;
            },
            set selectedSize($$value) {
              selectedSize = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----></div> <div class="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-800/50">`);
          Product_variants_table($$renderer3, { variants: filteredVariants() });
          $$renderer3.push(`<!----></div> <div class="shrink-0 bg-white border-t-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">`);
          Product_data_grid($$renderer3, {
            cx: product.cx,
            number: product.number,
            family: product.family?.name || null,
            drawer: product.drawer,
            pc: product.pc
          });
          $$renderer3.push(`<!----></div> `);
          if (product.description) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="shrink-0 bg-white border-t-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"><div class="px-5 py-2.5"><div class="flex items-center gap-1.5 mb-1">`);
            File_text($$renderer3, { class: "size-3.5 shrink-0 text-slate-600" });
            $$renderer3.push(`<!----> <span class="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest">Descrição</span></div> `);
            Tooltip($$renderer3, {
              content: "",
              class: "w-full",
              children: ($$renderer4) => {
                $$renderer4.push(`<p class="text-xs text-slate-600 leading-relaxed font-medium dark:text-slate-300">${escape_html(product.description)}</p>`);
              }
            });
            $$renderer3.push(`<!----></div></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="shrink-0 bg-white px-5 py-2 dark:bg-slate-800/50"><div class="flex items-center text-[10px] text-slate-500 font-semibold"><p class="flex-1">Criado em <span class="font-bold text-slate-600">${escape_html(formatDate(product.createdAt))}</span></p> <span class="text-slate-300 dark:text-slate-600 mx-2">|</span> <p class="flex-1 text-right">Atualizado em <span class="font-bold text-slate-600">${escape_html(formatDate(product.updatedAt))}</span></p></div></div></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--> <div class="lg:shrink-0 border-t-2 border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 dark:border-slate-700 dark:bg-slate-800">`);
      if (view === "details") {
        $$renderer3.push("<!--[0-->");
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          onclick: () => view = "reservations",
          class: "flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center",
          children: ($$renderer4) => {
            Calendar($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">Ver Reservas</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          variant: "default",
          size: "sm",
          onclick: () => view = "reserving",
          class: "flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">Adicionar Reserva</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      } else if (view === "reservations") {
        $$renderer3.push("<!--[1-->");
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          onclick: () => view = "details",
          class: "flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center",
          children: ($$renderer4) => {
            Chevron_left($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">Voltar</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          variant: "default",
          size: "sm",
          onclick: () => view = "reserving",
          class: "flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">Adicionar Reserva</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      } else if (view === "reserving") {
        $$renderer3.push("<!--[2-->");
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          onclick: () => view = "details",
          class: "flex-1 h-11 border-slate-300 hover:bg-slate-100 font-semibold dark:border-slate-600 justify-center",
          children: ($$renderer4) => {
            Chevron_left($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">Voltar</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          variant: "default",
          size: "sm",
          disabled: saveDisabled,
          onclick: () => onSave(),
          class: "flex-1 h-11 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] font-extrabold active:scale-95 shadow-sm justify-center",
          children: ($$renderer4) => {
            Shield_check($$renderer4, { class: "size-3.5" });
            $$renderer4.push(`<!----> <span class="text-sm">${escape_html(isSaving ? "A guardar..." : "Reservar")}</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let panelPosition = derived(() => store_get($$store_subs ??= {}, "$settingsStore", settingsStore).panelPosition);
    let selectedProductId = null;
    let cachedProduct = null;
    let filtersSheetOpen = false;
    let page = getNumberParam("page", 1);
    let size = getNumberParam("size", 32);
    let searchQuery = getStringParam("search", "");
    const defaultFilters = () => ({
      familia: getStringParam("familia", ""),
      disponibilidade: getStringParam("disponibilidade", "Todas"),
      cor: getStringParam("cor", ""),
      tamanho: getStringParam("tamanho", "")
    });
    let appliedFilters = defaultFilters();
    let pendingFilters = defaultFilters();
    let serverProducts = [];
    let serverTotal = 0;
    let serverLoading = false;
    function buildQueryParams(p, s) {
      return {
        page: p,
        limit: s,
        search: searchQuery || void 0,
        familia: appliedFilters.familia ? appliedFilters.familia.split(",") : void 0,
        disponibilidade: appliedFilters.disponibilidade !== "Todas" ? appliedFilters.disponibilidade : void 0,
        cor: appliedFilters.cor ? appliedFilters.cor.split(",") : void 0,
        tamanho: appliedFilters.tamanho ? appliedFilters.tamanho.split(",") : void 0
      };
    }
    async function doFetch(p, s) {
      serverLoading = true;
      try {
        const result = await getProductsPaginated(buildQueryParams(p, s));
        serverProducts = result.products;
        serverTotal = result.total;
        page = p;
      } catch {
        serverProducts = [];
        serverTotal = 0;
      } finally {
        serverLoading = false;
      }
    }
    createDebounced(() => searchQuery);
    let selectedProduct = derived(() => selectedProductId != null && cachedProduct?.id === selectedProductId ? cachedProduct : null);
    async function refreshSelectedProduct() {
      if (selectedProductId == null) return;
      try {
        cachedProduct = await getProductById(selectedProductId);
      } catch {
      }
      doFetch(page, size);
    }
    function closeProduct() {
      selectedProductId = null;
      cachedProduct = null;
    }
    let availableColors = derived(() => [].map((c) => typeof c === "string" ? c : c.name));
    let availableSizes = derived(() => [].map((s) => typeof s === "string" ? s : s.size));
    function countActive(f) {
      return (f.familia ? 1 : 0) + (f.disponibilidade !== "Todas" ? 1 : 0) + (f.cor ? 1 : 0) + (f.tamanho ? 1 : 0);
    }
    let activeFilterCount = derived(() => countActive(appliedFilters));
    let pendingFilterCount = derived(() => countActive(pendingFilters));
    let hasPendingChanges = derived(() => pendingFilters.familia !== appliedFilters.familia || pendingFilters.disponibilidade !== appliedFilters.disponibilidade || pendingFilters.cor !== appliedFilters.cor || pendingFilters.tamanho !== appliedFilters.tamanho);
    function syncPendingToApplied() {
      appliedFilters.familia = pendingFilters.familia;
      appliedFilters.disponibilidade = pendingFilters.disponibilidade;
      appliedFilters.cor = pendingFilters.cor;
      appliedFilters.tamanho = pendingFilters.tamanho;
    }
    function applyFilters() {
      syncPendingToApplied();
      filtersSheetOpen = false;
    }
    function clearPending() {
      pendingFilters.familia = "";
      pendingFilters.disponibilidade = "Todas";
      pendingFilters.cor = "";
      pendingFilters.tamanho = "";
    }
    function clearAll() {
      clearPending();
      applyFilters();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex h-dvh flex-col bg-[#F3F4F6] p-1.5 sm:p-2 gap-1.5 sm:gap-2 transition-colors duration-250 dark:bg-slate-950">`);
      Stock_navbar($$renderer3, {
        get searchQuery() {
          return searchQuery;
        },
        set searchQuery($$value) {
          searchQuery = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="flex flex-1 overflow-hidden min-h-0 gap-1.5 sm:gap-2 relative">`);
      if (panelPosition() === "left" && selectedProduct()) {
        $$renderer3.push("<!--[0-->");
        Product_detail_panel($$renderer3, {
          product: selectedProduct(),
          onClose: closeProduct,
          onProductChange: refreshSelectedProduct
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="flex flex-1 flex-col bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700 min-w-0"><div class="lg:hidden px-3 pt-3 pb-1 shrink-0">`);
      Filters_trigger($$renderer3, { activeCount: pendingFilterCount() });
      $$renderer3.push(`<!----></div> `);
      Filters_bar($$renderer3, {
        families: [],
        availableColors: availableColors(),
        availableSizes: availableSizes(),
        onApply: applyFilters,
        onClear: clearAll,
        hasPendingChanges: hasPendingChanges(),
        activeCount: activeFilterCount(),
        get pendingFilters() {
          return pendingFilters;
        },
        set pendingFilters($$value) {
          pendingFilters = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Product_grid($$renderer3, {
        products: serverProducts,
        totalRows: serverTotal,
        isLoading: serverLoading,
        onPageChange: doFetch,
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
        },
        get selectedId() {
          return selectedProductId;
        },
        set selectedId($$value) {
          selectedProductId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (panelPosition() === "right" && selectedProduct()) {
        $$renderer3.push("<!--[0-->");
        Product_detail_panel($$renderer3, {
          product: selectedProduct(),
          onClose: closeProduct,
          onProductChange: refreshSelectedProduct
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> `);
      Mobile_filters_sheet($$renderer3, {
        families: [],
        availableColors: availableColors(),
        availableSizes: availableSizes(),
        onApply: applyFilters,
        onClear: clearPending,
        get open() {
          return filtersSheetOpen;
        },
        set open($$value) {
          filtersSheetOpen = $$value;
          $$settled = false;
        },
        get pendingFilters() {
          return pendingFilters;
        },
        set pendingFilters($$value) {
          pendingFilters = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
