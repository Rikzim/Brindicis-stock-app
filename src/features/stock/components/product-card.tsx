import { Package } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4.5 rounded-xl p-4.5 text-left h-auto w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-in fade-in duration-200",
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
        <p className="truncate text-xs">
          <span className="text-slate-400 dark:text-slate-500">Qtd: </span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{quantity}</span>
        </p>
        {colors && (
          <p className="truncate text-xs">
            <span className="text-slate-400 dark:text-slate-500">Cor: </span>
            <span className="text-slate-600 dark:text-slate-300">{colors}</span>
          </p>
        )}
      </div>
    </Button>
  );
}
