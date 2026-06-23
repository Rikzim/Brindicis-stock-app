import { l as attributes, c as clsx } from "./root.js";
import { c as cn } from "./button.js";
import "clsx";
function Card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function Auth_layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="min-h-dvh flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-slate-950 p-4 gap-4"><div class="flex items-center gap-2"><span class="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Brindicis Stock</span></div> `);
  children?.($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  Auth_layout as A,
  Card as C
};
