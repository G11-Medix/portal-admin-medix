export default function AuditReportsPage() {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Reportes de auditoria
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Proximamente: analisis de logs de aplicacion
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta seccion permitira consultar eventos auditados, actividad de usuarios,
          errores operativos y trazabilidad de acciones dentro del ecosistema Medix.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-cyan-300 bg-cyan-50/60 p-8">
        <p className="text-base font-semibold text-slate-900">
          Observabilidad operativa en construccion
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
          El objetivo es convertir los registros de auditoria en reportes utiles para
          soporte, seguridad y seguimiento de integraciones: filtros por usuario,
          endpoint, resultado, rango de fechas y tipo de accion.
        </p>
      </div>
    </section>
  );
}
