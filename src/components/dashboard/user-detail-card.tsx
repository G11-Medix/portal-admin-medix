import { type AdminUser } from "@/types/admin";

import { StatusBadge } from "@/components/dashboard/status-badge";

type UserDetailCardProps = {
  user: AdminUser;
};

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Detalle de usuario</h3>
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
          <dt className="font-medium text-slate-500">Rol</dt>
          <dd className="capitalize">{user.role.replace("_", " ")}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Estado</dt>
          <dd><StatusBadge status={user.status} /></dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Institucion</dt>
          <dd>{user.institution ?? "No aplica"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">IPS</dt>
          <dd>{user.ips}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Creado</dt>
          <dd>{user.createdAt}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Ultima actividad</dt>
          <dd>{user.lastActivityAt}</dd>
        </div>
      </dl>
      {user.notes ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{user.notes}</p>
      ) : null}
    </aside>
  );
}
