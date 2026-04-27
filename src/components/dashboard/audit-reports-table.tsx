import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDateTime } from "@/lib/date-format";
import { type AuditLogRow } from "@/lib/audit-reports";

type AuditReportsTableProps = {
  logs: AuditLogRow[];
  selectedLogId?: number;
  onView: (logId: number) => void;
};

export function AuditReportsTable({
  logs,
  selectedLogId,
  onView,
}: AuditReportsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Metodo</th>
            <th className="px-4 py-3 font-semibold">Ruta</th>
            <th className="px-4 py-3 font-semibold">Resultado</th>
            <th className="px-4 py-3 font-semibold">HTTP</th>
            <th className="px-4 py-3 font-semibold">Usuario</th>
            <th className="px-4 py-3 font-semibold">IP</th>
            <th className="px-4 py-3 font-semibold">Accion</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-slate-100 text-slate-700">
              <td className="whitespace-nowrap px-4 py-3">
                {formatDateTime(log.occurredAt, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <td className="px-4 py-3 font-semibold text-slate-900">{log.method}</td>
              <td className="max-w-[320px] truncate px-4 py-3 font-medium text-slate-900">
                {log.path}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={log.result} />
              </td>
              <td className="px-4 py-3">{log.statusCode}</td>
              <td className="max-w-[220px] truncate px-4 py-3">
                {log.userId ?? log.userRole}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{log.ipAddress}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onView(log.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${
                    selectedLogId === log.id
                      ? "bg-cyan-700 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
