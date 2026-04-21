"use client";

import { useEffect, useMemo, useState } from "react";

import { AppointmentDetailCard } from "@/components/dashboard/appointment-detail-card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  appointmentStatusOptions,
  appointmentsMock,
  ipsOptions,
} from "@/lib/mock/appointments";
import { type AppointmentStatus } from "@/types/admin";

export function AppointmentsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>("all");
  const [ipsFilter, setIpsFilter] = useState<"all" | string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return appointmentsMock.filter((appointment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        appointment.patientDocumentId.toLowerCase().includes(normalizedSearch) ||
        appointment.doctorName.toLowerCase().includes(normalizedSearch) ||
        appointment.specialty.toLowerCase().includes(normalizedSearch) ||
        appointment.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;
      const matchesDate = dateFilter.length === 0 || appointment.date === dateFilter;
      const matchesIps = ipsFilter === "all" || appointment.ips === ipsFilter;

      return matchesSearch && matchesStatus && matchesDate && matchesIps;
    });
  }, [dateFilter, ipsFilter, search, statusFilter]);

  const selectedAppointment = filteredAppointments.find(
    (appointment) => appointment.id === selectedAppointmentId,
  );

  const stats = [
    { label: "Citas visibles", value: filteredAppointments.length },
    {
      label: "Confirmadas",
      value: filteredAppointments.filter((item) => item.status === "confirmada").length,
    },
    {
      label: "Canceladas",
      value: filteredAppointments.filter((item) => item.status === "cancelada").length,
    },
    {
      label: "Reprogramadas",
      value: filteredAppointments.filter((item) => item.status === "reprogramada").length,
    },
  ];

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Visualizar citas agendadas"
        description="Monitorea la agenda medica por estado, fecha e IPS para apoyar la operacion interna."
      />

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
              setStatusFilter(event.target.value as "all" | AppointmentStatus)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">Todos</option>
            {appointmentStatusOptions.map((status) => (
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
            value={ipsFilter}
            onChange={(event) => setIpsFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">Todas</option>
            {ipsOptions.map((ips) => (
              <option key={ips} value={ips}>
                {ips}
              </option>
            ))}
          </select>
        </div>
      </FilterBar>

      <QuickStats items={stats} />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando agenda de citas...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          title="No hay citas con los criterios seleccionados"
          description="Cambia los filtros de estado, fecha o IPS para continuar."
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
