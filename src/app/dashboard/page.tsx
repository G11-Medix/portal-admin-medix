import Link from "next/link";

const dashboardActions = [
  {
    href: "/dashboard/appointments",
    title: "Citas agendadas",
    description:
      "Consulta la agenda por IPS, revisa pacientes, prestadores, especialidades y estado de cada cita.",
    cta: "Ver agenda",
  },
  {
    href: "/dashboard/users",
    title: "Pacientes",
    description:
      "Explora los pacientes registrados en la plataforma con busqueda por nombre, correo o documento.",
    cta: "Consultar pacientes",
  },
  {
    href: "/dashboard/integrations",
    title: "Integraciones IPS",
    description:
      "Proximamente podras administrar conexiones con IPS y validar disponibilidad de sus servicios.",
    cta: "Ver estado",
  },
  {
    href: "/dashboard/audit-reports",
    title: "Reportes de auditoria",
    description:
      "Proximamente podras revisar logs de aplicacion, actividad de usuarios y eventos relevantes.",
    cta: "Ver proximamente",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Panel operativo
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Gestion central de citas y pacientes
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Usa este portal para monitorear la agenda conectada a medix-appointments-api,
          consultar pacientes y preparar la administracion de integraciones con IPS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardActions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 min-h-20 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-cyan-700">
              {item.cta}
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Flujo actual</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">1. Pacientes</p>
            <p className="mt-1 text-sm text-slate-600">
              La informacion viene de los endpoints protegidos de pacientes.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">2. IPS</p>
            <p className="mt-1 text-sm text-slate-600">
              La agenda se consulta por IPS seleccionada, sin vista global.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">3. Citas</p>
            <p className="mt-1 text-sm text-slate-600">
              Cada cita muestra paciente, documento, medico, especialidad y estado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
