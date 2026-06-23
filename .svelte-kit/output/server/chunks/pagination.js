import { m as sanitize_props, f as spread_props, n as slot, e as ensure_array_like, i as escape_html, o as bind_props, j as derived } from "./root.js";
import { I as Icon } from "./Icon.js";
import { a as apiClient } from "./api-client.js";
import { B as Button } from "./button.js";
const Routes = {
  stock: {
    products: "/stock/products",
    productFilters: "/stock/products/filters",
    productCreate: "/stock/products",
    productDetail: (id) => `/stock/products/${id}`,
    categories: "/stock/categories",
    families: "/stock/families",
    suppliers: "/stock/suppliers",
    familyDetail: (id) => `/stock/families/${id}`,
    supplierDetail: (name) => `/stock/suppliers/${encodeURIComponent(name)}`,
    reservations: "/stock/reservations",
    reservationDetail: (id) => `/stock/reservations/${id}`
  }
};
function Chevron_left($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
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
function Chevron_right($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
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
function Chevrons_left($$renderer, $$props) {
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
    ["path", { "d": "m11 17-5-5 5-5" }],
    ["path", { "d": "m18 17-5-5 5-5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chevrons-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronsLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTEgMTctNS01IDUtNSIgLz4KICA8cGF0aCBkPSJtMTggMTctNS01IDUtNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevrons-left
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
function Chevrons_right($$renderer, $$props) {
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
    ["path", { "d": "m6 17 5-5-5-5" }],
    ["path", { "d": "m13 17 5-5-5-5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chevrons-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronsRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiAxNyA1LTUtNS01IiAvPgogIDxwYXRoIGQ9Im0xMyAxNyA1LTUtNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevrons-right
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
function Loader_circle($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
  Icon($$renderer, spread_props([
    { name: "loader-circle" },
    $$sanitized_props,
    {
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
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
async function getProductById(id) {
  const { data } = await apiClient.get(Routes.stock.productDetail(id));
  return data;
}
async function getProductsPaginated(query) {
  const { data } = await apiClient.get(Routes.stock.products, { params: query });
  return data;
}
async function getFamiliesPaginated(query) {
  const { data } = await apiClient.get(Routes.stock.families, { params: query });
  return data;
}
async function getReservationsPaginated(query) {
  const { data } = await apiClient.get(Routes.stock.reservations, {
    params: query
  });
  return data;
}
async function deleteSupplier(name) {
  await apiClient.delete(Routes.stock.supplierDetail(name));
}
async function getSuppliersPaginated(page, limit) {
  const { data } = await apiClient.get(Routes.stock.suppliers, {
    params: { page, limit }
  });
  return data;
}
async function deleteFamily(id) {
  return apiClient.delete(Routes.stock.familyDetail(id));
}
async function resetReservation(id) {
  const { data } = await apiClient.patch(
    `${Routes.stock.reservationDetail(id)}/reset`
  );
  return data;
}
async function rejectReservation(id) {
  const { data } = await apiClient.patch(
    `${Routes.stock.reservationDetail(id)}/reject`
  );
  return data;
}
async function restoreReservation(id) {
  const { data } = await apiClient.patch(
    `${Routes.stock.reservationDetail(id)}/restore`
  );
  return data;
}
async function approveReservation(id) {
  const { data } = await apiClient.patch(
    `${Routes.stock.reservationDetail(id)}/approve`
  );
  return data;
}
async function deleteReservation(id) {
  await apiClient.delete(Routes.stock.reservationDetail(id));
}
async function deleteProduct(id) {
  await apiClient.delete(Routes.stock.productDetail(id));
}
function Pagination($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      page = 1,
      size = 25,
      totalRows,
      pageSizeOptions = [25, 50, 100, 250],
      onPageChange
    } = $$props;
    let totalPages = derived(() => Math.max(1, Math.ceil(totalRows / size)));
    let safePage = derived(() => Math.max(1, Math.min(page, totalPages())));
    let showBar = derived(() => totalRows > 0);
    function goToPage(newPage) {
      page = newPage;
      onPageChange?.(page, size);
    }
    function changeSize(newSize) {
      size = newSize;
      page = 1;
      onPageChange?.(page, size);
    }
    if (showBar()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-3 border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0"><div class="flex items-center gap-2 flex-wrap">`);
      $$renderer2.select(
        {
          value: size,
          onchange: (e) => changeSize(Number(e.currentTarget.value)),
          class: "h-9 sm:h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 min-h-touch"
        },
        ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(pageSizeOptions);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let opt = each_array[$$index];
            $$renderer3.option({ value: opt }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(opt)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(` <span class="text-xs text-slate-400 dark:text-slate-500">linhas por página · ${escape_html(totalRows)} registos</span></div> <div class="flex items-center justify-between sm:justify-end gap-1.5"><span class="text-xs text-slate-500 dark:text-slate-400">Página ${escape_html(safePage())} de ${escape_html(totalPages())}</span> <div class="flex items-center gap-1 sm:gap-1.5">`);
      Button($$renderer2, {
        variant: "outline",
        size: "icon",
        disabled: safePage() <= 1,
        onclick: () => goToPage(1),
        class: "size-10 sm:size-8",
        children: ($$renderer3) => {
          Chevrons_left($$renderer3, { class: "size-3.5" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        size: "icon",
        disabled: safePage() <= 1,
        onclick: () => goToPage(Math.max(1, page - 1)),
        class: "size-10 sm:size-8",
        children: ($$renderer3) => {
          Chevron_left($$renderer3, { class: "size-3.5" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        size: "icon",
        class: "size-10 sm:size-8 bg-amber-400 text-[#1F2937] hover:bg-amber-500 border-none cursor-default text-xs font-bold",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(safePage())}`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        size: "icon",
        disabled: safePage() >= totalPages(),
        onclick: () => goToPage(Math.min(totalPages(), page + 1)),
        class: "size-10 sm:size-8",
        children: ($$renderer3) => {
          Chevron_right($$renderer3, { class: "size-3.5" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        size: "icon",
        disabled: safePage() >= totalPages(),
        onclick: () => goToPage(totalPages()),
        class: "size-10 sm:size-8",
        children: ($$renderer3) => {
          Chevrons_right($$renderer3, { class: "size-3.5" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { page, size });
  });
}
export {
  Chevron_left as C,
  Loader_circle as L,
  Pagination as P,
  approveReservation as a,
  resetReservation as b,
  restoreReservation as c,
  deleteFamily as d,
  getFamiliesPaginated as e,
  deleteSupplier as f,
  getReservationsPaginated as g,
  getSuppliersPaginated as h,
  deleteReservation as i,
  deleteProduct as j,
  getProductsPaginated as k,
  Chevron_right as l,
  getProductById as m,
  rejectReservation as r
};
