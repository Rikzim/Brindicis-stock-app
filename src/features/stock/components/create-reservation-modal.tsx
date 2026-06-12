import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { X, Info, ShieldCheck, ChevronLeft } from "@/lib/icon-map";
import type { ProductStock } from "@/lib/stock-types";
import { toast } from "sonner";
import { createReservation, getReservations, getUsers } from "@/lib/stock-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";



type CreateReservationPanelProps = {
  product: ProductStock;
  onClose: () => void;
};

type ColorRowListProps = {
  product: ProductStock;
  quantities: Record<string, number>;
  onQuantityChange: (color: string, delta: number) => void;
  getAvailableForColor: (colorName: string) => number;
};

function ColorRowList({ product, quantities, onQuantityChange, getAvailableForColor }: ColorRowListProps) {
  if (product.colors && product.colors.length > 0) {
    return product.colors.map((c) => {
      const qty = quantities[c.name] || 0;
      const available = getAvailableForColor(c.name);

      return (
        <div key={c.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0 dark:border-slate-800/40">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {c.name}
            </span>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center h-8 rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => onQuantityChange(c.name, -1)}
                className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-medium dark:hover:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
              >
                —
              </button>
              <span className="w-10 text-center text-xs font-semibold text-slate-750 dark:text-slate-350">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(c.name, 1)}
                className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-800"
              >
                +
              </button>
            </div>
            <span className="w-12 text-right text-sm font-bold text-slate-800 dark:text-slate-300">
              {available}
            </span>
          </div>
        </div>
      );
    });
  }

  const qty = quantities["default"] || 0;
  const available = getAvailableForColor("default");

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Geral</span>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex items-center h-8 rounded-lg border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => onQuantityChange("default", -1)}
            className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
          >
            —
          </button>
          <span className="w-10 text-center text-xs font-semibold text-slate-750 dark:text-slate-350">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange("default", 1)}
            className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors font-semibold dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-800"
          >
            +
          </button>
        </div>
        <span className="w-12 text-right text-sm font-bold text-slate-800 dark:text-slate-300">
          {available}
        </span>
      </div>
    </div>
  );
}

type ReservationFormFieldsProps = {
  formState: { comercial: string; encomenda: string; mensagem: string; orcamento: boolean };
  setFormState: Dispatch<SetStateAction<{ comercial: string; encomenda: string; mensagem: string; orcamento: boolean }>>;
  comercialOptions: { value: string; label: string }[];
  encomendaOptions: { value: string; label: string }[];
};

