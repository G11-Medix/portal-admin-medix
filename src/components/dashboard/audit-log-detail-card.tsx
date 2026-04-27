import { StatusBadge } from "@/components/dashboard/status-badge";
import { type AuditLogRow } from "@/lib/audit-reports";
import { formatDateTime } from "@/lib/date-format";

type AuditLogDetailCardProps = {
  log: AuditLogRow;
};

export function AuditLogDetailCard({ log }: AuditLogDetailCardProps) {
  const fields = [
    ["ID log", String(log.id)],
    [
      "Fecha completa",
      formatDateTime(log.occurredAt, {
        dateStyle: "full",
        timeStyle: "medium",
      }),
    ],
    ["Accion original", log.action],
    ["Ruta", log.path],
    ["Query", log.query],
    ["IP origen", log.ipAddress],
    ["Usuario", log.userId ?? "Evento sin usuario asociado"],
    ["Rol usuario", log.userRole],
    ["Estado usuario", log.userStatus],
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Log #{log.id} · {log.method} {log.resource}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Trazabilidad del evento seleccionado y datos originales registrados.
          </p>
        </div>
        <StatusBadge status={log.result} />
      </div>

      <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Detalle sin transformar
        </p>
        <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-5">
          {log.detail || "Sin detalle"}
        </pre>
      </div>
    </article>
  );
}
