<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Toaster } from "svelte-sonner";
  import { authStore } from "$lib/state/auth-store";
  import type { AuthUser } from "$lib/state/auth-store";
  import { getMe } from "$lib/utils/auth-api";
  import { guardRoute } from "$lib/utils/route-guard";
  import "../app.css";

  let { children } = $props();

  onMount(() => {
    if ($authStore.accessToken && !$authStore.user) {
      getMe<AuthUser>()
        .then((user) => authStore.setUser(user))
        .catch(() => {
          authStore.reset();
        });
    }
  });

  $effect(() => {
    guardRoute($page.url.pathname);
  });
</script>

<Toaster richColors />

{@render children?.()}

<div
  class="landscape-lock hidden fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex-col items-center justify-center gap-4 p-8 text-center"
>
  <svg
    class="size-16 text-amber-500 animate-bounce"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" transform="rotate(0 12 12)" />
    <path d="M12 18v.01" />
  </svg>
  <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">Modo Retrato</h2>
  <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
    Por favor, rode o dispositivo para o modo retrato para uma melhor experiência.
  </p>
</div>
