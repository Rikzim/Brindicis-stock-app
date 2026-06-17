<script>
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";
  import { authStore } from "./lib/state/auth-store";
  import { navigateTo } from "./lib/utils/navigate";

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
    window.addEventListener("popstate", onNavigate);
    return () => window.removeEventListener("popstate", onNavigate);
  });

  const route = $derived.by(() => {
    const accessToken = $authStore.accessToken;

    // Public auth routes — redirect to /stock if already logged in
    if (currentPath === "/sign-in") {
      if (accessToken) {
        navigateTo("/stock");
        return { component: StockPage, props: {} };
      }
      return { component: SignIn, props: {} };
    }
    if (currentPath === "/otp") {
      if (accessToken) {
        navigateTo("/stock");
        return { component: StockPage, props: {} };
      }
      return { component: Otp, props: {} };
    }
    if (currentPath === "/forgot-password") {
      if (accessToken) {
        navigateTo("/stock");
        return { component: StockPage, props: {} };
      }
      return { component: ForgotPassword, props: {} };
    }

    // Protected routes — redirect to /sign-in if no token
    if (!accessToken) {
      navigateTo("/sign-in");
      return { component: SignIn, props: {} };
    }

    // Stock page
    if (currentPath === "/") {
      navigateTo("/stock");
      return { component: StockPage, props: {} };
    }
    if (currentPath === "/stock") {
      return { component: StockPage, props: {} };
    }

    // Admin routes
    if (currentPath.startsWith("/admin")) {
      return { component: AdminLayout, props: {} };
    }

    // Fallback
    return { component: NotFound, props: {} };
  });
</script>

<svelte:window onpopstate={onNavigate} />

{#if route}
  <route.component {...route.props} />
{/if}
<Toaster richColors />
