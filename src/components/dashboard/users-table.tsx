import { type AdminUser } from "@/types/admin";

import { StatusBadge } from "@/components/dashboard/status-badge";

type UsersTableProps = {
  users: AdminUser[];
  selectedUserId?: string;
  onView: (userId: string) => void;
};

export function UsersTable({ users, selectedUserId, onView }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Rol</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Creacion</th>
            <th className="px-4 py-3 font-semibold">Ultimo acceso</th>
            <th className="px-4 py-3 font-semibold">Accion</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100 text-slate-700">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">CC {user.documentId}</p>
              </td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 capitalize">{user.role.replace("_", " ")}</td>
              <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
              <td className="px-4 py-3">{user.createdAt}</td>
              <td className="px-4 py-3">{user.lastActivityAt}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onView(user.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${
                    selectedUserId === user.id
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
