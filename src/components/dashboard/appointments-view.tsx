"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AppointmentDetailCard } from "@/components/dashboard/appointment-detail-card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  appointmentStatusOptions,
  type AppointmentAdminRow,
  type InstitutionOption,
} from "@/types/admin";

type AppointmentsViewProps = {
  appointments: AppointmentAdminRow[];
  institutions: InstitutionOption[];
  selectedInstitutionId?: number;
  error?: string;
};

export function AppointmentsView({
  appointments,
  institutions,
  selectedInstitutionId,
  error,
}: AppointmentsViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>();

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        appointment.patientDocumentId.toLowerCase().includes(normalizedSearch) ||
        appointment.doctorName.toLowerCase().includes(normalizedSearch) ||
        appointment.specialty.toLowerCase().includes(normalizedSearch) ||
        appointment.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;
      const matchesDate = dateFilter.length === 0 || appointment.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, dateFilter, search, statusFilter]);

  const selectedAppointment = filteredAppointments.find(
    (appointment) => appointment.id === selectedAppointmentId,
  );
  const statusOptions = Array.from(
    new Set([...appointmentStatusOptions, ...appointments.map((appointment) => appointment.status)]),
  );
  const selectedInstitution = institutions.find(
    (institution) => institution.id === selectedInstitutionId,
  );
  const selectedInstitutionValue = selectedInstitution
    ? String(selectedInstitution.id)
    : "";

  const stats = [
    { label: "Citas visibles", value: filteredAppointments.length },
    {
      label: "Programadas",
      value: filteredAppointments.filter((item) => item.status === "scheduled").length,
    },
    {
      label: "Canceladas",
      value: filteredAppointments.filter((item) =>
        ["cancelada", "cancelled"].includes(item.status),
      ).length,
    },
    {
      label: "Reprogramadas",
      value: filteredAppointments.filter((item) => item.status === "reprogramada").length,
    },
  ];

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Agenda de citas por IPS"
        description={
          selectedInstitution
            ? `Consulta las citas registradas para ${selectedInstitution.name}, con filtros por estado, fecha y busqueda rapida.`
            : "Selecciona una IPS para consultar su agenda de citas."
        }
      />

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <FilterBar>
        <SearchInput
          id="appointments-search"
          label="Buscar cita"
          value={search}
          onChange={setSearch}
          placeholder="Cedula, medico, especialidad o ID"
        />

        <div className="flex min-w-[180px] flex-col gap-2">
          <label htmlFor="appointments-status" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Estado
          </label>
          <select
            id="appointments-status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
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

        <div className="flex min-w-[160px] flex-col gap-2">
          <label htmlFor="appointments-date" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Fecha
          </label>
          <input
            id="appointments-date"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          />
        </div>

        <div className="flex min-w-[180px] flex-col gap-2">
          <label htmlFor="appointments-ips" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            IPS
          </label>
          <select
            id="appointments-ips"
            value={selectedInstitutionValue}
            onChange={(event) => {
              setSelectedAppointmentId(undefined);
              router.push(`/dashboard/appointments?institutionId=${event.target.value}`);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            {institutions.length === 0 ? (
              <option value="">Sin IPS disponible</option>
            ) : (
              institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))
            )}
          </select>
        </div>
      </FilterBar>

      <QuickStats items={stats} />

      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No hay citas con los criterios seleccionados"
          description="Cambia los filtros de estado o fecha para continuar. En esta version se carga la primera IPS disponible."
        />
      ) : (
        <>
          <AppointmentsTable
            appointments={filteredAppointments}
            selectedAppointmentId={selectedAppointmentId}
            onView={setSelectedAppointmentId}
          />
          {selectedAppointment ? (
            <AppointmentDetailCard appointment={selectedAppointment} />
          ) : null}
        </>
      )}
    </section>
  );
}
