import { o as bind_props } from "./root.js";
import { S as Searchable_select } from "./url-sync.svelte.js";
import { F as Form_field } from "./detail-grid.js";
function Form_select_field($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label = "",
      id = void 0,
      value = "",
      options = [],
      placeholder = void 0,
      disabled = false,
      class: className = ""
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Form_field($$renderer3, {
        label,
        for: id,
        children: ($$renderer4) => {
          Searchable_select($$renderer4, {
            id,
            options,
            placeholder,
            disabled,
            class: className,
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            }
          });
        }
      });
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
export {
  Form_select_field as F
};
