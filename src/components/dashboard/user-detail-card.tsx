import { type PatientAdminRow } from "@/types/admin";

import { StatusBadge } from "@/components/dashboard/status-badge";

type UserDetailCardProps = {
  user: PatientAdminRow;
};

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Detalle de paciente</h3>
      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Nombre</dt>
          <dd>{user.fullName}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Correo</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Telefono</dt>
          <dd>{user.phone ?? "Sin telefono"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Estado</dt>
          <dd><StatusBadge status={user.status} /></dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Documento</dt>
          <dd>{user.documentType} {user.documentId}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">EPS ID</dt>
          <dd>{user.epsId}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Creado</dt>
          <dd>{user.createdAt}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Fecha de nacimiento</dt>
          <dd>{user.birthDate}</dd>
        </div>
      </dl>
      {user.supabaseUserId ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Usuario Supabase asociado: {user.supabaseUserId}
        </p>
      ) : null}
    </aside>
  );
}
