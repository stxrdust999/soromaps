/**
 * Formats an ISO date as `dd/MM/yyyy - HH:mm`.
 *
 * Date columns feed `cell`, `filterFn` and `sortingFn` from this same
 * function, so users filter and sort exactly what they see.
 *
 * @param value ISO date string.
 * @returns Formatted date, or "Não informado" when missing or invalid.
 */
export function formatISODateTime(value?: string | null): string {
  if (!value) return "Não informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(", ", " - ");
}

/**
 * Same as {@link formatISODateTime}, without the time.
 *
 * @param value ISO date string.
 * @returns `dd/MM/yyyy`, or "Não informado" when missing or invalid.
 */
export function formatISODate(value?: string | null): string {
  if (!value) return "Não informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
