import * as React from "react";
import { Minus } from "lucide-react";

const InputOTPSeparator = ({ ref, ...props }: React.ComponentProps<"div">) => (
  <div ref={ref} aria-hidden="true" {...props}>
    <Minus />
  </div>
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTPSeparator };
