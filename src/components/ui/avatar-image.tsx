import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarImage = ({ className, ref, alt, ...props }: React.ComponentProps<"img">) => (
  <img
    ref={ref}
    alt={alt ?? ""}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
);
AvatarImage.displayName = "AvatarImage";

export { AvatarImage };
