"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { UserDetailCard } from "@/components/dashboard/user-detail-card";
import { UsersTable } from "@/components/dashboard/users-table";
import {
  adminUsersMock,
  userRoleOptions,
  userStatusOptions,
} from "@/lib/mock/admin-users";
import { type UserRole, type UserStatus } from "@/types/admin";

export function UsersView() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return adminUsersMock.filter((user) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.documentId.toLowerCase().includes(normalizedSearch);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter]);

  const selectedUser = filteredUsers.find((user) => user.id === selectedUserId);

  const stats = [
    { label: "Usuarios visibles", value: filteredUsers.length },
    {
      label: "Activos",
      value: filteredUsers.filter((item) => item.status === "activo").length,
    },
    {
      label: "Suspendidos",
      value: filteredUsers.filter((item) => item.status === "suspendido").length,
    },
    {
      label: "Pacientes",
      value: filteredUsers.filter((item) => item.role === "paciente").length,
    },
  ];

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Consultar usuarios"
        description="Consulta cuentas internas y pacientes de referencia administrativa con filtros rapidos por rol, estado y busqueda global."
      />

      <FilterBar>
        <SearchInput
          id="users-search"
          label="Buscar usuario"
          value={search}
          onChange={setSearch}
          placeholder="Nombre, email o cedula"
        />

        <div className="flex min-w-[180px] flex-col gap-2">
          <label htmlFor="users-role" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Rol
          </label>
          <select
            id="users-role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as "all" | UserRole)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">Todos</option>
            {userRoleOptions.map((role) => (
              <option key={role} value={role} className="capitalize">
                {role.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-[180px] flex-col gap-2">
          <label htmlFor="users-status" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Estado
          </label>
          <select
            id="users-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | UserStatus)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">Todos</option>
            {userStatusOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      <QuickStats items={stats} />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando usuarios...
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No hay usuarios para mostrar"
          description="Ajusta los filtros o cambia la busqueda para encontrar resultados."
        />
      ) : (
        <>
          <UsersTable
            users={filteredUsers}
            selectedUserId={selectedUserId}
            onView={setSelectedUserId}
          />
          {selectedUser ? <UserDetailCard user={selectedUser} /> : null}
        </>
      )}
    </section>
  );
}
