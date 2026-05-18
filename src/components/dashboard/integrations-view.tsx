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
import {
  type InstitucionHealthResponse,
  type InstitucionUpdatePayload,
} from "@/lib/medix-api/types";
import { type IntegrationInstitutionRow } from "@/types/admin";

/* eslint-disable @next/next/no-img-element -- IPS logos come from user-managed external URLs without a fixed remote domain allowlist. */

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

type EditableInstitutionField = keyof EditableInstitution;

const editableInstitutionFields: Array<{
  key: EditableInstitutionField;
  label: string;
  placeholder?: string;
  className?: string;
}> = [
  { key: "name", label: "Nombre" },
  { key: "nit", label: "NIT" },
  { key: "address", label: "Direccion" },
  { key: "phone", label: "Telefono" },
  { key: "status", label: "Estado" },
  { key: "logoUrl", label: "Logo URL" },
  { key: "longitude", label: "Longitud" },
  { key: "latitude", label: "Latitud" },
  {
    key: "serviceUrl",
    label: "URL servicio",
    placeholder: "https://ips.example.com",
    className: "md:col-span-2",
  },
];

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

  const stats = getIntegrationStats(items, healthByInstitution);

  function selectInstitution(institution: IntegrationInstitutionRow) {
    setSelectedInstitutionId(institution.id);
    setForm(toEditableInstitution(institution));
    setStatusMessage("");
    setActionError("");
  }

  function updateField(field: EditableInstitutionField, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function saveInstitution() {
    if (!selectedInstitution) {
      return;
    }

    setStatusMessage("");
    setActionError("");
    const validationError = getInstitutionFormError(form);
    if (validationError) {
      setActionError(validationError);
      return;
    }

    startSaving(async () => {
      const result = await updateInstitutionAction(
        selectedInstitution.id,
        toInstitutionUpdatePayload(form),
      );

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
          <InstitutionList
            institutions={filteredInstitutions}
            healthByInstitution={healthByInstitution}
            selectedInstitutionId={selectedInstitutionId}
            onSelect={selectInstitution}
          />

          {selectedInstitution ? (
            <InstitutionEditor
              form={form}
              institution={selectedInstitution}
              selectedHealth={selectedHealth}
              hasPendingChanges={hasPendingChanges}
              isCheckingHealth={isCheckingHealth}
              isSaving={isSaving}
              onCheckHealth={checkHealth}
              onSave={saveInstitution}
              onUpdateField={updateField}
            />
          ) : null}
        </section>
      )}
    </section>
  );
}

