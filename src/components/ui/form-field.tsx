import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children?: ReactNode;
  htmlFor?: string;
  error?: string;
};

export function FormField({ label, children, htmlFor, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
