import "clsx";
import { A as Auth_layout, C as Card } from "../../../chunks/auth-layout.js";
import { m as sanitize_props, f as spread_props, n as slot, o as bind_props, b as attr, a as attr_class, c as clsx } from "../../../chunks/root.js";
import { z } from "zod";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/auth-store.js";
import "../../../chunks/api-client.js";
import { c as cn, B as Button } from "../../../chunks/button.js";
import { I as Input } from "../../../chunks/input.js";
import { L as Label } from "../../../chunks/label.js";
import { E as Eye } from "../../../chunks/eye.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Log_in($$renderer, $$props) {
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
    ["path", { "d": "m10 17 5-5-5-5" }],
    ["path", { "d": "M15 12H3" }],
    ["path", { "d": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "log-in" },
    $$sanitized_props,
    {
      /**
       * @component @name LogIn
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTAgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMTUgMTJIMyIgLz4KICA8cGF0aCBkPSJNMTUgM2g0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMmgtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-in
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
function Password_input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      value = "",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="relative">`);
      Input($$renderer3, spread_props([
        {
          type: "password",
          class: cn("pe-9", className)
        },
        restProps,
        {
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          }
        }
      ]));
      $$renderer3.push(`<!----> <button type="button" class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"${attr("aria-label", "Show password")}>`);
      {
        $$renderer3.push("<!--[-1-->");
        Eye($$renderer3, { size: 16 });
      }
      $$renderer3.push(`<!--]--></button></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value });
  });
}
function User_auth_form($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    z.object({
      email: z.string().min(1, "Por favor digite o seu email").email("Email inválido"),
      password: z.string().min(1, "Por favor digite a sua password").min(7, "A password deve ter pelo menos 7 caracteres")
    });
    let { class: className = "" } = $$props;
    let isLoading = false;
    let email = "";
    let password = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<form${attr_class(clsx(cn("grid gap-3", className)))}><div class="flex flex-col gap-1.5">`);
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
      $$renderer3.push(`<!--]--></div> <div class="relative flex flex-col gap-1.5">`);
      Label($$renderer3, {
        for: "password",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Password`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Password_input($$renderer3, {
        id: "password",
        placeholder: "********",
        get value() {
          return password;
        },
        set value($$value) {
          password = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <a href="/forgot-password" class="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75 min-h-touch inline-flex items-center">Esqueceu a password?</a></div> `);
      Button($$renderer3, {
        type: "submit",
        class: "mt-2",
        disabled: isLoading,
        children: ($$renderer4) => {
          {
            $$renderer4.push("<!--[-1-->");
            Log_in($$renderer4, {});
          }
          $$renderer4.push(`<!--]--> Entrar`);
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
function _page($$renderer) {
  Auth_layout($$renderer, {
    children: ($$renderer2) => {
      Card($$renderer2, {
        class: "gap-4",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col gap-1.5 p-6 pb-0"><h2 class="text-lg font-semibold leading-none tracking-tight">Entrar</h2> <p class="text-sm text-muted-foreground">Digite o seu email e password abaixo para <br/> acessar a sua conta</p></div> <div class="p-6 pt-0">`);
          User_auth_form($$renderer3, {});
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    }
  });
}
export {
  _page as default
};
