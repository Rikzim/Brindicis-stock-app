import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AdminModal({ open, onClose, title, children, footer }: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-7">
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-100 dark:border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
