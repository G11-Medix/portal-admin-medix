"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AuditLogDetailCard } from "@/components/dashboard/audit-log-detail-card";
import { AuditReportsTable } from "@/components/dashboard/audit-reports-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { SearchInput } from "@/components/dashboard/search-input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { type AuditLogRow } from "@/lib/audit-reports";
import { formatDateTime } from "@/lib/date-format";

type AuditReportsViewProps = {
  logs: AuditLogRow[];
  error?: string;
};

type BreakdownItem = {
  label: string;
  value: number;
};

const PAGE_SIZE = 25;

export function AuditReportsView({ logs, error }: AuditReportsViewProps) {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedLogId, setSelectedLogId] = useState<number>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : undefined;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : undefined;

    return logs.filter((log) => {
      const occurredAt = new Date(log.occurredAt).getTime();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        log.action.toLowerCase().includes(normalizedSearch) ||
        log.path.toLowerCase().includes(normalizedSearch) ||
        log.query.toLowerCase().includes(normalizedSearch) ||
        log.ipAddress.toLowerCase().includes(normalizedSearch) ||
        (log.userId ?? "").toLowerCase().includes(normalizedSearch) ||
        log.detail.toLowerCase().includes(normalizedSearch);
      const matchesResult = resultFilter === "all" || log.result === resultFilter;
      const matchesMethod = methodFilter === "all" || log.method === methodFilter;
      const matchesResource = resourceFilter === "all" || log.resource === resourceFilter;
      const matchesDateFrom = fromTime === undefined || occurredAt >= fromTime;
      const matchesDateTo = toTime === undefined || occurredAt <= toTime;

      return (
        matchesSearch &&
        matchesResult &&
        matchesMethod &&
        matchesResource &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [dateFrom, dateTo, logs, methodFilter, resourceFilter, resultFilter, search]);

  const selectedLog = filteredLogs.find((log) => log.id === selectedLogId);
  const visibleLogs = filteredLogs.slice(0, visibleCount);
  const hasMoreLogs = visibleCount < filteredLogs.length;
  const resultOptions = getUniqueOptions(logs.map((log) => log.result));
  const methodOptions = getUniqueOptions(logs.map((log) => log.method));
  const resourceOptions = getUniqueOptions(logs.map((log) => log.resource));
  const failedLogs = filteredLogs.filter(isFailedLog);
  const writeLogs = filteredLogs.filter((log) =>
    ["POST", "PUT", "PATCH", "DELETE"].includes(log.method),
  );
  const uniqueUsers = new Set(filteredLogs.map((log) => log.userId).filter(Boolean)).size;
  const uniqueIps = new Set(filteredLogs.map((log) => log.ipAddress)).size;

  const stats = [
    { label: "Eventos visibles", value: filteredLogs.length },
    { label: "Errores o alertas", value: failedLogs.length },
    { label: "Acciones de escritura", value: writeLogs.length },
    { label: "Usuarios identificados", value: uniqueUsers },
  ];

  const resourceBreakdown = getTopBreakdown(filteredLogs, "resource", 6);
  const ipBreakdown = getTopBreakdown(filteredLogs, "ipAddress", 5);
  const resultBreakdown = getTopBreakdown(filteredLogs, "result", 4);
  const methodBreakdown = getTopBreakdown(filteredLogs, "method", 5);
  const recentFailures = failedLogs.slice(0, 5);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMoreLogs) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((currentValue) =>
            Math.min(currentValue + PAGE_SIZE, filteredLogs.length),
          );
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredLogs.length, hasMoreLogs]);

  function resetVisibleLogs() {
    setVisibleCount(PAGE_SIZE);
    setSelectedLogId(undefined);
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Reportes de auditoria"
        description="Analiza los eventos registrados en Log_Auditoria para detectar errores, rutas sensibles, actividad por usuario e IPs con mayor movimiento."
      />

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <FilterBar>
        <SearchInput
          id="audit-search"
          label="Buscar evento"
          value={search}
          onChange={(value) => {
            setSearch(value);
            resetVisibleLogs();
          }}
          placeholder="Ruta, usuario, IP, detalle o query"
        />

        <SelectFilter
          id="audit-result"
          label="Resultado"
          value={resultFilter}
          options={resultOptions}
          onChange={(value) => {
            setResultFilter(value);
            resetVisibleLogs();
          }}
        />
        <SelectFilter
          id="audit-method"
          label="Metodo"
          value={methodFilter}
          options={methodOptions}
          onChange={(value) => {
            setMethodFilter(value);
            resetVisibleLogs();
          }}
        />
        <SelectFilter
          id="audit-resource"
          label="Recurso"
          value={resourceFilter}
          options={resourceOptions}
          onChange={(value) => {
            setResourceFilter(value);
            resetVisibleLogs();
          }}
        />

        <DateFilter
          id="audit-from"
          label="Desde"
          value={dateFrom}
          onChange={(value) => {
            setDateFrom(value);
            resetVisibleLogs();
          }}
        />
        <DateFilter
          id="audit-to"
          label="Hasta"
          value={dateTo}
          onChange={(value) => {
            setDateTo(value);
            resetVisibleLogs();
          }}
        />
      </FilterBar>

      <QuickStats items={stats} />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <BreakdownPanel
            title="Rutas con mas actividad"
            description="Ayuda a identificar modulos de alto uso o rutas que merecen revision."
            items={resourceBreakdown}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <BreakdownPanel
              title="Resultado de eventos"
              description="Balance de exitos, errores y respuestas intermedias."
              items={resultBreakdown}
            />
            <BreakdownPanel
              title="Metodos HTTP"
              description="Separacion rapida entre consultas y cambios de datos."
              items={methodBreakdown}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">IPs con mas movimiento</p>
            <p className="mt-1 text-sm text-slate-600">
              {uniqueIps} origenes visibles en el rango filtrado.
            </p>
            <div className="mt-4 space-y-3">
              {ipBreakdown.map((item) => (
                <MetricRow key={item.label} item={item} max={ipBreakdown[0]?.value ?? 1} />
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-rose-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Eventos para revisar</p>
            <p className="mt-1 text-sm text-slate-600">
              Ultimos errores o respuestas no exitosas del conjunto filtrado.
            </p>
            <div className="mt-4 space-y-3">
              {recentFailures.length > 0 ? (
                recentFailures.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedLogId(log.id)}
                    className="block w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-rose-200 hover:bg-rose-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  >
                    <span className="text-xs font-semibold text-rose-700">
                      {log.statusCode} ·{" "}
                      {formatDateTime(log.occurredAt, {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-slate-900">
                      {log.method} {log.path}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">{log.ipAddress}</span>
                  </button>
                ))
              ) : (
                <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  No hay errores en los filtros actuales.
                </p>
              )}
            </div>
          </article>
        </aside>
      </section>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No hay logs con los criterios seleccionados"
          description="Cambia el rango, resultado, recurso o busqueda para ampliar el reporte."
        />
      ) : (
        <section className="space-y-4">
          {selectedLog ? (
            <AuditLogDetailCard log={selectedLog} />
          ) : (
            <article className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
              Selecciona un log con la accion Ver para inspeccionar su trazabilidad completa.
            </article>
          )}
          <AuditReportsTable
            logs={visibleLogs}
            selectedLogId={selectedLogId}
            onView={setSelectedLogId}
          />
          <div ref={loadMoreRef} className="min-h-6">
            {hasMoreLogs ? (
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-600 shadow-sm">
                Cargando mas logs... {visibleLogs.length} de {filteredLogs.length}
              </p>
            ) : (
              <p className="text-center text-sm text-slate-500">
                Mostrando {visibleLogs.length} logs.
              </p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}

function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-[150px] flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      >
        <option value="all">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateFilter({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-[145px] flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      />
    </div>
  );
}

function BreakdownPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: BreakdownItem[];
}) {
  const max = items[0]?.value ?? 1;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => <MetricRow key={item.label} item={item} max={max} />)
        ) : (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            Sin datos para graficar.
          </p>
        )}
      </div>
    </article>
  );
}

function MetricRow({ item, max }: { item: BreakdownItem; max: number }) {
  const width = `${Math.max((item.value / max) * 100, 8)}%`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-slate-800">{item.label}</span>
        <span className="text-slate-500">{item.value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-cyan-600" style={{ width }} />
      </div>
    </div>
  );
}

function getTopBreakdown<T extends keyof AuditLogRow>(
  logs: AuditLogRow[],
  key: T,
  limit: number,
) {
  const counts = logs.reduce<Map<string, number>>((items, log) => {
    const label = String(log[key] || "N/A");
    items.set(label, (items.get(label) ?? 0) + 1);
    return items;
  }, new Map());

  return Array.from(counts, ([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, limit);
}

function getUniqueOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((first, second) =>
    first.localeCompare(second),
  );
}

function isFailedLog(log: AuditLogRow) {
  const statusCode = Number(log.statusCode);
  const result = log.result.trim().toLowerCase();

  return result !== "exito" || (Number.isFinite(statusCode) && statusCode >= 400);
}
