import { Package } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  name: string;
  reference: string;
  quantityLabel?: string;
  colorLabel?: string;
  image?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export function ProductCard({
  name,
  reference,
  quantityLabel = "Quantidade",
  colorLabel = "Cor: Azul, Preto",
  image,
  isSelected,
  onClick,
}: ProductCardProps) {
  const imgSrc = getImageUrl(image);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4.5 rounded-xl border border-slate-200/70 bg-white p-4.5 text-left transition-all hover:bg-slate-50 cursor-pointer shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 dark:hover:bg-slate-800/40",
        isSelected && "border-blue-600 ring-1 ring-blue-600 bg-blue-50/10 dark:border-blue-500 dark:ring-blue-500 dark:bg-blue-500/10",
      )}
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400/80 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-600">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="size-full rounded-xl object-cover"
          />
        ) : (
          <Package className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{reference}</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{quantityLabel}</p>
        {colorLabel && <p className="truncate text-xs text-slate-400 dark:text-slate-500">{colorLabel}</p>}
      </div>
    </button>
  );
}
