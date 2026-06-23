import { m as sanitize_props, f as spread_props, n as slot, i as escape_html, j as derived } from "../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as approveReservation, r as rejectReservation, b as resetReservation, c as restoreReservation, g as getReservationsPaginated } from "../../../chunks/pagination.js";
import { C as Check, R as Rotate_ccw, r as reservationStatusInfo } from "../../../chunks/stock-types.js";
import { A as Authed_image } from "../../../chunks/authed-image.js";
import { P as Page_card } from "../../../chunks/page-card.js";
import { D as Data_table, S as Status_badge } from "../../../chunks/status-badge.js";
import { B as Button } from "../../../chunks/button.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Package } from "../../../chunks/package.js";
import { X } from "../../../chunks/x.js";
import { a as toast } from "../../../chunks/toast-state.svelte.js";
function Archive($$renderer, $$props) {
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
      { "width": "20", "height": "5", "x": "2", "y": "3", "rx": "1" }
    ],
    ["path", { "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
    ["path", { "d": "M10 12h4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "archive" },
    $$sanitized_props,
    {
      /**
       * @component @name Archive
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNSIgeD0iMiIgeT0iMyIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTQgOHYxMWEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOCIgLz4KICA8cGF0aCBkPSJNMTAgMTJoNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/archive
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { searchQuery: _searchQuery = "" } = $$props;
    let displayStock = derived(
      () => "..."
    );
    let displayReserved = derived(
      () => "..."
    );
    let serverReservations = [];
    let serverTotal = 0;
    let serverPage = 1;
    let serverSize = 5;
    let serverLoading = false;
    async function doFetch(page, size) {
      serverLoading = true;
      try {
        const result = await getReservationsPaginated({ page, limit: size, status: "0" });
        serverReservations = result.reservations;
        serverTotal = result.total;
        serverPage = page;
      } catch {
        serverReservations = [];
        serverTotal = 0;
      } finally {
        serverLoading = false;
      }
    }
    function handlePageChange(page, size) {
      doFetch(page, size);
    }
    function getStatusInfo(status) {
      return reservationStatusInfo(status);
    }
    function refetchAll() {
      doFetch(serverPage, serverSize);
    }
    function handleApprove(id) {
      approveReservation(id).then(() => {
        refetchAll();
        toast.success("Reserva aprovada com sucesso.");
      }).catch(() => toast.error("Erro ao aprovar reserva."));
    }
    function handleReject(id) {
      rejectReservation(id).then(() => {
        refetchAll();
        toast.success("Reserva rejeitada.");
      }).catch(() => toast.error("Erro ao rejeitar reserva."));
    }
    function handleReset(id) {
      resetReservation(id).then(() => {
        refetchAll();
        toast.success("Reserva redefinida para pendente.");
      }).catch(() => toast.error("Erro ao redefinir reserva."));
    }
    function handleRestore(id) {
      restoreReservation(id).then(() => {
        refetchAll();
        toast.success("Reserva restaurada.");
      }).catch(() => toast.error("Erro ao restaurar reserva."));
    }
    const columns = [
      { key: "image", header: "Imagem" },
      { key: "ref", header: "Referência" },
      { key: "comercial", header: "Comercial" },
      { key: "cor", header: "Cor" },
      { key: "tamanho", header: "Tamanho" },
      { key: "qnt", header: "Qnt. Reservada" },
      { key: "estado", header: "Estado" },
      { key: "data", header: "Data", className: "text-slate-500" },
      {
        key: "acoes",
        header: "Ações",
        className: "text-right",
        headerClassName: "text-right"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex flex-col gap-3 animate-fade-in duration-200 overflow-y-auto flex-1 h-full p-3 sm:p-0"><div class="grid grid-cols-1 gap-3 md:grid-cols-2">`);
      Page_card($$renderer3, {
        class: "flex items-center justify-between p-4 sm:p-6",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex flex-col gap-1"><span class="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos em stock:</span> <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">${escape_html(displayStock())}</span></div> <div class="flex size-12 sm:size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400 shrink-0">`);
          Archive($$renderer4, { class: "size-6 sm:size-7 stroke-[1.5]" });
          $$renderer4.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Page_card($$renderer3, {
        class: "flex items-center justify-between p-4 sm:p-6",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex flex-col gap-1"><span class="text-xs font-semibold text-amber-600 dark:text-amber-400">Produtos Reservados:</span> <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">${escape_html(displayReserved())}</span></div> <div class="flex size-12 sm:size-14 items-center justify-center bg-amber-50 text-amber-600 rounded-2xl dark:bg-amber-950/40 dark:text-amber-400 shrink-0">`);
          Package($$renderer4, { class: "size-6 sm:size-7 stroke-[1.5]" });
          $$renderer4.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      Page_card($$renderer3, {
        class: "overflow-hidden flex flex-col",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-100 dark:border-slate-700 gap-2"><h2 class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">Reservas Recentes</h2> <a href="/admin/reservas" class="text-xs font-bold border-2 border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap">Ver tudo</a></div> `);
          {
            let cell = function($$renderer5, row, col) {
              if (col.key === "image") {
                $$renderer5.push("<!--[0-->");
                if (row.image) {
                  $$renderer5.push("<!--[0-->");
                  Authed_image($$renderer5, {
                    path: row.image,
                    width: 200,
                    alt: row.ref || "produto",
                    class: "size-9 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                  });
                } else {
                  $$renderer5.push("<!--[-1-->");
                  $$renderer5.push(`<div class="size-9 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 text-xs">-</div>`);
                }
                $$renderer5.push(`<!--]-->`);
              } else if (col.key === "ref") {
                $$renderer5.push("<!--[1-->");
                $$renderer5.push(`<span class="font-semibold">${escape_html(row.ref || row.product?.ref || "-")}</span>`);
              } else if (col.key === "comercial") {
                $$renderer5.push("<!--[2-->");
                $$renderer5.push(`${escape_html(row.user?.name || "-")}`);
              } else if (col.key === "cor") {
                $$renderer5.push("<!--[3-->");
                $$renderer5.push(`${escape_html(row.variant?.color || "-")}`);
              } else if (col.key === "tamanho") {
                $$renderer5.push("<!--[4-->");
                $$renderer5.push(`${escape_html(row.variant?.size || "-")}`);
              } else if (col.key === "qnt") {
                $$renderer5.push("<!--[5-->");
                $$renderer5.push(`<span class="font-bold">${escape_html(row.quantity)}</span>`);
              } else if (col.key === "data") {
                $$renderer5.push("<!--[6-->");
                $$renderer5.push(`${escape_html(row.createdAt ? new Date(row.createdAt).toLocaleDateString("pt-PT") : "-")}`);
              } else if (col.key === "estado") {
                $$renderer5.push("<!--[7-->");
                Status_badge($$renderer5, { status: getStatusInfo(row.status).label });
              } else if (col.key === "acoes") {
                $$renderer5.push("<!--[8-->");
                $$renderer5.push(`<div class="flex items-center gap-1">`);
                if (row.status === 0) {
                  $$renderer5.push("<!--[0-->");
                  Button($$renderer5, {
                    onclick: () => handleApprove(row.id),
                    class: "h-8 gap-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-none px-3",
                    children: ($$renderer6) => {
                      Check($$renderer6, { class: "size-3.5" });
                      $$renderer6.push(`<!----> <span>Aprovar</span>`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    onclick: () => handleReject(row.id),
                    class: "h-8 gap-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-none px-3",
                    children: ($$renderer6) => {
                      X($$renderer6, { class: "size-3.5" });
                      $$renderer6.push(`<!----> <span>Rejeitar</span>`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                } else if (row.status === 1) {
                  $$renderer5.push("<!--[1-->");
                  Button($$renderer5, {
                    onclick: () => handleReset(row.id),
                    class: "h-8 gap-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-none px-3",
                    children: ($$renderer6) => {
                      Rotate_ccw($$renderer6, { class: "size-3.5" });
                      $$renderer6.push(`<!----> <span>Reverter</span>`);
                    },
                    $$slots: { default: true }
                  });
                } else if (row.status === 2) {
                  $$renderer5.push("<!--[2-->");
                  Button($$renderer5, {
                    onclick: () => handleRestore(row.id),
                    class: "h-8 gap-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-none px-3",
                    children: ($$renderer6) => {
                      Rotate_ccw($$renderer6, { class: "size-3.5" });
                      $$renderer6.push(`<!----> <span>Restaurar</span>`);
                    },
                    $$slots: { default: true }
                  });
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--></div>`);
              } else {
                $$renderer5.push("<!--[-1-->");
              }
              $$renderer5.push(`<!--]-->`);
            };
            Data_table($$renderer4, {
              columns,
              data: serverReservations,
              isLoading: serverLoading,
              loadingMessage: "A carregar dados...",
              emptyMessage: "Sem dados disponíveis.",
              rowKey: (r) => r.id,
              totalRows: serverTotal,
              pageSizeOptions: [5, 10, 15],
              onPageChange: handlePageChange,
              get page() {
                return serverPage;
              },
              set page($$value) {
                serverPage = $$value;
                $$settled = false;
              },
              get size() {
                return serverSize;
              },
              set size($$value) {
                serverSize = $$value;
                $$settled = false;
              },
              cell,
              $$slots: { cell: true }
            });
          }
          $$renderer4.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
