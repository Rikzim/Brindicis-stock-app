"use client";

import { OTPInput } from "input-otp";
import * as React from "react";
import { cn } from "@/lib/utils";

type InputOTPProps = React.ComponentProps<typeof OTPInput>;

const InputOTP = ({ className, containerClassName, ref, ...props }: InputOTPProps) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
);
InputOTP.displayName = "InputOTP";

export { InputOTP };
