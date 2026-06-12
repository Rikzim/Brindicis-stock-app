import { createFileRoute } from "@tanstack/react-router";
import { AdminFamilias } from "@/features/admin";

export const Route = createFileRoute("/_authenticated/admin/familias")({
  component: AdminFamilias,
});