function InstitutionList({
  institutions,
  healthByInstitution,
  selectedInstitutionId,
  onSelect,
}: {
  institutions: IntegrationInstitutionRow[];
  healthByInstitution: Record<number, HealthSnapshot>;
  selectedInstitutionId?: number;
  onSelect: (institution: IntegrationInstitutionRow) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-900">Instituciones</p>
        <p className="mt-1 text-sm text-slate-600">
          {institutions.length} IPS visibles.
        </p>
      </div>
      <div className="max-h-[720px] overflow-y-auto">
        {institutions.map((institution) => {
          const health = healthByInstitution[institution.id];
          const isSelected = institution.id === selectedInstitutionId;

          return (
            <button
              key={institution.id}
              type="button"
              onClick={() => onSelect(institution)}
              className={`block w-full border-b border-slate-100 p-4 text-left transition focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-600 ${
                isSelected ? "bg-cyan-50" : "hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <InstitutionLogo institution={institution} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-slate-900">
                      {institution.name}
                    </span>
                    {health ? <HealthBadge status={health.status} /> : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    NIT {institution.nit}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {institution.serviceUrl || "Sin URL de servicio"}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InstitutionEditor({
  form,
  institution,
  selectedHealth,
  hasPendingChanges,
  isCheckingHealth,
  isSaving,
  onCheckHealth,
  onSave,
  onUpdateField,
}: {
  form: EditableInstitution;
  institution: IntegrationInstitutionRow;
  selectedHealth?: HealthSnapshot;
  hasPendingChanges: boolean;
  isCheckingHealth: boolean;
  isSaving: boolean;
  onCheckHealth: () => void;
  onSave: () => void;
  onUpdateField: (field: EditableInstitutionField, value: string) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <InstitutionLogo
            institution={{ ...institution, logoUrl: form.logoUrl }}
            size="lg"
          />
          <div>
            <p className="text-base font-semibold text-slate-900">
              {institution.name}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">
              Edita la informacion operativa y valida la URL exacta del servicio.
            </p>
          </div>
        </div>
        <StatusBadge status={form.status} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {editableInstitutionFields.map((field) => (
          <div key={field.key} className={field.className}>
            <TextField
              label={field.label}
              value={form[field.key]}
              onChange={(value) => onUpdateField(field.key, value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <HealthPanel selectedHealth={selectedHealth} />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCheckHealth}
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
  );
}

function InstitutionLogo({
  institution,
  size,
}: {
  institution: Pick<IntegrationInstitutionRow, "logoUrl" | "name">;
  size: "sm" | "lg";
}) {
  const imageClassName =
    size === "sm"
      ? "h-10 w-10 rounded-lg"
      : "h-12 w-12 rounded-xl shadow-sm";
  const fallbackClassName =
    size === "sm"
      ? "h-10 w-10 rounded-lg text-xs"
      : "h-12 w-12 rounded-xl text-sm";

  if (institution.logoUrl) {
    return (
      <img
        src={institution.logoUrl}
        alt={`Logo ${institution.name}`}
        className={`${imageClassName} shrink-0 border border-slate-200 bg-white object-contain p-1`}
      />
    );
  }

  return (
    <span
      className={`${fallbackClassName} flex shrink-0 items-center justify-center border border-slate-200 bg-slate-100 font-bold text-slate-500`}
    >
      {institution.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function HealthPanel({ selectedHealth }: { selectedHealth?: HealthSnapshot }) {
  return (
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
        <HealthMetric
          label="Latencia"
          value={
            selectedHealth?.latency_ms != null
              ? `${selectedHealth.latency_ms} ms`
              : "N/A"
          }
        />
        <HealthMetric
          label="Ultima revision"
          value={
            selectedHealth
              ? formatDateTime(selectedHealth.checkedAt)
              : "Sin revisar"
          }
        />
      </dl>
      <p className="mt-3 text-sm text-slate-600">
        {selectedHealth?.message ??
          "Ejecuta un health check para ver el estado actual."}
      </p>
    </div>
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

function toInstitutionUpdatePayload(
  form: EditableInstitution,
): InstitucionUpdatePayload {
  return {
    nombre: form.name,
    nit: form.nit,
    direccion: nullableText(form.address),
    telefono: nullableText(form.phone),
    estado: form.status.toUpperCase(),
    longitud: nullableNumber(form.longitude),
    latitud: nullableNumber(form.latitude),
    logo_url: nullableText(form.logoUrl),
    service_url: nullableText(form.serviceUrl),
  };
}

function getInstitutionFormError(form: EditableInstitution) {
  const longitudeError = getCoordinateError(form.longitude, "Longitud", -180, 180);
  if (longitudeError) {
    return longitudeError;
  }

  const latitudeError = getCoordinateError(form.latitude, "Latitud", -90, 90);
  if (latitudeError) {
    return latitudeError;
  }

  const logoUrlError = getUrlError(form.logoUrl, "Logo URL");
  if (logoUrlError) {
    return logoUrlError;
  }

  const serviceUrlError = getUrlError(form.serviceUrl, "URL servicio");
  if (serviceUrlError) {
    return serviceUrlError;
  }

  return undefined;
}

function getCoordinateError(
  value: string,
  label: string,
  minValue: number,
  maxValue: number,
) {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return `${label} debe ser un numero valido.`;
  }

  if (parsed < minValue || parsed > maxValue) {
    return `${label} debe estar entre ${minValue} y ${maxValue}.`;
  }

  return undefined;
}

function getUrlError(value: string, label: string) {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  try {
    const url = new URL(normalized);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return undefined;
    }
  } catch {
    // Return the shared message below for invalid URLs.
  }

  return `${label} debe ser una URL valida que empiece por http:// o https://.`;
}

function getIntegrationStats(
  institutions: IntegrationInstitutionRow[],
  healthByInstitution: Record<number, HealthSnapshot>,
) {
  const healthSnapshots = Object.values(healthByInstitution);

  return [
    { label: "IPS gestionadas", value: institutions.length },
    {
      label: "Con URL servicio",
      value: institutions.filter((institution) => institution.serviceUrl).length,
    },
    {
      label: "Servicios arriba",
      value: healthSnapshots.filter((health) => health.status === "UP").length,
    },
    {
      label: "Requieren revision",
      value: healthSnapshots.filter((health) => health.status === "DOWN").length,
    },
  ];
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
