"use client";

import { useState, type ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

type DashboardShellProps = {
  children: ReactNode;
  userEmail: string;
  onLogout: () => Promise<void>;
};

export function DashboardShell({
  children,
  userEmail,
  onLogout,
}: DashboardShellProps) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  function toggleSidebar() {
    setIsSidebarHidden((currentValue) => !currentValue);
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar isHidden={isSidebarHidden} />
      <div className="min-w-0 flex-1">
        <Topbar
          userEmail={userEmail}
          onLogout={onLogout}
          isSidebarHidden={isSidebarHidden}
          onToggleSidebar={toggleSidebar}
        />
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
