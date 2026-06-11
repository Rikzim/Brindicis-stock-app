import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "@/lib/icon-map";
import { Input } from "@/components/ui/input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-9", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
