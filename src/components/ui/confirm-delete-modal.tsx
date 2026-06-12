import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminModal } from "@/components/ui/admin-modal";

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
};

export function ConfirmDeleteModal({ open, onClose, onConfirm, title, itemName }: ConfirmDeleteModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-medium">Cancelar</Button>
          <Button onClick={onConfirm} className="h-10 bg-red-600 hover:bg-red-700 text-white px-5 rounded-lg text-sm font-medium shadow-none">Eliminar</Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center dark:bg-red-950/20">
          <AlertTriangle className="size-6" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tem a certeza que deseja eliminar <strong className="text-slate-800 dark:text-slate-100 font-bold">{itemName}</strong>? Esta ação não pode ser desfeita.
        </p>
      </div>
    </AdminModal>
  );
}
