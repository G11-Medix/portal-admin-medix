import { type AppointmentAdminRow } from "@/types/admin";

import { StatusBadge } from "@/components/dashboard/status-badge";

type AppointmentsTableProps = {
  appointments: AppointmentAdminRow[];
  selectedAppointmentId?: string;
  onView: (appointmentId: string) => void;
};

export function AppointmentsTable({
  appointments,
  selectedAppointmentId,
  onView,
}: AppointmentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Documento</th>
            <th className="px-4 py-3 font-semibold">Codigo</th>
            <th className="px-4 py-3 font-semibold">Paciente</th>
            <th className="px-4 py-3 font-semibold">Medico</th>
            <th className="px-4 py-3 font-semibold">Especialidad</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Hora</th>
            <th className="px-4 py-3 font-semibold">IPS</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Accion</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-t border-slate-100 text-slate-700">
              <td className="px-4 py-3">{appointment.patientDocumentId}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{appointment.code}</td>
              <td className="px-4 py-3">{appointment.patientName}</td>
              <td className="px-4 py-3">{appointment.doctorName}</td>
              <td className="px-4 py-3">{appointment.specialty}</td>
              <td className="px-4 py-3">{appointment.date}</td>
              <td className="px-4 py-3">{appointment.time}</td>
              <td className="px-4 py-3">{appointment.ips}</td>
              <td className="px-4 py-3"><StatusBadge status={appointment.status} /></td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onView(appointment.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${
                    selectedAppointmentId === appointment.id
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
