import { Package } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";

type ProductCardProps = {
  name: string;
  reference: string;
  quantity: number;
  colors?: string;
  image?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export function ProductCard({
  name,
  reference,
  quantity,
  colors,
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
        "flex items-stretch rounded-2xl text-left w-full transition-all duration-200 border-2 animate-in fade-in duration-200 overflow-hidden cursor-pointer",
        isSelected
          ? "border-amber-400 shadow-md dark:border-amber-400"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:hover:border-slate-600",
      )}
    >
      <div className="flex w-[90px] shrink-0 items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="size-full object-cover"
          />
        ) : (
          <Package className="size-8" />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5 px-4 py-3 bg-white dark:bg-slate-800">
        <p className="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">{reference}</p>
        <p className="truncate text-sm">
          <span className="text-slate-500 font-semibold dark:text-slate-400">Qtd: </span>
          <span className="text-amber-600 dark:text-amber-400 font-extrabold">{quantity}</span>
        </p>
        {colors && (
          <p className="truncate text-xs">
            <span className="text-slate-500 font-semibold dark:text-slate-400">Cor: </span>
            <span className="text-slate-700 font-medium dark:text-slate-300">{colors}</span>
          </p>
        )}
      </div>
    </button>
  );
}
