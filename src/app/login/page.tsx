import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-cyan-50 to-slate-100 px-4 py-10">
      <AuthCard
        title="Ingresa con Magic Link"
        description="Accede al portal interno de Medix con un enlace seguro enviado a tu correo."
      >
        <LoginForm initialMessage={params.message} />
      </AuthCard>
    </main>
  );
}
