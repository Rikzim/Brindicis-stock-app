import { redirect, createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { StockPage } from "@/features/stock";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <StockPage />;
}
