import { type AppointmentAdminRow } from "@/types/admin";

import { StatusBadge } from "@/components/dashboard/status-badge";

type AppointmentDetailCardProps = {
  appointment: AppointmentAdminRow;
};

export function AppointmentDetailCard({ appointment }: AppointmentDetailCardProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Detalle de cita</h3>
      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Codigo de cita</dt>
          <dd>{appointment.code}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Estado</dt>
          <dd><StatusBadge status={appointment.status} /></dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Paciente</dt>
          <dd>{appointment.patientName}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Documento</dt>
          <dd>{appointment.patientDocumentId}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Medico</dt>
          <dd>{appointment.doctorName}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Especialidad</dt>
          <dd>{appointment.specialty}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">IPS</dt>
          <dd>{appointment.ips}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Fecha / hora</dt>
          <dd>{appointment.date} - {appointment.time}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Origen</dt>
          <dd className="capitalize">{appointment.source.replace("_", " ")}</dd>
        </div>
      </dl>
      {appointment.observations ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{appointment.observations}</p>
      ) : null}
    </aside>
  );
}
