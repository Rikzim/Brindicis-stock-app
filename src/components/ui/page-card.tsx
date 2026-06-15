import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageCardProps = {
  children: ReactNode;
  className?: string;
};

export function PageCard({ children, className }: PageCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border-2 border-slate-200 shadow-sm transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700", className)}>
      {children}
    </div>
  );
}
