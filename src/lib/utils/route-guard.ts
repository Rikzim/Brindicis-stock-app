import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { get } from "svelte/store";
import { authStore } from "$lib/state/auth-store";

const PUBLIC_ROUTES = new Set(["/sign-in", "/otp", "/forgot-password"]);

/**
 * Client-side auth guard. Runs after navigation, ensures authenticated users
 * don't see the auth pages, and unauthenticated users don't see protected routes.
 */
export function guardRoute(path: string) {
  if (!browser) return;
  const { accessToken: token } = get(authStore);

  if (PUBLIC_ROUTES.has(path) && token) {
    goto("/stock", { replaceState: true });
  } else if (!token && !PUBLIC_ROUTES.has(path) && path !== "/") {
    goto("/sign-in", { replaceState: true });
  } else if (path === "/" && token) {
    goto("/stock", { replaceState: true });
  }
}
