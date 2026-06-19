<script>
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";
  import axios from "axios";
  import { authStore } from "./lib/state/auth-store";
  import { navigateTo } from "./lib/utils/navigate";
  import { getMe } from "./lib/utils/auth-api";

  import SignIn from "./routes/auth/sign-in.svelte";
  import Otp from "./routes/auth/otp.svelte";
  import ForgotPassword from "./routes/auth/forgot-password.svelte";
  import StockPage from "./routes/stock.svelte";
  import AdminLayout from "./lib/components/layout/admin-layout.svelte";
  import NotFound from "./routes/NotFound.svelte";

  let currentPath = $state(window.location.pathname);

  function onNavigate() {
    currentPath = window.location.pathname;
  }

  onMount(() => {
    if ($authStore.accessToken && !$authStore.user) {
      getMe()
        .then((user) => authStore.setUser(user))
        .catch((err) => {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            authStore.reset();
          }
        });
    }
  });

  $effect(() => {
    const path = currentPath;
    const token = $authStore.accessToken;

    if ((path === "/sign-in" || path === "/otp" || path === "/forgot-password") && token) {
      navigateTo("/stock");
    } else if (!token && path !== "/sign-in" && path !== "/otp" && path !== "/forgot-password") {
      navigateTo("/sign-in");
    } else if (path === "/" && token) {
      navigateTo("/stock");
    }
  });

  const route = $derived.by(() => {
    const accessToken = $authStore.accessToken;

    if (currentPath === "/sign-in") {
      return { component: accessToken ? StockPage : SignIn, props: {} };
    }
    if (currentPath === "/otp") {
      return { component: accessToken ? StockPage : Otp, props: {} };
    }
    if (currentPath === "/forgot-password") {
      return { component: accessToken ? StockPage : ForgotPassword, props: {} };
    }

    if (!accessToken) {
      return { component: SignIn, props: {} };
    }

    if (currentPath === "/" || currentPath === "/stock") {
      return { component: StockPage, props: {} };
    }

    if (currentPath.startsWith("/admin")) {
      return { component: AdminLayout, props: {} };
    }

    return { component: NotFound, props: {} };
  });
</script>

<svelte:window onpopstate={onNavigate} />

{#if route}
  <route.component {...route.props} />
{/if}
<Toaster richColors />
