"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/dashboard", label: "Inicio", exact: true },
  { href: "/dashboard/users", label: "Pacientes" },
  { href: "/dashboard/appointments", label: "Citas agendadas" },
  { href: "/dashboard/integrations", label: "Integraciones IPS" },
  { href: "/dashboard/audit-reports", label: "Reportes auditoria" },
];

type SidebarProps = {
  isHidden?: boolean;
};

export function Sidebar({ isHidden = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-full flex-col gap-8 border-b border-slate-200 bg-white px-6 py-5 md:min-h-screen md:w-72 md:border-r md:border-b-0 md:px-5 ${
        isHidden ? "hidden" : "flex"
      }`}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo_medix_bg.png"
          alt="Medix"
          width={48}
          height={48}
          priority
          className="size-12 rounded-xl object-contain"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Medix Admin
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Portal interno para operaciones y monitoreo.
          </p>
        </div>
      </div>

      <nav className="flex gap-2 md:flex-col" aria-label="Navegacion principal">
        {navigation.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${
                isActive
                  ? "bg-cyan-700 text-white"
                  : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
