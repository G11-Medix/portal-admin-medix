"use client";

type TopbarProps = {
  userEmail: string;
  onLogout: () => Promise<void>;
  isSidebarHidden: boolean;
  onToggleSidebar: () => void;
};

export function Topbar({
  userEmail,
  onLogout,
  isSidebarHidden,
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Panel de control</h1>
        <p className="text-sm text-slate-600">Sesion activa: {userEmail}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-expanded={!isSidebarHidden}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          {isSidebarHidden ? "Mostrar menu" : "Ocultar menu"}
        </button>
        <form action={onLogout}>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Cerrar sesion
          </button>
        </form>
      </div>
    </header>
  );
}
