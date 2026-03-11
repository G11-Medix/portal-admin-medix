import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/settings", label: "Configuracion" },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-8 border-b border-slate-200 bg-white px-6 py-5 md:min-h-screen md:w-72 md:border-r md:border-b-0 md:px-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Medix Admin
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Portal interno para operaciones y monitoreo.
        </p>
      </div>

      <nav className="flex gap-2 md:flex-col">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
