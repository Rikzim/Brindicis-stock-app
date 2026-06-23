export type CrudAction = "add" | "view" | "edit" | "delete";

export type CrudSelected = {
  id?: number;
  name?: string;
  status?: number | string;
  [key: string]: any;
};

export function createCrudModal<T extends CrudSelected = CrudSelected>() {
  let activeModal = $state<CrudAction | null>(null);
  let selected = $state<T | null>(null);

  return {
    get activeModal() {
      return activeModal;
    },
    get isAdd() {
      return activeModal === "add";
    },
    get isEdit() {
      return activeModal === "edit";
    },
    get isView() {
      return activeModal === "view";
    },
    get isDelete() {
      return activeModal === "delete";
    },
    get isOpen() {
      return activeModal !== null;
    },
    get selected() {
      return selected;
    },
    openAdd() {
      activeModal = "add";
      selected = null;
    },
    openView(item: T) {
      activeModal = "view";
      selected = item;
    },
    openEdit(item: T) {
      activeModal = "edit";
      selected = item;
    },
    openDelete(item: T) {
      activeModal = "delete";
      selected = item;
    },
    close() {
      activeModal = null;
      selected = null;
    },
  };
}
