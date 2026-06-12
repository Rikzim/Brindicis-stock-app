import { createFileRoute } from "@tanstack/react-router";
import { AdminStock } from "@/features/admin";

export const Route = createFileRoute("/_authenticated/admin/stock")({
  component: AdminStock,
});
