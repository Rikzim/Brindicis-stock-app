import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RowActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
};

export function RowActions({
  onView,
  onEdit,
  onDelete,
  viewLabel,
  editLabel,
  deleteLabel,
}: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <Button variant="ghost" size="icon" onClick={onView} title={viewLabel ?? "Ver"} className="size-8 text-amber-500 hover:text-amber-600">
          <Eye className="size-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit} title={editLabel ?? "Editar"} className="size-8 text-amber-500 hover:text-amber-600">
          <Pencil className="size-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon" onClick={onDelete} title={deleteLabel ?? "Eliminar"} className="size-8 text-red-500 hover:text-red-600">
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
