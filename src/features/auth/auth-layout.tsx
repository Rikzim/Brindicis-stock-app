import { Logo } from "@/assets/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center gap-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Logo className="h-20 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Brindicis Stock
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
