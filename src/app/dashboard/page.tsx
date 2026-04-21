import { PlaceholderTile } from "@/components/placeholder-tile";

const dashboardTiles = [
  {
    title: "Centros medicos (Integraciones)",
    description:
      "Gestion centralizada de integraciones con sistemas de agendamiento clinico.",
  },
  {
    title: "Metricas",
    description:
      "Vista consolidada de rendimiento operativo y calidad del asistente de voz.",
  },
  {
    title: "Infraestructura",
    description:
      "Estado de servicios, tareas de despliegue y disponibilidad tecnica.",
  },
  {
    title: "Usuarios internos",
    description:
      "Control de acceso y administracion del equipo interno de operaciones.",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Roadmap inicial</h2>
        <p className="mt-1 text-sm text-slate-600">
          Estos modulos estan listos como base visual para futuras iteraciones.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dashboardTiles.map((tile) => (
          <PlaceholderTile
            key={tile.title}
            title={tile.title}
            description={tile.description}
          />
        ))}
      </div>
    </section>
  );
}
