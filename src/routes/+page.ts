import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { authStore } from "$lib/state/auth-store";

export const load = () => {
  const { accessToken } = get(authStore);
  if (accessToken) {
    throw redirect(307, "/stock");
  }
  throw redirect(307, "/sign-in");
};
