export default function IntegrationsPage() {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Integraciones IPS
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Proximamente: gestion de integraciones
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta seccion concentrara la administracion de IPS conectadas, estado de
          servicios, rutas de integracion y validaciones operativas.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-cyan-300 bg-cyan-50/60 p-8">
        <p className="text-base font-semibold text-slate-900">
          Gestion de conexiones en construccion
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
          Por ahora las citas se consultan desde la agenda por IPS. En una siguiente
          iteracion este modulo permitira revisar credenciales, endpoints, disponibilidad
          y estado de sincronizacion por institucion.
        </p>
      </div>
    </section>
  );
}
