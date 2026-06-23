import { i as escape_html, j as derived, b as attr } from "../../../../chunks/root.js";
import { i as deleteReservation, a as approveReservation, r as rejectReservation, b as resetReservation, c as restoreReservation, g as getReservationsPaginated } from "../../../../chunks/pagination.js";
import { C as Check, R as Rotate_ccw, r as reservationStatusInfo } from "../../../../chunks/stock-types.js";
import "../../../../chunks/api-client.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
import { F as Form_field, c as createCrudModal, D as Detail_grid, R as Row_actions } from "../../../../chunks/detail-grid.js";
import { F as Form_select_field } from "../../../../chunks/form-select-field.js";
import { A as Admin_modal, S as Searchable_select, a as getStringParam, g as getNumberParam, P as Plus, C as Confirm_delete_modal } from "../../../../chunks/url-sync.svelte.js";
import { A as Admin_filters_drawer } from "../../../../chunks/admin-filters-drawer.js";
import { D as Data_table, S as Status_badge } from "../../../../chunks/status-badge.js";
import { X } from "../../../../chunks/x.js";
import { a as toast } from "../../../../chunks/toast-state.svelte.js";
function Reservation_form_modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open, isEdit, initial, onClose } = $$props;
    let form = structuredClone(initial);
    let selectedProduct = derived(() => form.productId ? [].find((p) => p.id.toString() === form.productId) || null : null);
    let userOptions = derived(() => [].map((u) => ({ value: u.id.toString(), label: u.name })));
    let quoteOptions = derived(() => [].map((q) => ({ value: q.id.toString(), label: q.reference })));
    let productOptions = derived(() => [].map((p) => ({ value: p.id.toString(), label: `${p.ref} - ${p.name}` })));
    let variantOptions = derived(() => selectedProduct()?.variants ? selectedProduct().variants.map((v) => ({
      value: v.id.toString(),
      label: `${v.color}${v.size ? ` / ${v.size}` : ""} (Disp: ${v.quantity - v.reserved})`
    })) : []);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (open) {
        $$renderer3.push("<!--[0-->");
        {
          let footer = function($$renderer4) {
            Button($$renderer4, {
              variant: "outline",
              onclick: onClose,
              class: "h-10 px-4",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Cancelar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              type: "submit",
              form: "reservation-form",
              class: "h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Salvar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          };
          Admin_modal($$renderer3, {
            open,
            onClose,
            title: isEdit ? "Editar Reserva" : "Criar Nova Reserva",
            footer,
            children: ($$renderer4) => {
              $$renderer4.push(`<form id="reservation-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
              Form_select_field($$renderer4, {
                label: "Comercial",
                id: "res-comercial",
                options: userOptions(),
                placeholder: "Selecione um comercial",
                get value() {
                  return form.userId;
                },
                set value($$value) {
                  form.userId = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> <div class="flex flex-col gap-1.5"><label for="res-quote" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Orçamento</label> `);
              Searchable_select($$renderer4, {
                id: "res-quote",
                options: quoteOptions(),
                placeholder: "Selecionar orçamento (opcional)",
                searchPlaceholder: "Procurar por referência...",
                emptyMessage: "Nenhum orçamento encontrado.",
                get value() {
                  return form.quoteId;
                },
                set value($$value) {
                  form.quoteId = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></div> <div class="flex flex-col gap-1.5 md:col-span-2"><label for="res-produto" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Selecionar Produto</label> `);
              Searchable_select($$renderer4, {
                id: "res-produto",
                options: productOptions(),
                disabled: isEdit,
                placeholder: "Selecione o produto",
                get value() {
                  return form.productId;
                },
                set value($$value) {
                  form.productId = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></div> `);
              if (selectedProduct() && selectedProduct().variants?.length > 0) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="flex flex-col gap-1.5 md:col-span-2"><label for="res-variant" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Variante (Cor / Tamanho)</label> `);
                Searchable_select($$renderer4, {
                  id: "res-variant",
                  options: variantOptions(),
                  disabled: isEdit,
                  placeholder: "Geral (Sem variante específica)",
                  get value() {
                    return form.variantId;
                  },
                  set value($$value) {
                    form.variantId = $$value;
                    $$settled = false;
                  }
                });
                $$renderer4.push(`<!----></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> `);
              Form_field($$renderer4, {
                label: "Quantidade",
                for: "res-qty",
                children: ($$renderer5) => {
                  Input($$renderer5, {
                    id: "res-qty",
                    type: "number",
                    required: true,
                    min: "1",
                    get value() {
                      return form.quantity;
                    },
                    set value($$value) {
                      form.quantity = $$value;
                      $$settled = false;
                    }
                  });
                }
              });
              $$renderer4.push(`<!----> <div class="flex flex-col gap-1.5 md:col-span-2"><label for="res-message" class="text-xs font-semibold text-slate-600 dark:text-slate-400">Mensagem / Observações</label> <textarea id="res-message" placeholder="Nota ou comentário da reserva..." class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-[80px]">`);
              const $$body = escape_html(form.message);
              if ($$body) {
                $$renderer4.push(`${$$body}`);
              }
              $$renderer4.push(`</textarea></div> `);
              if (isEdit) {
                $$renderer4.push("<!--[0-->");
                Form_select_field($$renderer4, {
                  label: "Estado da Reserva",
                  id: "res-status",
                  options: [
                    { value: "0", label: "Pendente" },
                    { value: "1", label: "Confirmada" },
                    { value: "2", label: "Cancelada" }
                  ],
                  placeholder: "Selecionar estado",
                  get value() {
                    return form.status;
                  },
                  set value($$value) {
                    form.status = $$value;
                    $$settled = false;
                  }
                });
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></form>`);
            }
          });
        }
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
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function getStatusInfo(status) {
      return reservationStatusInfo(status);
    }
    let { searchQuery = "" } = $$props;
    let crud = createCrudModal();
    let appliedEstado = getStringParam("estado", "Todos");
    let pendingEstado = getStringParam("estado", "Todos");
    let form = {
      userId: "",
      productId: "",
      variantId: "",
      quantity: "1",
      message: "",
      status: "0",
      quoteId: ""
    };
    let serverReservations = [];
    let serverTotal = 0;
    let serverPage = getNumberParam("page", 1);
    let serverSize = getNumberParam("size", 25);
    let serverLoading = false;
    function statusToBackend(status) {
      if (status === "Todos") return void 0;
      if (status === "Pendente") return "0";
      if (status === "Confirmada") return "1";
      return "2";
    }
    async function doFetch(page, size) {
      serverLoading = true;
      try {
        const result = await getReservationsPaginated({
          page,
          limit: size,
          search: searchQuery || void 0,
          status: statusToBackend(appliedEstado)
        });
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
    function applyFilters() {
      appliedEstado = pendingEstado;
    }
    function clearAll() {
      pendingEstado = "Todos";
      applyFilters();
    }
    function handlePageChange(page, size) {
      doFetch(page, size);
    }
    function refetchReservations() {
      doFetch(serverPage, serverSize);
    }
    function resetForm() {
      form = {
        userId: "",
        productId: "",
        variantId: "",
        quantity: "1",
        message: "",
        status: "0",
        quoteId: ""
      };
    }
    function handleOpenAdd() {
      resetForm();
      form.userId = "";
      form.productId = "";
      crud.openAdd();
    }
    function handleOpenEdit(res) {
      form = {
        userId: res.userId?.toString() || "",
        productId: res.productId.toString(),
        variantId: res.variantId?.toString() || "",
        quantity: res.quantity.toString(),
        message: res.message || "",
        status: res.status.toString(),
        quoteId: res.quoteId?.toString() || ""
      };
      crud.openEdit(res);
    }
    async function handleApprove(id) {
      try {
        await approveReservation(id);
        refetchReservations();
        toast.success("Reserva confirmada com sucesso.");
      } catch {
        toast.error("Erro ao confirmar reserva.");
      }
    }
    async function handleReject(id) {
      try {
        await rejectReservation(id);
        refetchReservations();
        toast.success("Reserva rejeitada.");
      } catch {
        toast.error("Erro ao rejeitar reserva.");
      }
    }
    async function handleRestore(id) {
      try {
        await restoreReservation(id);
        refetchReservations();
        toast.success("Reserva restaurada.");
      } catch {
        toast.error("Erro ao restaurar reserva.");
      }
    }
    async function handleReset(id) {
      try {
        await resetReservation(id);
        refetchReservations();
        toast.success("Reserva redefinida para pendente.");
      } catch {
        toast.error("Erro ao redefinir reserva.");
      }
    }
    async function handleDelete() {
      if (!crud.selected?.id) return;
      try {
        await deleteReservation(crud.selected.id);
        refetchReservations();
        toast.success("Reserva eliminada com sucesso.");
        crud.close();
      } catch {
        toast.error("Erro ao eliminar reserva.");
      }
    }
    const columns = [
      { key: "comercial", header: "Comercial" },
      { key: "ref", header: "Referência" },
      { key: "cor", header: "Cor" },
      { key: "tamanho", header: "Tamanho" },
      { key: "quantidade", header: "Quantidade" },
      { key: "mensagem", header: "Mensagem" },
      { key: "orcamento", header: "Orçamento" },
      { key: "estado", header: "Estado" },
      { key: "data", header: "Data", className: "text-slate-400" },
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
      $$renderer3.push(`<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative p-3 sm:p-0">`);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">`);
          Form_select_field($$renderer4, {
            label: "Estado",
            id: "filter-estado-res",
            options: [
              { value: "Todos", label: "Todos" },
              { value: "Pendente", label: "Pendente" },
              { value: "Confirmada", label: "Confirmada" },
              { value: "Cancelada", label: "Cancelada" }
            ],
            class: "h-8",
            get value() {
              return pendingEstado;
            },
            set value($$value) {
              pendingEstado = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div>`);
        };
        Admin_filters_drawer($$renderer3, {
          title: "Gestão de Reservas",
          activeCount: appliedEstado !== "Todos" ? 1 : 0,
          hasPendingChanges: pendingEstado !== appliedEstado,
          onApply: applyFilters,
          onClear: clearAll,
          children
        });
      }
      $$renderer3.push(`<!----> <div class="flex items-center gap-2">`);
      Button($$renderer3, {
        onclick: handleOpenAdd,
        class: "h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "size-3.5" });
          $$renderer4.push(`<!----><span>Criar Reserva</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      {
        let cell = function($$renderer4, row, col) {
          if (col.key === "comercial") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<span class="font-semibold">${escape_html(row.user?.name || "-")}</span>`);
          } else if (col.key === "ref") {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(`<span class="font-semibold">${escape_html(row.ref || row.product?.ref || "-")}</span>`);
          } else if (col.key === "cor") {
            $$renderer4.push("<!--[2-->");
            $$renderer4.push(`${escape_html(row.variant?.color || "-")}`);
          } else if (col.key === "tamanho") {
            $$renderer4.push("<!--[3-->");
            $$renderer4.push(`${escape_html(row.variant?.size || "-")}`);
          } else if (col.key === "quantidade") {
            $$renderer4.push("<!--[4-->");
            $$renderer4.push(`<span class="font-bold">${escape_html(row.quantity)}</span>`);
          } else if (col.key === "mensagem") {
            $$renderer4.push("<!--[5-->");
            $$renderer4.push(`<span class="max-w-[150px] truncate block"${attr("title", row.message || "")}>${escape_html(row.message || "-")}</span>`);
          } else if (col.key === "orcamento") {
            $$renderer4.push("<!--[6-->");
            $$renderer4.push(`${escape_html(row.quote?.reference || "-")}`);
          } else if (col.key === "estado") {
            $$renderer4.push("<!--[7-->");
            const info = getStatusInfo(row.status);
            Status_badge($$renderer4, { status: info.label });
          } else if (col.key === "data") {
            $$renderer4.push("<!--[8-->");
            $$renderer4.push(`${escape_html(row.createdAt ? new Date(row.createdAt).toLocaleDateString("pt-PT") : "-")}`);
          } else if (col.key === "acoes") {
            $$renderer4.push("<!--[9-->");
            $$renderer4.push(`<div class="flex items-center justify-end gap-1">`);
            if (row.status === 0) {
              $$renderer4.push("<!--[0-->");
              Button($$renderer4, {
                variant: "ghost",
                size: "icon",
                onclick: () => handleApprove(row.id),
                class: "size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50",
                title: "Confirmar reserva",
                children: ($$renderer5) => {
                  Check($$renderer5, { class: "size-4" });
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "ghost",
                size: "icon",
                onclick: () => handleReject(row.id),
                class: "size-8 text-red-500 hover:text-red-700 hover:bg-red-50",
                title: "Rejeitar reserva",
                children: ($$renderer5) => {
                  X($$renderer5, { class: "size-4" });
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            } else if (row.status === 1) {
              $$renderer4.push("<!--[1-->");
              Button($$renderer4, {
                variant: "ghost",
                size: "icon",
                onclick: () => handleReset(row.id),
                class: "size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50",
                title: "Reverter para pendente",
                children: ($$renderer5) => {
                  Rotate_ccw($$renderer5, { class: "size-4" });
                },
                $$slots: { default: true }
              });
            } else if (row.status === 2) {
              $$renderer4.push("<!--[2-->");
              Button($$renderer4, {
                variant: "ghost",
                size: "icon",
                onclick: () => handleRestore(row.id),
                class: "size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50",
                title: "Restaurar reserva",
                children: ($$renderer5) => {
                  Rotate_ccw($$renderer5, { class: "size-4" });
                },
                $$slots: { default: true }
              });
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            Row_actions($$renderer4, {
              onView: () => crud.openView(row),
              onEdit: () => handleOpenEdit(row),
              onDelete: () => crud.openDelete(row)
            });
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Data_table($$renderer3, {
          columns,
          data: serverReservations,
          isLoading: serverLoading,
          loadingMessage: "A carregar reservas...",
          emptyMessage: "Sem reservas disponíveis.",
          rowKey: (r) => r.id,
          totalRows: serverTotal,
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
      $$renderer3.push(`<!----> `);
      if (crud.isAdd || crud.isEdit) {
        $$renderer3.push("<!--[0-->");
        Reservation_form_modal($$renderer3, {
          open: crud.isAdd || crud.isEdit,
          isEdit: crud.isEdit,
          initial: {
            id: crud.selected?.id,
            userId: form.userId,
            productId: form.productId,
            variantId: form.variantId,
            quantity: form.quantity,
            message: form.message,
            status: form.status,
            quoteId: form.quoteId
          },
          onClose: crud.close
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (crud.isView && crud.selected) {
        $$renderer3.push("<!--[0-->");
        {
          let footer = function($$renderer4) {
            Button($$renderer4, {
              onclick: crud.close,
              class: "h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Fechar`);
              },
              $$slots: { default: true }
            });
          };
          Admin_modal($$renderer3, {
            open: true,
            onClose: crud.close,
            title: "Detalhes da Reserva",
            footer,
            children: ($$renderer4) => {
              Detail_grid($$renderer4, {
                items: [
                  {
                    label: "Comercial",
                    value: crud.selected.user?.name || "Sem Nome"
                  },
                  {
                    label: "Produto (Ref)",
                    value: `${crud.selected.product?.name || "Produto"} (${crud.selected.ref || crud.selected.product?.ref})`
                  },
                  {
                    label: "Variante",
                    value: `${crud.selected.variant?.color || "-"}${crud.selected.variant?.size ? ` / ${crud.selected.variant.size}` : ""}`
                  },
                  {
                    label: "Quantidade",
                    value: `${crud.selected.quantity} unidades`
                  },
                  {
                    label: "Orçamento",
                    value: crud.selected.quote?.reference || "-"
                  },
                  {
                    label: "Estado",
                    value: getStatusInfo(Number(crud.selected.status)).label
                  }
                ]
              });
              $$renderer4.push(`<!----> `);
              if (crud.selected.message) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="mt-2"><span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mensagem</span> <p class="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">${escape_html(crud.selected.message)}</p></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      Confirm_delete_modal($$renderer3, {
        open: crud.isDelete,
        onClose: crud.close,
        onConfirm: handleDelete,
        title: "Eliminar Reserva",
        itemName: crud.selected ? `${crud.selected.quantity}x ${crud.selected.product?.name || "Produto"} (${crud.selected.user?.name || "-"})` : ""
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
