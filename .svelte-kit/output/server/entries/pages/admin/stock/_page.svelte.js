import { m as sanitize_props, f as spread_props, n as slot, e as ensure_array_like, i as escape_html, b as attr, a as attr_class, j as derived } from "../../../../chunks/root.js";
import { L as Loader_circle, j as deleteProduct, k as getProductsPaginated } from "../../../../chunks/pagination.js";
import { a as apiClient } from "../../../../chunks/api-client.js";
import { F as Form_field, c as createCrudModal, D as Detail_grid, R as Row_actions } from "../../../../chunks/detail-grid.js";
import { A as Authed_image } from "../../../../chunks/authed-image.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
import { P as Plus, S as Searchable_select, g as getNumberParam, a as getStringParam, C as Confirm_delete_modal, A as Admin_modal } from "../../../../chunks/url-sync.svelte.js";
import { M as Multi_searchable_select } from "../../../../chunks/multi-searchable-select.js";
import { A as Admin_filters_drawer } from "../../../../chunks/admin-filters-drawer.js";
import { D as Data_table, S as Status_badge } from "../../../../chunks/status-badge.js";
import { X } from "../../../../chunks/x.js";
import { c as createDebounced } from "../../../../chunks/debounce.svelte.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { a as toast } from "../../../../chunks/toast-state.svelte.js";
function Download($$renderer, $$props) {
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
    ["path", { "d": "M12 15V3" }],
    ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { "d": "m7 10 5 5 5-5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "download" },
    $$sanitized_props,
    {
      /**
       * @component @name Download
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTVWMyIgLz4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cGF0aCBkPSJtNyAxMCA1IDUgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
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
function Product_variants_editor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      variants,
      errors = {},
      onAddVariant,
      onAddSize
    } = $$props;
    $$renderer2.push(`<div class="space-y-3 py-5 border-b-2 border-slate-100 dark:border-slate-700"><span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">Variantes</span> <!--[-->`);
    const each_array = ensure_array_like(variants);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let variant = each_array[i];
      $$renderer2.push(`<div class="rounded-xl border-2 border-slate-100 bg-slate-50/50 p-4 space-y-3 dark:border-slate-700 dark:bg-slate-800/30 animate-in fade-in duration-200"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-500 dark:text-slate-400">Variante #${escape_html(i + 1)}</span> <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" aria-label="Remover variante">`);
      X($$renderer2, { class: "size-4" });
      $$renderer2.push(`<!----></button></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3"><div class="flex flex-col gap-0.5"><label${attr("for", `ap-vc-${i}`)} class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cor</label> <input${attr("id", `ap-vc-${i}`)} placeholder="Ex: Vermelho"${attr("value", variant.color)}${attr_class(`flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700 ${errors[`variant_${i}_color`] ? "border-red-400" : ""}`)}/> `);
      if (errors[`variant_${i}_color`]) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-[10px] text-red-500 mt-0.5">${escape_html(errors[`variant_${i}_color`])}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="flex flex-col gap-0.5"><label${attr("for", `ap-vcx-${i}`)} class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Caixa</label> <input${attr("id", `ap-vcx-${i}`)} placeholder="CX"${attr("value", variant.cx)} class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"/></div> <div class="flex flex-col gap-0.5"><label${attr("for", `ap-vd-${i}`)} class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gaveta</label> <input${attr("id", `ap-vd-${i}`)} placeholder="Gaveta"${attr("value", variant.drawer)} class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"/></div></div> <div class="space-y-2">`);
      if (variant.sizes.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="space-y-1.5"><!--[-->`);
        const each_array_1 = ensure_array_like(variant.sizes);
        for (let si = 0, $$length2 = each_array_1.length; si < $$length2; si++) {
          let size = each_array_1[si];
          $$renderer2.push(`<div class="flex items-center gap-2"><input type="text" placeholder="Tam."${attr("value", size.size)} class="w-16 rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm text-center dark:border-slate-700"/> <input type="number" min="0" placeholder="Qtd"${attr("value", size.quantity)} class="w-20 rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm text-center dark:border-slate-700"/> <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" aria-label="Remover tamanho">`);
          X($$renderer2, { class: "size-4" });
          $$renderer2.push(`<!----></button></div>`);
        }
        $$renderer2.push(`<!--]--> `);
        Button($$renderer2, {
          type: "button",
          variant: "outline",
          onclick: () => onAddSize(i),
          class: "h-7 text-xs gap-1",
          children: ($$renderer3) => {
            Plus($$renderer3, { class: "size-3" });
            $$renderer3.push(`<!----> <span>Adicionar Tamanho</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="flex flex-col gap-0.5"><label${attr("for", `ap-vq-${i}`)} class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantidade</label> <input${attr("id", `ap-vq-${i}`)} type="number" min="0"${attr("value", variant.quantity)} class="flex w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm dark:border-slate-700"/> <button type="button" class="mt-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1">`);
        Plus($$renderer2, { class: "size-3" });
        $$renderer2.push(`<!----> <span>Adicionar tamanhos</span></button></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2"><span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Imagens</span> <div class="flex flex-wrap gap-2"><!--[-->`);
      const each_array_2 = ensure_array_like(variant.existingImages);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let url = each_array_2[$$index_1];
        $$renderer2.push(`<div class="size-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">`);
        Authed_image($$renderer2, {
          path: url,
          width: 200,
          alt: "",
          class: "size-full object-contain"
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_3 = ensure_array_like(variant.previews);
      for (let imgIdx = 0, $$length2 = each_array_3.length; imgIdx < $$length2; imgIdx++) {
        let preview = each_array_3[imgIdx];
        $$renderer2.push(`<div class="relative group size-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><img${attr("src", preview)} alt="" class="size-full object-cover"/> <button type="button" class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remover imagem">`);
        X($$renderer2, { class: "size-4 text-white" });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]--> <label class="flex size-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-slate-600 dark:hover:border-amber-400"><span class="text-[10px] font-bold">+</span> <input type="file" accept="image/*" multiple="" class="hidden"/></label></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    Button($$renderer2, {
      type: "button",
      variant: "outline",
      onclick: onAddVariant,
      class: "w-full h-9 border-dashed border-2 border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 dark:border-slate-600 dark:text-slate-400",
      children: ($$renderer3) => {
        Plus($$renderer3, { class: "size-4" });
        $$renderer3.push(`<!----> <span>Adicionar Cor</span>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
function Add_product_modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      onClose = () => {
      },
      onSuccess = () => {
      },
      fornecedores = [],
      editProduct = null
    } = $$props;
    let isLoading = false;
    let errors = {};
    let isEditMode = derived(() => !!editProduct);
    let form = {
      type: "",
      categoryId: "",
      familyId: "",
      name: "",
      description: "",
      ref: "",
      pc: "0",
      pvp: "0"
    };
    let variants = [createEmptyVariant()];
    function createEmptyVariant() {
      return {
        id: null,
        color: "",
        cx: "",
        drawer: "",
        quantity: "0",
        reserved: "0",
        sizes: [],
        images: [],
        previews: [],
        existingImages: []
      };
    }
    let familyOptions = derived(() => [].map((f) => ({ value: String(f.id), label: f.name })));
    let fornecedorOptions = derived(() => fornecedores.filter((f) => f !== "Todas").map((f) => ({ value: f, label: f })));
    let categoryOptions = derived(() => [].map((c) => ({ value: String(c.id), label: c.name })));
    function addVariant() {
      variants = [...variants, createEmptyVariant()];
    }
    function addSize(variantIndex) {
      variants = variants.map((v, i) => i === variantIndex ? {
        ...v,
        sizes: [...v.sizes, { size: "", quantity: "0", id: null }]
      } : v);
    }
    function revokePreviews(index) {
      for (const url of variants[index].previews) {
        URL.revokeObjectURL(url);
      }
    }
    function resetForm() {
      variants.forEach((_, i) => revokePreviews(i));
      form = {
        type: "",
        categoryId: "",
        familyId: "",
        name: "",
        description: "",
        ref: "",
        pc: "0",
        pvp: "0"
      };
      variants = [createEmptyVariant()];
      errors = {};
    }
    function handleClose() {
      resetForm();
      onClose();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (open) {
        $$renderer3.push("<!--[0-->");
        if (isEditMode() && !editProduct) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"><div class="flex items-center justify-center p-8 bg-white rounded-2xl dark:bg-slate-900">`);
          Loader_circle($$renderer3, { class: "animate-spin size-8 text-slate-400" });
          $$renderer3.push(`<!----></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/30 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="add-product-modal-title" tabindex="-1"><div class="bg-white rounded-none sm:rounded-2xl border-0 sm:border-2 border-slate-200 shadow-lg w-full sm:max-w-2xl sm:mx-4 sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 sm:dark:border-slate-700" role="document"><div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-100 dark:border-slate-700 shrink-0"><h3 id="add-product-modal-title" class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${escape_html(isEditMode() ? "Editar Produto" : "Adicionar Produto")}</h3> `);
          Button($$renderer3, {
            variant: "ghost",
            size: "icon",
            onclick: handleClose,
            class: "size-10",
            "aria-label": "Fechar",
            children: ($$renderer4) => {
              X($$renderer4, { class: "size-4" });
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <form id="add-product-form" class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-0"><div class="space-y-4 pb-5 border-b-2 border-slate-100 dark:border-slate-700"><span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">Dados Gerais</span> <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
          Form_field($$renderer3, {
            label: "Fornecedor",
            for: "ap-type",
            children: ($$renderer4) => {
              Searchable_select($$renderer4, {
                id: "ap-type",
                options: fornecedorOptions(),
                placeholder: "Selecione um Fornecedor",
                searchPlaceholder: "Procurar fornecedor...",
                emptyMessage: "Nenhum fornecedor encontrado.",
                get value() {
                  return form.type;
                },
                set value($$value) {
                  form.type = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Form_field($$renderer3, {
            label: "Categoria",
            for: "ap-category",
            error: errors.categoryId,
            children: ($$renderer4) => {
              Searchable_select($$renderer4, {
                id: "ap-category",
                options: categoryOptions(),
                placeholder: "Selecione uma Categoria",
                get value() {
                  return form.categoryId;
                },
                set value($$value) {
                  form.categoryId = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Form_field($$renderer3, {
            label: "Família",
            for: "ap-family",
            error: errors.familyId,
            children: ($$renderer4) => {
              Searchable_select($$renderer4, {
                id: "ap-family",
                options: familyOptions(),
                placeholder: "Selecione uma Família",
                get value() {
                  return form.familyId;
                },
                set value($$value) {
                  form.familyId = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Form_field($$renderer3, {
            label: "Nome",
            for: "ap-name",
            error: errors.name,
            children: ($$renderer4) => {
              Input($$renderer4, {
                id: "ap-name",
                placeholder: "Nome do produto",
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
          $$renderer3.push(`<!----> `);
          Form_field($$renderer3, {
            label: "Referência",
            for: "ap-ref",
            error: errors.ref,
            children: ($$renderer4) => {
              Input($$renderer4, {
                id: "ap-ref",
                placeholder: "Ex: REF-001",
                get value() {
                  return form.ref;
                },
                set value($$value) {
                  form.ref = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----></div> `);
          Form_field($$renderer3, {
            label: "Descrição",
            for: "ap-desc",
            children: ($$renderer4) => {
              $$renderer4.push(`<textarea id="ap-desc" rows="3" placeholder="Descrição do produto..." class="flex w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 resize-none">`);
              const $$body = escape_html(form.description);
              if ($$body) {
                $$renderer4.push(`${$$body}`);
              }
              $$renderer4.push(`</textarea>`);
            }
          });
          $$renderer3.push(`<!----></div> `);
          Product_variants_editor($$renderer3, {
            variants,
            errors,
            onAddVariant: addVariant,
            onAddSize: addSize
          });
          $$renderer3.push(`<!----> <div class="space-y-4 pt-5"><span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest dark:text-amber-400">Preço</span> <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
          Form_field($$renderer3, {
            label: "P. Custo (€)",
            for: "ap-pc",
            children: ($$renderer4) => {
              Input($$renderer4, {
                id: "ap-pc",
                type: "number",
                step: "0.01",
                min: "0",
                get value() {
                  return form.pc;
                },
                set value($$value) {
                  form.pc = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Form_field($$renderer3, {
            label: "PVP (€)",
            for: "ap-pvp",
            children: ($$renderer4) => {
              Input($$renderer4, {
                id: "ap-pvp",
                type: "number",
                step: "0.01",
                min: "0",
                get value() {
                  return form.pvp;
                },
                set value($$value) {
                  form.pvp = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----></div></div></form> <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-slate-100 dark:border-slate-700 shrink-0 pb-safe">`);
          Button($$renderer3, {
            variant: "outline",
            onclick: handleClose,
            disabled: isLoading,
            class: "h-12 sm:h-10 px-4",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Cancelar`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            type: "submit",
            form: "add-product-form",
            disabled: isLoading,
            class: "h-12 sm:h-10 bg-[#FBBF24] hover:bg-amber-500 text-[#1F2937] px-5 font-semibold shadow-none",
            children: ($$renderer4) => {
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> ${escape_html(isEditMode() ? "Salvar Alterações" : "Adicionar Produto")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div></div>`);
        }
        $$renderer3.push(`<!--]-->`);
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
    async function downloadExport(url) {
      try {
        const response = await apiClient.get(url, { responseType: "blob" });
        const disposition = response.headers["content-disposition"];
        const match = disposition?.match(/filename="?(.+?)"?$/);
        const filename = match ? match[1] : `export-${Date.now()}.xlsx`;
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success("Ficheiro exportado com sucesso.");
      } catch {
        toast.error("Erro ao exportar ficheiro.");
      }
    }
    let { searchQuery = "" } = $$props;
    let crud = createCrudModal();
    let showAddModal = false;
    let editFullProduct = null;
    const defaultFilters = () => ({
      fornecedor: getStringParam("fornecedor", ""),
      familia: getStringParam("familia", ""),
      disponibilidade: getStringParam("disponibilidade", "Todos"),
      estado: getStringParam("estado", "Todos"),
      caixa: getStringParam("caixa") || "",
      gaveta: getStringParam("gaveta") || ""
    });
    let appliedFilters = defaultFilters();
    let pendingFilters = defaultFilters();
    let fornecedores = derived(() => {
      const set = /* @__PURE__ */ new Set();
      return Array.from(set);
    });
    let familyOptions = derived(() => [].map((f) => ({ value: f.name, label: f.name })));
    let fornecedorOptions = derived(() => fornecedores().map((f) => ({ value: f, label: f })));
    const statusFilterOptions = [
      { value: "Todos", label: "Todos" },
      { value: "Com Stock", label: "Com Stock" },
      { value: "Esgotado", label: "Esgotado" }
    ];
    const activeStatusFilterOptions = [
      { value: "Todos", label: "Todos" },
      { value: "Ativo", label: "Ativo" },
      { value: "Inativo", label: "Inativo" }
    ];
    let serverProducts = [];
    let serverTotal = 0;
    let serverPage = getNumberParam("page", 1);
    let serverSize = getNumberParam("size", 50);
    let serverLoading = false;
    function buildQueryParams(page, size) {
      return {
        page,
        limit: size,
        search: searchQuery || void 0,
        fornecedor: appliedFilters.fornecedor ? appliedFilters.fornecedor.split(",") : void 0,
        familia: appliedFilters.familia ? appliedFilters.familia.split(",") : void 0,
        disponibilidade: appliedFilters.disponibilidade !== "Todos" ? appliedFilters.disponibilidade : void 0,
        estado: appliedFilters.estado !== "Todos" ? appliedFilters.estado : void 0,
        caixa: appliedFilters.caixa || void 0,
        gaveta: appliedFilters.gaveta || void 0
      };
    }
    async function doFetch(page, size) {
      serverLoading = true;
      try {
        const result = await getProductsPaginated(buildQueryParams(page, size));
        serverProducts = result.products;
        serverTotal = result.total;
        serverPage = page;
      } catch {
        serverProducts = [];
        serverTotal = 0;
      } finally {
        serverLoading = false;
      }
    }
    createDebounced(() => searchQuery);
    function handlePageChange(page, size) {
      doFetch(page, size);
    }
    let stockRows = derived(() => serverProducts.map((product) => {
      const totalQty = product.variants.reduce((sum, v) => sum + v.quantity, 0);
      const totalReserved = product.variants.reduce((sum, v) => sum + v.reserved, 0);
      const colorList = (product.colors || []).map((c) => c.name).join(", ") || "-";
      const drawerList = [
        ...new Set(product.variants.map((v) => v.drawer).filter(Boolean))
      ].join(", ") || product.drawer || "-";
      const cxList = [
        ...new Set(product.variants.map((v) => v.cx).filter(Boolean))
      ].join(", ") || product.cx || "-";
      return {
        id: product.id,
        productId: product.id,
        name: product.name,
        ref: product.ref,
        image: product.images?.[0]?.url || null,
        color: colorList,
        quantity: totalQty,
        reserved: totalReserved,
        drawer: drawerList,
        cx: cxList,
        pvp: product.pvp,
        fornecedor: product.type || "-",
        family: product.family?.name || "-",
        estado: product.active === 1 ? "Ativo" : "Inativo"
      };
    }));
    function handleAdd() {
      showAddModal = true;
    }
    function handleView(row) {
      crud.openView(row);
    }
    function handleEdit(row) {
      editFullProduct = null;
      crud.openEdit(row);
    }
    function handleDelete(row) {
      crud.openDelete(row);
    }
    async function handleDeleteConfirm() {
      if (!crud.selected) return;
      try {
        await deleteProduct(crud.selected.productId);
        toast.success("Produto removido com sucesso.");
        crud.close();
        handleMutationSuccess();
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Erro ao eliminar produto.";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
      }
    }
    function handleMutationSuccess() {
      doFetch(serverPage, serverSize);
    }
    function countActive(f) {
      return (f.fornecedor ? 1 : 0) + (f.familia ? 1 : 0) + (f.disponibilidade !== "Todos" ? 1 : 0) + (f.estado !== "Todos" ? 1 : 0);
    }
    let activeFilterCount = derived(() => countActive(appliedFilters));
    let hasPendingChanges = derived(() => pendingFilters.fornecedor !== appliedFilters.fornecedor || pendingFilters.familia !== appliedFilters.familia || pendingFilters.disponibilidade !== appliedFilters.disponibilidade || pendingFilters.estado !== appliedFilters.estado || pendingFilters.caixa !== appliedFilters.caixa || pendingFilters.gaveta !== appliedFilters.gaveta);
    function syncPendingToApplied() {
      appliedFilters.fornecedor = pendingFilters.fornecedor;
      appliedFilters.familia = pendingFilters.familia;
      appliedFilters.disponibilidade = pendingFilters.disponibilidade;
      appliedFilters.estado = pendingFilters.estado;
      appliedFilters.caixa = pendingFilters.caixa;
      appliedFilters.gaveta = pendingFilters.gaveta;
    }
    function applyFilters() {
      syncPendingToApplied();
    }
    function clearAll() {
      pendingFilters.fornecedor = "";
      pendingFilters.familia = "";
      pendingFilters.disponibilidade = "Todos";
      pendingFilters.estado = "Todos";
      pendingFilters.caixa = "";
      pendingFilters.gaveta = "";
      applyFilters();
    }
    const columns = [
      { key: "image", header: "Imagem" },
      { key: "ref", header: "Ref" },
      { key: "color", header: "Cor" },
      { key: "qntd", header: "Qntd" },
      { key: "qntdR", header: "Qntd R." },
      { key: "gaveta", header: "Gaveta" },
      { key: "cx", header: "Cx" },
      { key: "pvp", header: "Pvp" },
      { key: "fornecedor", header: "Fornecedor" },
      { key: "estado", header: "Estado" },
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
          $$renderer4.push(`<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1.5 sm:gap-2"><div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fornecedor</span> `);
          Multi_searchable_select($$renderer4, {
            options: fornecedorOptions(),
            placeholder: "Todos",
            searchPlaceholder: "Procurar...",
            emptyMessage: "Nenhum encontrado.",
            class: "h-8",
            get value() {
              return pendingFilters.fornecedor;
            },
            set value($$value) {
              pendingFilters.fornecedor = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Família</span> `);
          Multi_searchable_select($$renderer4, {
            options: familyOptions(),
            placeholder: "Todas",
            searchPlaceholder: "Procurar...",
            emptyMessage: "Nenhuma encontrada.",
            class: "h-8",
            get value() {
              return pendingFilters.familia;
            },
            set value($$value) {
              pendingFilters.familia = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponibilidade</span> `);
          Searchable_select($$renderer4, {
            options: statusFilterOptions,
            placeholder: "Todos",
            searchPlaceholder: "Procurar...",
            emptyMessage: "Nenhuma opção.",
            class: "h-8",
            get value() {
              return pendingFilters.disponibilidade;
            },
            set value($$value) {
              pendingFilters.disponibilidade = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</span> `);
          Searchable_select($$renderer4, {
            options: activeStatusFilterOptions,
            placeholder: "Todos",
            searchPlaceholder: "Procurar...",
            emptyMessage: "Nenhuma opção.",
            class: "h-8",
            get value() {
              return pendingFilters.estado;
            },
            set value($$value) {
              pendingFilters.estado = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div> <div class="grid grid-cols-2 gap-1.5 sm:gap-2"><div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Caixa (CX)</span> `);
          Input($$renderer4, {
            placeholder: "Digite o nome da caixa...",
            class: "h-8 text-sm",
            get value() {
              return pendingFilters.caixa;
            },
            set value($$value) {
              pendingFilters.caixa = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="flex flex-col gap-0.5"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gaveta</span> `);
          Input($$renderer4, {
            placeholder: "Digite o nome da gaveta...",
            class: "h-8 text-sm",
            get value() {
              return pendingFilters.gaveta;
            },
            set value($$value) {
              pendingFilters.gaveta = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        };
        Admin_filters_drawer($$renderer3, {
          title: "Gestão de Stock",
          activeCount: activeFilterCount(),
          hasPendingChanges: hasPendingChanges(),
          onApply: applyFilters,
          onClear: clearAll,
          children
        });
      }
      $$renderer3.push(`<!----> <div class="flex flex-wrap items-center gap-2">`);
      Button($$renderer3, {
        onclick: handleAdd,
        class: "h-8 bg-[#FBBF24] text-[#1F2937] hover:bg-amber-500 px-3 rounded-lg flex items-center gap-1.5 font-semibold shadow-none text-xs",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "size-3.5" });
          $$renderer4.push(`<!----><span>Adicionar Produto</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        variant: "outline",
        size: "sm",
        class: "h-8 gap-1 text-xs",
        onclick: () => downloadExport("/exports/stock-by-cx"),
        children: ($$renderer4) => {
          Download($$renderer4, { class: "size-3.5" });
          $$renderer4.push(`<!----><span class="hidden sm:inline">Exportar por Caixa</span><span class="sm:hidden">Por Caixa</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        variant: "outline",
        size: "sm",
        class: "h-8 gap-1 text-xs",
        onclick: () => downloadExport("/exports/products"),
        children: ($$renderer4) => {
          Download($$renderer4, { class: "size-3.5" });
          $$renderer4.push(`<!----><span>Exportar</span>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      {
        let cell = function($$renderer4, row, col) {
          if (col.key === "image") {
            $$renderer4.push("<!--[0-->");
            if (row.image) {
              $$renderer4.push("<!--[0-->");
              Authed_image($$renderer4, {
                path: row.image,
                width: 200,
                alt: row.name,
                class: "size-10 object-contain rounded-md border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
              });
            } else {
              $$renderer4.push("<!--[-1-->");
              $$renderer4.push(`<div class="size-10 flex items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">-</div>`);
            }
            $$renderer4.push(`<!--]-->`);
          } else if (col.key === "ref") {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(`<span class="font-semibold">${escape_html(row.ref)}</span>`);
          } else if (col.key === "color") {
            $$renderer4.push("<!--[2-->");
            $$renderer4.push(`${escape_html(row.color)}`);
          } else if (col.key === "qntd") {
            $$renderer4.push("<!--[3-->");
            $$renderer4.push(`${escape_html(row.quantity)}`);
          } else if (col.key === "qntdR") {
            $$renderer4.push("<!--[4-->");
            $$renderer4.push(`${escape_html(row.reserved)}`);
          } else if (col.key === "gaveta") {
            $$renderer4.push("<!--[5-->");
            $$renderer4.push(`${escape_html(row.drawer)}`);
          } else if (col.key === "cx") {
            $$renderer4.push("<!--[6-->");
            $$renderer4.push(`${escape_html(row.cx)}`);
          } else if (col.key === "pvp") {
            $$renderer4.push("<!--[7-->");
            $$renderer4.push(`${escape_html(row.pvp.toFixed(2))} €`);
          } else if (col.key === "fornecedor") {
            $$renderer4.push("<!--[8-->");
            $$renderer4.push(`${escape_html(row.fornecedor)}`);
          } else if (col.key === "estado") {
            $$renderer4.push("<!--[9-->");
            Status_badge($$renderer4, { status: row.estado });
          } else if (col.key === "acoes") {
            $$renderer4.push("<!--[10-->");
            Row_actions($$renderer4, {
              onView: () => handleView(row),
              onEdit: () => handleEdit(row),
              onDelete: () => handleDelete(row)
            });
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Data_table($$renderer3, {
          columns,
          data: stockRows(),
          isLoading: serverLoading,
          loadingMessage: "A carregar produtos...",
          emptyMessage: "Nenhum produto encontrado.",
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
            title: "Detalhes do Produto",
            footer,
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="col-span-2 flex justify-center mb-2">`);
              if (crud.selected.image) {
                $$renderer4.push("<!--[0-->");
                Authed_image($$renderer4, {
                  path: crud.selected.image,
                  width: 200,
                  alt: crud.selected.name,
                  class: "size-24 object-contain rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                });
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<div class="h-24 w-24 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">Sem imagem</div>`);
              }
              $$renderer4.push(`<!--]--></div> `);
              Detail_grid($$renderer4, {
                items: [
                  { label: "Referência", value: crud.selected.ref },
                  { label: "Nome", value: crud.selected.name },
                  { label: "Cor", value: crud.selected.color },
                  { label: "Quantidade", value: crud.selected.quantity },
                  { label: "Gaveta", value: crud.selected.drawer },
                  { label: "Cx", value: crud.selected.cx },
                  { label: "PVP", value: `${crud.selected.pvp.toFixed(2)} €` },
                  { label: "Fornecedor", value: crud.selected.fornecedor },
                  { label: "Família", value: crud.selected.family },
                  { label: "Estado", value: crud.selected.estado }
                ]
              });
              $$renderer4.push(`<!---->`);
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
        onConfirm: handleDeleteConfirm,
        title: "Eliminar Produto",
        itemName: crud.selected ? `${crud.selected.ref} - ${crud.selected.name}` : ""
      });
      $$renderer3.push(`<!----> `);
      Add_product_modal($$renderer3, {
        open: showAddModal,
        onClose: () => showAddModal = false,
        onSuccess: handleMutationSuccess,
        fornecedores: fornecedores()
      });
      $$renderer3.push(`<!----> `);
      Add_product_modal($$renderer3, {
        open: crud.isEdit,
        editProduct: editFullProduct,
        onClose: () => {
          editFullProduct = null;
          crud.close();
        },
        onSuccess: handleMutationSuccess,
        fornecedores: fornecedores()
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
