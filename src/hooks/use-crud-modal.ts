import { useState, useCallback } from "react";

export type CrudAction = "add" | "view" | "edit" | "delete";

export function useCrudModal<T>() {
  const [activeModal, setActiveModal] = useState<CrudAction | null>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const openAdd = useCallback(() => {
    setSelected(null);
    setActiveModal("add");
  }, []);

  const openView = useCallback((item: T) => {
    setSelected(item);
    setActiveModal("view");
  }, []);

  const openEdit = useCallback((item: T) => {
    setSelected(item);
    setActiveModal("edit");
  }, []);

  const openDelete = useCallback((item: T) => {
    setSelected(item);
    setActiveModal("delete");
  }, []);

  const close = useCallback(() => {
    setActiveModal(null);
    setSelected(null);
  }, []);

  return {
    activeModal,
    selected,
    isAdd: activeModal === "add",
    isEdit: activeModal === "edit",
    isView: activeModal === "view",
    isDelete: activeModal === "delete",
    isOpen: activeModal !== null,
    openAdd,
    openView,
    openEdit,
    openDelete,
    close,
  };
}
