import "clsx";
import { m as sanitize_props, f as spread_props, n as slot, b as attr, i as escape_html, a as attr_class, k as stringify, e as ensure_array_like } from "./root.js";
import { B as Button } from "./button.js";
import { E as Eye } from "./eye.js";
import { I as Icon } from "./Icon.js";
function Pencil($$renderer, $$props) {
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
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { "d": "m15 5 4 4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "pencil" },
    $$sanitized_props,
    {
      /**
       * @component @name Pencil
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
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
function Trash_2($$renderer, $$props) {
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
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
    ["line", { "x1": "10", "x2": "10", "y1": "11", "y2": "17" }],
    ["line", { "x1": "14", "x2": "14", "y1": "11", "y2": "17" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trash-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Trash2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjYiIC8+CiAgPHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIgLz4KICA8bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjExIiB5Mj0iMTciIC8+CiAgPGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxMSIgeTI9IjE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trash-2
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
function createCrudModal() {
  let activeModal = null;
  let selected = null;
  return {
    get activeModal() {
      return activeModal;
    },
    get isAdd() {
      return activeModal === "add";
    },
    get isEdit() {
      return activeModal === "edit";
    },
    get isView() {
      return activeModal === "view";
    },
    get isDelete() {
      return activeModal === "delete";
    },
    get isOpen() {
      return activeModal !== null;
    },
    get selected() {
      return selected;
    },
    openAdd() {
      activeModal = "add";
      selected = null;
    },
    openView(item) {
      activeModal = "view";
      selected = item;
    },
    openEdit(item) {
      activeModal = "edit";
      selected = item;
    },
    openDelete(item) {
      activeModal = "delete";
      selected = item;
    },
    close() {
      activeModal = null;
      selected = null;
    }
  };
}
function Form_field($$renderer, $$props) {
  let { label = "", for: htmlFor = void 0, error = "", children } = $$props;
  $$renderer.push(`<div class="flex flex-col gap-1.5"><label${attr("for", htmlFor)} class="text-xs font-semibold text-slate-500 dark:text-slate-400">${escape_html(label)}</label> `);
  children?.($$renderer);
  $$renderer.push(`<!----> `);
  if (error) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span class="text-xs text-red-500">${escape_html(error)}</span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function Row_actions($$renderer, $$props) {
  let {
    onView = void 0,
    onEdit = void 0,
    onDelete = void 0,
    viewLabel = "Ver",
    editLabel = "Editar",
    deleteLabel = "Eliminar"
  } = $$props;
  $$renderer.push(`<div class="flex items-center justify-end gap-0.5 sm:gap-1">`);
  if (onView) {
    $$renderer.push("<!--[0-->");
    Button($$renderer, {
      variant: "ghost",
      size: "icon",
      onclick: onView,
      title: viewLabel,
      class: "size-9 sm:size-8 text-amber-500 hover:text-amber-600",
      children: ($$renderer2) => {
        Eye($$renderer2, { class: "size-4" });
      },
      $$slots: { default: true }
    });
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  if (onEdit) {
    $$renderer.push("<!--[0-->");
    Button($$renderer, {
      variant: "ghost",
      size: "icon",
      onclick: onEdit,
      title: editLabel,
      class: "size-9 sm:size-8 text-amber-500 hover:text-amber-600",
      children: ($$renderer2) => {
        Pencil($$renderer2, { class: "size-4" });
      },
      $$slots: { default: true }
    });
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  if (onDelete) {
    $$renderer.push("<!--[0-->");
    Button($$renderer, {
      variant: "ghost",
      size: "icon",
      onclick: onDelete,
      title: deleteLabel,
      class: "size-9 sm:size-8 text-red-500 hover:text-red-600",
      children: ($$renderer2) => {
        Trash_2($$renderer2, { class: "size-4" });
      },
      $$slots: { default: true }
    });
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function Detail_grid($$renderer, $$props) {
  let { items = [], columns = 2 } = $$props;
  $$renderer.push(`<div${attr_class(`grid grid-cols-${stringify(columns)} gap-4`)}><!--[-->`);
  const each_array = ensure_array_like(items);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$renderer.push(`<div><span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">${escape_html(item.label)}</span> <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">${escape_html(item.value)}</span></div>`);
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  Detail_grid as D,
  Form_field as F,
  Row_actions as R,
  createCrudModal as c
};
