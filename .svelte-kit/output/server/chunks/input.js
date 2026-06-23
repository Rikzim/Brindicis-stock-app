import { l as attributes, c as clsx, o as bind_props } from "./root.js";
import { c as cn } from "./button.js";
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      type = "text",
      class: className = "",
      value = "",
      placeholder = "",
      disabled = false,
      id = void 0,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<input${attributes(
      {
        type,
        id,
        class: clsx(cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
        value,
        placeholder,
        disabled,
        ...restProps
      },
      void 0,
      void 0,
      void 0,
      4
    )}/>`);
    bind_props($$props, { value });
  });
}
export {
  Input as I
};
