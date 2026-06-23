import { i as escape_html, e as ensure_array_like, j as derived } from "../../../../chunks/root.js";
import { d as deleteFamily, e as getFamiliesPaginated } from "../../../../chunks/pagination.js";
import { c as createCrudModal, F as Form_field, D as Detail_grid, R as Row_actions } from "../../../../chunks/detail-grid.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
import { F as Form_select_field } from "../../../../chunks/form-select-field.js";
import { D as Data_table, S as Status_badge } from "../../../../chunks/status-badge.js";
import { g as getNumberParam, P as Plus, C as Confirm_delete_modal, A as Admin_modal } from "../../../../chunks/url-sync.svelte.js";
import { c as createDebounced } from "../../../../chunks/debounce.svelte.js";
import { a as toast } from "../../../../chunks/toast-state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { searchQuery = "" } = $$props;
    let crud = createCrudModal();
    let form = { name: "", status: "1" };
    let serverFamilies = [];
    let serverTotal = 0;
    let serverPage = getNumberParam("page", 1);
    let serverSize = getNumberParam("size", 25);
    let serverLoading = false;
    async function doFetch(page, size) {
      serverLoading = true;
      try {
        const result = await getFamiliesPaginated({ page, limit: size, search: searchQuery || void 0 });
        serverFamilies = result.families;
        serverTotal = result.total;
        serverPage = page;
      } catch {
        serverFamilies = [];
        serverTotal = 0;
      } finally {
        serverLoading = false;
      }
    }
    createDebounced(() => searchQuery);
    function handlePageChange(page, size) {
      doFetch(page, size);
    }
    function refetchFamilies() {
      doFetch(serverPage, serverSize);
    }
    function handleOpenAdd() {
      form = { name: "", status: "1" };
      crud.openAdd();
    }
    function handleOpenEdit(fam) {
      form = { name: fam.name, status: fam.status.toString() };
      crud.openEdit(fam);
    }
    async function handleDelete() {
      if (!crud.selected?.id) return;
      try {
        await deleteFamily(crud.selected.id);
        refetchFamilies();
        toast.success("Família removida com sucesso.");
        crud.close();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao eliminar família.");
      }
    }
    let familyProducts = derived(() => {
      const sel = crud.selected;
      if (!sel?.name) return [];
      const id = sel.id;
      const nameUpper = sel.name.toUpperCase();
      return [].filter((p) => p.familyId === id || p.family?.name.toUpperCase() === nameUpper);
    });
    let productCountsByFamily = derived(() => {
      const counts = {};
      [].forEach((p) => {
        const famName = p.family?.name || "Sem Família";
        counts[famName.toUpperCase()] = (counts[famName.toUpperCase()] || 0) + 1;
      });
      return counts;
    });
    const columns = [
      { key: "name", header: "Nome da Família", className: "w-1/4" },
      {
        key: "products",
        header: "Produtos Associados",
        className: "w-1/4 text-center",
        headerClassName: "text-center"
      },
      {
        key: "status",
        header: "Status",
        className: "w-1/4 text-center",
        headerClassName: "text-center"
      },
      {
        key: "acoes",
        header: "Ações",
        className: "w-1/4 text-right",
        headerClassName: "text-right"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex flex-col gap-3 animate-fade-in duration-200 h-full min-h-0 overflow-hidden relative p-3 sm:p-0"><div class="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700 shrink-0"><h1 class="text-sm sm:text-base font-bold text-slate-800 dark:text-white">Gestão de Famílias de Produtos</h1> `);
      Button($$renderer3, {
        onclick: handleOpenAdd,
        class: "h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "size-3.5" });
          $$renderer4.push(`<!----><span>Adicionar Família</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      {
        let cell = function($$renderer4, row, col) {
          if (col.key === "name") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<span class="font-semibold">${escape_html(row.name)}</span>`);
          } else if (col.key === "products") {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(`<span class="text-center font-medium">${escape_html(productCountsByFamily()[row.name.toUpperCase()] || 0)}</span>`);
          } else if (col.key === "status") {
            $$renderer4.push("<!--[2-->");
            Status_badge($$renderer4, { status: row.status === 1 ? "Ativo" : "Inativo" });
          } else if (col.key === "acoes") {
            $$renderer4.push("<!--[3-->");
            Row_actions($$renderer4, {
              onView: () => crud.openView(row),
              onEdit: () => handleOpenEdit(row),
              onDelete: () => crud.openDelete(row)
            });
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Data_table($$renderer3, {
          columns,
          data: serverFamilies,
          isLoading: serverLoading,
          loadingMessage: "A carregar famílias...",
          emptyMessage: "Sem famílias disponíveis.",
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
        {
          let footer = function($$renderer4) {
            Button($$renderer4, {
              variant: "outline",
              onclick: crud.close,
              class: "h-10 px-4",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Cancelar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              type: "submit",
              form: "fam-form",
              class: "h-10 bg-amber-400 hover:bg-amber-500 text-[#1F2937] px-5 font-semibold",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Salvar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          };
          Admin_modal($$renderer3, {
            open: true,
            onClose: crud.close,
            title: crud.isAdd ? "Adicionar Família" : "Editar Família",
            footer,
            children: ($$renderer4) => {
              $$renderer4.push(`<form id="fam-form" class="flex flex-col gap-4">`);
              Form_field($$renderer4, {
                label: "Nome da Família",
                for: "fam-name",
                children: ($$renderer5) => {
                  Input($$renderer5, {
                    id: "fam-name",
                    required: true,
                    placeholder: "Ex: TEXTIL",
                    get value() {
                      return form.name;
                    },
                    set value($$value) {
                      form.name = $$value;
                      $$settled = false;
                    }
                  });
                }
              });
              $$renderer4.push(`<!----> `);
              Form_select_field($$renderer4, {
                label: "Status",
                id: "fam-status",
                options: [
                  { value: "1", label: "Ativo" },
                  { value: "0", label: "Inativo" }
                ],
                get value() {
                  return form.status;
                },
                set value($$value) {
                  form.status = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></form>`);
            }
          });
        }
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
            title: "Detalhes da Família",
            footer,
            children: ($$renderer4) => {
              Detail_grid($$renderer4, {
                items: [
                  { label: "Nome da Família", value: crud.selected.name },
                  {
                    label: "Status",
                    value: crud.selected.status === 1 ? "Ativo" : "Inativo"
                  }
                ]
              });
              $$renderer4.push(`<!----> <div class="border-t border-slate-100 dark:border-slate-800/60 my-3"></div> <div><span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Produtos Associados (${escape_html(familyProducts().length)})</span> `);
              if (familyProducts().length > 0) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="max-h-[200px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40"><!--[-->`);
                const each_array = ensure_array_like(familyProducts());
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let prod = each_array[$$index];
                  $$renderer4.push(`<div class="p-3 flex items-center justify-between text-sm"><div class="flex flex-col"><span class="font-bold text-slate-800 dark:text-slate-200">${escape_html(prod.name)}</span> <span class="text-xs text-slate-400 font-mono">Ref: ${escape_html(prod.ref)}</span></div> <span class="text-xs font-semibold px-2 py-0.5 bg-slate-50 dark:bg-slate-950/60 text-slate-500 rounded">Stock: ${escape_html(prod.quantity)}</span></div>`);
                }
                $$renderer4.push(`<!--]--></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<span class="text-sm text-slate-500 italic">Nenhum produto cadastrado nesta família.</span>`);
              }
              $$renderer4.push(`<!--]--></div>`);
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
        title: "Eliminar Família",
        itemName: crud.selected?.name || ""
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
