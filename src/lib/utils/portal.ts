import type { Action } from "svelte/action";

/**
 * Svelte action that moves the element to `document.body` on mount
 * and restores it on destroy. This escapes any transformed/overflow
 * ancestor that would otherwise create a containing block for
 * `position: fixed` children.
 */
export const portal: Action<HTMLElement> = (node) => {
  if (typeof document === "undefined") return;
  document.body.appendChild(node);
  return {
    destroy() {
      if (node.parentNode) node.parentNode.removeChild(node);
    },
  };
};
