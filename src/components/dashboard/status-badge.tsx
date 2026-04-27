type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactivo: "bg-slate-50 text-slate-700 ring-slate-600/20",
  suspendido: "bg-amber-50 text-amber-700 ring-amber-600/20",
  pendiente: "bg-sky-50 text-sky-700 ring-sky-600/20",
  bloqueado: "bg-rose-50 text-rose-700 ring-rose-600/20",
  scheduled: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
  reservada: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  confirmada: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelada: "bg-rose-50 text-rose-700 ring-rose-600/20",
  reprogramada: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completada: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  exito: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  error: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.trim().toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
        statusStyles[normalizedStatus] ?? "bg-slate-50 text-slate-700 ring-slate-600/20"
      }`}
    >
      {normalizedStatus || "desconocido"}
    </span>
  );
}
