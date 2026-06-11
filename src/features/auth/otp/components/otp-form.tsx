import { useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  otp: z
    .string()
    .min(6, "Por favor, digite o código de 6 dígitos.")
    .max(6, "Por favor, digite o código de 6 dígitos."),
});

export function OtpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  const otp = form.watch("otp");

  function onSubmit(_data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate({ to: "/" });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-2", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Código de Verificação</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName="justify-between"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={otp.length < 6 || isPending}>
          Verificar
        </Button>
      </form>
    </Form>
  );
}
