import { redirect } from "@sveltejs/kit";
import { g as get } from "../../chunks/index.js";
import { a as authStore } from "../../chunks/auth-store.js";
const load = () => {
  const { accessToken } = get(authStore);
  if (accessToken) {
    throw redirect(307, "/stock");
  }
  throw redirect(307, "/sign-in");
};
export {
  load
};
