export function formatDateTime(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("es-CO", options)
    .format(new Date(value))
    .replace(/[\u00a0\u202f]/g, " ");
}
