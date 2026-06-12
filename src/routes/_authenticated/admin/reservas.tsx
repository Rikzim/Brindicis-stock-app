import { createFileRoute } from "@tanstack/react-router";
import { AdminReservas } from "@/features/admin";

export const Route = createFileRoute("/_authenticated/admin/reservas")({
  component: AdminReservas,
});
