import { l as attributes, c as clsx } from "./root.js";
import { c as cn } from "./button.js";
function Label($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      for: htmlFor = void 0,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<label${attributes({
      for: htmlFor,
      class: clsx(cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></label>`);
  });
}
export {
  Label as L
};
