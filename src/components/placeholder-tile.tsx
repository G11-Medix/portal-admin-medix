type PlaceholderTileProps = {
  title: string;
  description: string;
};

export function PlaceholderTile({ title, description }: PlaceholderTileProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
        Placeholder
      </span>
    </article>
  );
}