function ReservationFormFields({
  formState,
  setFormState,
  comercialOptions, encomendaOptions,
}: ReservationFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="comercial" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          COMERCIAL
        </label>
        <SearchableSelect
          id="comercial"
          value={formState.comercial}
          onValueChange={(v) => setFormState((s) => ({ ...s, comercial: v }))}
          options={comercialOptions}
          placeholder="Selecionar comercial"
          searchPlaceholder="Pesquisar comercial..."
          emptyMessage="Nenhum comercial encontrado. Digite para adicionar."
          allowCustom={true}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="encomenda" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          Nº ENCOMENDA
        </label>
        <SearchableSelect
          id="encomenda"
          value={formState.encomenda}
          onValueChange={(v) => setFormState((s) => ({ ...s, encomenda: v }))}
          options={encomendaOptions}
          placeholder="Selecionar encomenda"
          searchPlaceholder="Pesquisar encomenda..."
          emptyMessage="Nenhuma encomenda encontrada. Digite para adicionar."
          allowCustom={true}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensagem" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          MENSAGEM
        </label>
        <textarea
          id="mensagem"
          aria-label="Mensagem"
          value={formState.mensagem}
          onChange={(e) => setFormState((s) => ({ ...s, mensagem: e.target.value }))}
          placeholder="Adicionar mensagem..."
          className="h-22 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-700"
        />
      </div>

      <div className="flex items-center gap-2.5 py-1">
        <input
          type="checkbox"
          id="orcamento"
          checked={formState.orcamento}
          onChange={(e) => setFormState((s) => ({ ...s, orcamento: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
        />
        <label
          htmlFor="orcamento"
          className="text-sm font-semibold text-slate-750 dark:text-slate-200 cursor-pointer select-none"
        >
          Orçamento
        </label>
      </div>
    </div>
  );
}


export function CreateReservationPanel({ product, onClose }: CreateReservationPanelProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  
  const { data: reservations = [] } = useQuery({
    queryKey: ["all-reservations"],
    queryFn: getReservations,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: getUsers,
  });

  const comercialOptions = useMemo(() => {
    const set = new Set<string>();
    if (user?.name) {
      set.add(user.name);
    }
    users.forEach((u) => {
      if (u.name) set.add(u.name);
    });
    reservations.forEach((r) => {
      if (r.name) set.add(r.name);
    });
    return Array.from(set).map((name) => ({ value: name, label: name }));
  }, [users, reservations, user?.name]);

  const encomendaOptions = useMemo(() => {
    const set = new Set<string>();
    reservations.forEach((r) => {
      if (r.order) set.add(r.order);
    });
    return Array.from(set).map((order) => ({ value: order, label: order }));
  }, [reservations]);

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    product.colors?.forEach((c) => {
      initial[c.name] = 0;
    });
    if (product.colors?.length === 0) {
      initial["default"] = 0;
    }
    return initial;
  });

  const [formState, setFormState] = useState({
    comercial: user?.name || "",
    encomenda: "—",
    mensagem: "",
    orcamento: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAvailableForColor = (colorName: string) => {
    if (colorName === "default") return product.quantity - product.reserved;
    const colorVariants = product.variants?.filter((v) => v.color === colorName) || [];
    if (colorVariants.length > 0) {
      return colorVariants.reduce((sum, v) => sum + (v.quantity - v.reserved), 0);
    }
    return product.quantity - product.reserved;
  };

  const handleQuantityChange = (color: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[color] || 0;
      const next = Math.max(0, current + delta);
      const available = getAvailableForColor(color);
      if (next > available) {
        toast.error(`Apenas ${available} unidades disponíveis para a cor ${color}.`);
        return prev;
      }
      return { ...prev, [color]: next };
    });
  };

  const handleSave = async () => {
    const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalQty === 0) {
      toast.error("Por favor, selecione pelo menos 1 unidade.");
      return;
    }

    if (!formState.comercial.trim()) {
      toast.error("O campo Comercial é obrigatório.");
      return;
    }

    setIsSubmitting(false);
    const reservationPromises: Promise<unknown>[] = [];

    const variantByColor = new Map(product.variants?.map((v) => [v.color, v]));

    try {
      setIsSubmitting(true);
      for (const [colorName, qty] of Object.entries(quantities)) {
        if (qty > 0) {
          const variant = variantByColor.get(colorName);

          const payload = {
            name: formState.comercial,
            id_product: product.id,
            quantity: qty,
            color: colorName === "default" ? "" : colorName,
            size: variant?.size || undefined,
            message: formState.mensagem || undefined,
            order: (formState.encomenda === "—" || !formState.encomenda) ? undefined : formState.encomenda,
            proposal: formState.orcamento ? 1 : 0,
          };

          reservationPromises.push(createReservation(payload));
        }
      }

      await Promise.all(reservationPromises);
      toast.success("Reserva criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["stock-products"] });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-0.5">
            NOVA RESERVA
          </span>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 leading-tight">
            Criar Reserva
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7">
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-5">
        {/* Section: Selecionar Quantidades */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            SELECIONAR QUANTIDADES
          </span>
          
          {/* Table Header */}
          <div className="flex justify-between text-[10px] font-bold text-slate-400/90 tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800/40">
            <span>Cor</span>
            <div className="flex gap-12 pr-2">
              <span>Quantidade</span>
              <span>Disponível</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col max-h-[160px] overflow-y-auto pr-1">
            <ColorRowList
              product={product}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              getAvailableForColor={getAvailableForColor}
            />
          </div>
        </div>

        <div className="border-t border-slate-100/80 dark:border-slate-800/40" />

        {/* Form Fields */}
        <ReservationFormFields
          formState={formState}
          setFormState={setFormState}
          comercialOptions={comercialOptions}
          encomendaOptions={encomendaOptions}
        />

        {/* Helper note */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400/90 dark:text-slate-500">
          <Info className="size-4 shrink-0 text-slate-400/80 dark:text-slate-650" />
          <span>As reservas são válidas por 5 dias.</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Button variant="outline" onClick={onClose} className="h-11 px-5">
          <ChevronLeft className="size-4" />
          <span>Voltar</span>
        </Button>
        
        <Button variant="default" disabled={isSubmitting} onClick={handleSave} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 active:scale-95">
          <ShieldCheck className="size-4" />
          <span>{isSubmitting ? "A guardar..." : "Reservar"}</span>
        </Button>
      </div>
    </div>
  );
}
