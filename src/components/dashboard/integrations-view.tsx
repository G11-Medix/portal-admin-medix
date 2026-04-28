"use client";

import { useMemo, useState, useTransition } from "react";

import {
  checkInstitutionHealthAction,
  updateInstitutionAction,
} from "@/app/dashboard/integrations/actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { type InstitucionHealthResponse } from "@/lib/medix-api/types";
import { type IntegrationInstitutionRow } from "@/types/admin";

type IntegrationsViewProps = {
  institutions: IntegrationInstitutionRow[];
  error?: string;
};

type HealthSnapshot = InstitucionHealthResponse & {
  checkedAt: string;
};

type EditableInstitution = {
  name: string;
  nit: string;
  address: string;
  phone: string;
  status: string;
  longitude: string;
  latitude: string;
  logoUrl: string;
  serviceUrl: string;
};

export function IntegrationsView({ institutions, error }: IntegrationsViewProps) {
  const [items, setItems] = useState(institutions);
  const [search, setSearch] = useState("");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(items[0]?.id);
  const [form, setForm] = useState<EditableInstitution>(() =>
    toEditableInstitution(items[0]),
  );
  const [healthByInstitution, setHealthByInstitution] = useState<
    Record<number, HealthSnapshot>
  >({});
  const [statusMessage, setStatusMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [isCheckingHealth, startHealthCheck] = useTransition();

  const selectedInstitution = items.find((item) => item.id === selectedInstitutionId);
  const selectedHealth = selectedInstitutionId
    ? healthByInstitution[selectedInstitutionId]
    : undefined;
  const hasPendingChanges = selectedInstitution
    ? JSON.stringify(form) !== JSON.stringify(toEditableInstitution(selectedInstitution))
    : false;
  const filteredInstitutions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((institution) => {
      return (
        normalizedSearch.length === 0 ||
        institution.name.toLowerCase().includes(normalizedSearch) ||
        institution.nit.toLowerCase().includes(normalizedSearch) ||
        institution.serviceUrl.toLowerCase().includes(normalizedSearch) ||
        institution.status.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [items, search]);

  const stats = [
    { label: "IPS gestionadas", value: items.length },
    {
      label: "Con URL servicio",
      value: items.filter((institution) => institution.serviceUrl).length,
    },
    {
      label: "Servicios arriba",
      value: Object.values(healthByInstitution).filter((health) => health.status === "UP")
        .length,
    },
    {
      label: "Requieren revision",
      value: Object.values(healthByInstitution).filter((health) => health.status === "DOWN")
        .length,
    },
  ];

  function selectInstitution(institution: IntegrationInstitutionRow) {
    setSelectedInstitutionId(institution.id);
    setForm(toEditableInstitution(institution));
    setStatusMessage("");
    setActionError("");
  }

  function updateField(field: keyof EditableInstitution, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function saveInstitution() {
    if (!selectedInstitution) {
      return;
    }

    setStatusMessage("");
    setActionError("");
    startSaving(async () => {
      const result = await updateInstitutionAction(selectedInstitution.id, {
        nombre: form.name,
        nit: form.nit,
        direccion: nullableText(form.address),
        telefono: nullableText(form.phone),
        estado: form.status.toUpperCase(),
        longitud: nullableNumber(form.longitude),
        latitud: nullableNumber(form.latitude),
        logo_url: nullableText(form.logoUrl),
        service_url: nullableText(form.serviceUrl),
      });

      if (result.error || !result.data) {
        setActionError(result.error ?? "No fue posible actualizar la institucion.");
        return;
      }

      const updatedInstitution = result.data;
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === updatedInstitution.id ? updatedInstitution : item)),
      );
      setForm(toEditableInstitution(updatedInstitution));
      setStatusMessage("Institucion actualizada correctamente.");
    });
  }

  function checkHealth() {
    if (!selectedInstitution || !form.serviceUrl.trim()) {
      return;
    }

    setStatusMessage("");
    setActionError("");
    startHealthCheck(async () => {
      const result = await checkInstitutionHealthAction(selectedInstitution.id);
      if (result.error || !result.data) {
        setActionError(result.error ?? "No fue posible ejecutar el health check.");
        return;
      }

      const health = result.data;
      setHealthByInstitution((currentHealth) => ({
        ...currentHealth,
        [selectedInstitution.id]: {
          ...health,
          checkedAt: new Date().toISOString(),
        },
      }));
    });
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Integraciones IPS"
        description="Administra instituciones existentes, su URL de servicio y la disponibilidad del servicio conectado."
      />

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {actionError}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {statusMessage}
        </div>
      ) : null}

      <FilterBar>
        <SearchInput
          id="integrations-search"
          label="Buscar IPS"
          value={search}
          onChange={setSearch}
          placeholder="Nombre, NIT, URL o estado"
        />
      </FilterBar>

      <QuickStats items={stats} />

      {items.length === 0 ? (
        <EmptyState
          title="No hay instituciones para gestionar"
          description="Cuando existan IPS registradas en la API apareceran en esta vista."
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <p className="text-sm font-semibold text-slate-900">Instituciones</p>
              <p className="mt-1 text-sm text-slate-600">
                {filteredInstitutions.length} IPS visibles.
              </p>
            </div>
            <div className="max-h-[720px] overflow-y-auto">
              {filteredInstitutions.map((institution) => {
                const health = healthByInstitution[institution.id];
                const isSelected = institution.id === selectedInstitutionId;

                return (
                  <button
                    key={institution.id}
                    type="button"
                    onClick={() => selectInstitution(institution)}
                    className={`block w-full border-b border-slate-100 p-4 text-left transition focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-600 ${
                      isSelected ? "bg-cyan-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900">{institution.name}</span>
                      {health ? <HealthBadge status={health.status} /> : null}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      NIT {institution.nit}
                    </span>
                    <span className="mt-2 block truncate text-xs text-slate-500">
                      {institution.serviceUrl || "Sin URL de servicio"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedInstitution ? (
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedInstitution.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Edita la informacion operativa y valida la URL exacta del servicio.
                  </p>
                </div>
                <StatusBadge status={form.status} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <TextField label="Nombre" value={form.name} onChange={(value) => updateField("name", value)} />
                <TextField label="NIT" value={form.nit} onChange={(value) => updateField("nit", value)} />
                <TextField label="Direccion" value={form.address} onChange={(value) => updateField("address", value)} />
                <TextField label="Telefono" value={form.phone} onChange={(value) => updateField("phone", value)} />
                <TextField label="Estado" value={form.status} onChange={(value) => updateField("status", value)} />
                <TextField label="Logo URL" value={form.logoUrl} onChange={(value) => updateField("logoUrl", value)} />
                <TextField label="Longitud" value={form.longitude} onChange={(value) => updateField("longitude", value)} />
                <TextField label="Latitud" value={form.latitude} onChange={(value) => updateField("latitude", value)} />
                <div className="md:col-span-2">
                  <TextField
                    label="URL servicio"
                    value={form.serviceUrl}
                    onChange={(value) => updateField("serviceUrl", value)}
                    placeholder="https://ips.example.com"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Health check</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Prueba exactamente la URL configurada para esta institucion.
                    </p>
                  </div>
                  {selectedHealth ? <HealthBadge status={selectedHealth.status} /> : null}
                </div>

                <dl className="mt-4 grid gap-3 md:grid-cols-3">
                  <HealthMetric label="HTTP" value={selectedHealth?.status_code ?? "N/A"} />
                  <HealthMetric label="Latencia" value={selectedHealth?.latency_ms != null ? `${selectedHealth.latency_ms} ms` : "N/A"} />
                  <HealthMetric label="Ultima revision" value={selectedHealth ? formatDateTime(selectedHealth.checkedAt) : "Sin revisar"} />
                </dl>
                <p className="mt-3 text-sm text-slate-600">
                  {selectedHealth?.message ?? "Ejecuta un health check para ver el estado actual."}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveInstitution}
                  disabled={isSaving}
                  className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={checkHealth}
                  disabled={isCheckingHealth || !form.serviceUrl.trim() || hasPendingChanges}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {isCheckingHealth
                    ? "Validando..."
                    : hasPendingChanges
                      ? "Guarda antes de validar"
                      : "Ejecutar health check"}
                </button>
              </div>
            </article>
          ) : null}
        </section>
      )}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = `integration-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      />
    </div>
  );
}

function HealthBadge({ status }: { status: HealthSnapshot["status"] }) {
  const styles = {
    UP: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    DOWN: "bg-rose-50 text-rose-700 ring-rose-600/20",
    NOT_CONFIGURED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

function HealthMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function toEditableInstitution(institution?: IntegrationInstitutionRow): EditableInstitution {
  return {
    name: institution?.name ?? "",
    nit: institution?.nit ?? "",
    address: institution?.address ?? "",
    phone: institution?.phone ?? "",
    status: institution?.status ?? "activo",
    longitude: institution?.longitude == null ? "" : String(institution.longitude),
    latitude: institution?.latitude == null ? "" : String(institution.latitude),
    logoUrl: institution?.logoUrl ?? "",
    serviceUrl: institution?.serviceUrl ?? "",
  };
}

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized || null;
}

function nullableNumber(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  })
    .format(new Date(value))
    .replace(/[\u00a0\u202f]/g, " ");
}
