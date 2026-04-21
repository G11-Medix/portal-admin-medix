import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { logoutAction } from "@/app/dashboard/actions";
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
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar userEmail={user.email ?? "sin email"} onLogout={logoutAction} />
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
