type StatItem = {
  label: string;
  value: number;
};

type QuickStatsProps = {
  items: StatItem[];
};

export function QuickStats({ items }: QuickStatsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
        </article>
      ))}
    </section>
  );
}
