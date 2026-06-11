import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthLayout } from "../auth-layout";
import { OtpForm } from "./components/otp-form";

export function Otp() {
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">
            Digite o código de autenticação
          </CardTitle>
          <CardDescription>
            Por favor, digite o código de autenticação. <br /> Enviamos o código
            de autenticação para o seu email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground px-8 text-center text-sm">
            Não recebeu o código?{" "}
            <Link
              to="/sign-in"
              className="hover:text-primary underline underline-offset-4"
            >
              Reenviar um novo código.
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
