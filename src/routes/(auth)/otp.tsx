import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { Otp } from "@/features/auth/otp";

export const Route = createFileRoute("/(auth)/otp")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: Otp,
});
