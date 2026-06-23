import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import { m as sanitize_props, f as spread_props, n as slot, a as attr_class, c as clsx } from "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { A as Auth_layout, C as Card } from "../../../chunks/auth-layout.js";
import { z } from "zod";
import { c as cn, B as Button } from "../../../chunks/button.js";
import { I as Input } from "../../../chunks/input.js";
import { L as Label } from "../../../chunks/label.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Arrow_right($$renderer, $$props) {
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
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
function Forgot_password_form($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    z.object({
      email: z.string().min(1, "Por favor, digite seu email").email("Email inválido")
    });
    let isPending = false;
    let email = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<form${attr_class(clsx(cn("grid gap-2")))}><div class="flex flex-col gap-1.5">`);
      Label($$renderer3, {
        for: "email",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Email`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Input($$renderer3, {
        id: "email",
        type: "email",
        placeholder: "nome@exemplo.com",
        get value() {
          return email;
        },
        set value($$value) {
          email = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      Button($$renderer3, {
        type: "submit",
        class: "mt-2",
        disabled: isPending,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Continuar `);
          {
            $$renderer4.push("<!--[-1-->");
            Arrow_right($$renderer4, {});
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></form>`);
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
    Auth_layout($$renderer2, {
      children: ($$renderer3) => {
        Card($$renderer3, {
          class: "gap-4",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-col gap-1.5 p-6 pb-0"><h2 class="text-lg font-semibold tracking-tight">Esqueci minha password</h2> <p class="text-sm text-muted-foreground">Digite o seu email e <br/> enviaremos um link para mudar a sua password.</p></div> <div class="p-6 pt-0">`);
            Forgot_password_form($$renderer4);
            $$renderer4.push(`<!----></div> <div class="p-6 pt-0"><p class="text-muted-foreground mx-auto px-8 text-center text-sm text-balance">Lembrou-se da sua password?  <a href="/sign-in" class="hover:text-primary underline underline-offset-4">Entrar</a> .</p></div>`);
          },
          $$slots: { default: true }
        });
      }
    });
  });
}
export {
  _page as default
};
