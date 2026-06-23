import { a as attr_class, c as clsx } from "./root.js";
import "./api-client.js";
function Authed_image($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { path = "", width, alt = "", class: className = "" } = $$props;
    if (path) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div${attr_class(clsx(className))}></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  Authed_image as A
};
