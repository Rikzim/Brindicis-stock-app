import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import { a as attr_class, c as clsx, e as ensure_array_like, b as attr } from "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { A as Auth_layout, C as Card } from "../../../chunks/auth-layout.js";
import { c as cn, B as Button } from "../../../chunks/button.js";
function Otp_form($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let otp = "";
    let isPending = false;
    $$renderer2.push(`<form${attr_class(clsx(cn("grid gap-2")))}><div class="flex flex-col gap-1.5"><label class="sr-only" for="otp">Código de Verificação</label> <div class="flex items-center gap-1.5 sm:gap-2 justify-between"><!--[-->`);
    const each_array = ensure_array_like(Array(6));
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<input type="text" inputmode="numeric" maxlength="1" class="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border-y border-r border-input text-base sm:text-lg font-semibold shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:z-10 ring-ring text-center"${attr("value", otp[i] || "")}/>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (otp.length > 0 && otp.length < 6) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-[0.8rem] font-medium text-destructive">Por favor, digite o código de 6 dígitos.</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    Button($$renderer2, {
      type: "submit",
      class: "mt-2",
      disabled: otp.length < 6 || isPending,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Verificar`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></form>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    Auth_layout($$renderer2, {
      children: ($$renderer3) => {
        Card($$renderer3, {
          class: "gap-4",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-col gap-1.5 p-6 pb-0"><h2 class="text-base font-semibold tracking-tight">Digite o código de autenticação</h2> <p class="text-sm text-muted-foreground">Por favor, digite o código de autenticação. <br/> Enviamos o código de autenticação para o seu
        email.</p></div> <div class="p-6 pt-0">`);
            Otp_form($$renderer4);
            $$renderer4.push(`<!----></div> <div class="p-6 pt-0"><p class="text-muted-foreground px-8 text-center text-sm">Não recebeu o código?  <a href="/sign-in" class="hover:text-primary underline underline-offset-4">Reenviar um novo código.</a> .</p></div>`);
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
