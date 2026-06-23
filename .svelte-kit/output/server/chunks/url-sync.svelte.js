import { m as sanitize_props, f as spread_props, n as slot, b as attr, a as attr_class, c as clsx, i as escape_html, o as bind_props, j as derived } from "./root.js";
import { I as Icon } from "./Icon.js";
import { c as cn, B as Button } from "./button.js";
import "clsx";
import { X } from "./x.js";
function Chevrons_up_down($$renderer, $$props) {
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
    ["path", { "d": "m7 15 5 5 5-5" }],
    ["path", { "d": "m7 9 5-5 5 5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chevrons-up-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronsUpDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAxNSA1IDUgNS01IiAvPgogIDxwYXRoIGQ9Im03IDkgNS01IDUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevrons-up-down
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
function Plus($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
  Icon($$renderer, spread_props([
    { name: "plus" },
    $$sanitized_props,
    {
      /**
       * @component @name Plus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
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
function Triangle_alert($$renderer, $$props) {
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
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "triangle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name TriangleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
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
function Searchable_select($$renderer, $$props) {
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
    let selected = derived(() => options.find((o) => o.value === value));
    $$renderer2.push(`<div class="relative"><button type="button"${attr("id", id)}${attr("disabled", disabled, true)} role="combobox"${attr("aria-expanded", open)}${attr("aria-controls", id ? `${id}-listbox` : void 0)}${attr_class(clsx(cn("flex w-full min-w-0 shrink items-center justify-between overflow-hidden font-normal h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", !selected() && "text-muted-foreground", className)))}><span class="truncate">${escape_html(selected()?.label ?? placeholder)}</span> `);
    Chevrons_up_down($$renderer2, { class: "ml-1 size-4 shrink-0 opacity-50" });
    $$renderer2.push(`<!----></button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
function Admin_modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      onClose,
      title = "",
      children,
      footer = void 0
    } = $$props;
    if (open) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/30 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" tabindex="-1"><div class="bg-white rounded-none sm:rounded-2xl border-0 sm:border-2 border-slate-200 shadow-lg w-full sm:max-w-lg sm:mx-4 sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 sm:dark:border-slate-700" role="document"><div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"><h3 id="admin-modal-title" class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${escape_html(title)}</h3> `);
      Button($$renderer2, {
        variant: "ghost",
        size: "icon",
        onclick: onClose,
        class: "size-10",
        "aria-label": "Fechar",
        children: ($$renderer3) => {
          X($$renderer3, { class: "size-4" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div> <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div> `);
      if (footer) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-slate-100 dark:border-slate-700 shrink-0 pb-safe">`);
        footer($$renderer2);
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Confirm_delete_modal($$renderer, $$props) {
  let { open = false, onClose, onConfirm, title = "", itemName = "" } = $$props;
  {
    let footer = function($$renderer2) {
      Button($$renderer2, {
        variant: "outline",
        onclick: onClose,
        class: "h-10 px-4 rounded-lg text-sm font-medium",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Cancelar`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        onclick: onConfirm,
        class: "h-10 bg-red-600 hover:bg-red-700 text-white px-5 rounded-lg text-sm font-medium shadow-none",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Eliminar`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    };
    Admin_modal($$renderer, {
      open,
      onClose,
      title,
      footer,
      children: ($$renderer2) => {
        $$renderer2.push(`<div class="flex flex-col items-center text-center gap-4"><div class="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">`);
        Triangle_alert($$renderer2, { class: "size-6" });
        $$renderer2.push(`<!----></div> <p class="text-sm text-slate-500 dark:text-slate-400">Tem a certeza que deseja eliminar <strong class="text-slate-800 dark:text-slate-100 font-bold">${escape_html(itemName)}</strong>? Esta ação não pode ser desfeita.</p></div>`);
      }
    });
  }
}
function readSearchParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}
function getStringParam(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return readSearchParams().get(key) || fallback;
}
function getNumberParam(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = readSearchParams().get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}
export {
  Admin_modal as A,
  Confirm_delete_modal as C,
  Plus as P,
  Searchable_select as S,
  getStringParam as a,
  Chevrons_up_down as b,
  getNumberParam as g
};
