import { createFileRoute } from "@tanstack/react-router";
import { AdminFornecedores } from "@/features/admin";

export const Route = createFileRoute("/_authenticated/admin/fornecedores")({
  component: AdminFornecedores,
});
