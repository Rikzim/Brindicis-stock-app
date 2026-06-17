<script>
  import { cn } from "@/lib/utils";

  let { status = "", class: className = "" } = $props();

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    ativo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    inativo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    pendente: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    rejeitado: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    reserved: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    reservado: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  let key = $derived(status?.toLowerCase().trim() || "");
  let style = $derived(statusStyles[key] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400");
</script>

<span
  class={cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
    style,
    className
  )}
>
  {status}
</span>
