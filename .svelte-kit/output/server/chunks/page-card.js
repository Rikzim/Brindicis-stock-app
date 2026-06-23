import { l as attributes, c as clsx } from "./root.js";
import { c as cn } from "./button.js";
function Page_card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("bg-white rounded-2xl border-2 border-slate-200 shadow-sm transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  Page_card as P
};
