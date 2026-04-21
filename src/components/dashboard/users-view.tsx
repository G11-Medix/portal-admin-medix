"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { UserDetailCard } from "@/components/dashboard/user-detail-card";
import { UsersTable } from "@/components/dashboard/users-table";
import { patientStatusOptions, type PatientAdminRow } from "@/types/admin";

type UsersViewProps = {
  users: PatientAdminRow[];
  error?: string;
};

export function UsersView({ users, error }: UsersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.documentId.toLowerCase().includes(normalizedSearch) ||
        user.documentType.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, users]);

  const selectedUser = filteredUsers.find((user) => user.id === selectedUserId);
  const statusOptions = Array.from(
    new Set([...patientStatusOptions, ...users.map((user) => user.status)]),
  );

  const stats = [
    { label: "Pacientes visibles", value: filteredUsers.length },
    {
      label: "Activos",
      value: filteredUsers.filter((item) => item.status === "activo").length,
    },
    {
      label: "Pendientes",
      value: filteredUsers.filter((item) => item.status === "pendiente").length,
    },
    {
      label: "Con correo",
      value: filteredUsers.filter((item) => item.email !== "Sin correo").length,
    },
  ];

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Consultar pacientes"
        description="Consulta pacientes reales desde medix-appointments-api con filtros por estado y busqueda global."
      />

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <FilterBar>
        <SearchInput
          id="users-search"
          label="Buscar paciente"
          value={search}
          onChange={setSearch}
          placeholder="Nombre, email, documento o tipo"
        />

        <div className="flex min-w-[180px] flex-col gap-2">
          <label htmlFor="users-status" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Estado
          </label>
          <select
            id="users-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      <QuickStats items={stats} />

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No hay pacientes para mostrar"
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
