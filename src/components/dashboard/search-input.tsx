type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
  label: string;
};

export function SearchInput({ value, onChange, placeholder, id, label }: SearchInputProps) {
  return (
    <div className="flex min-w-[220px] flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      />
    </div>
  );
}
