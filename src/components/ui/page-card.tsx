import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageCardProps = {
  children: ReactNode;
  className?: string;
};

export function PageCard({ children, className }: PageCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200/60 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-800/80", className)}>
      {children}
    </div>
  );
}
