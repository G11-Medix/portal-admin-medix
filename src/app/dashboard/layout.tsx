import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { logoutAction } from "@/app/dashboard/actions";
import { DashboardShell } from "@/components/dashboard-shell";
import { createClient } from "@/lib/supabase/server-client";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Debes iniciar sesion para continuar");
  }

  return (
    <DashboardShell userEmail={user.email ?? "sin email"} onLogout={logoutAction}>
      {children}
    </DashboardShell>
  );
}
