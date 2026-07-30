import type { FilterFn, Row } from "@tanstack/react-table";

/** Formats a `Date` as `dd/MM/yyyy`. */
function toDayString(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Builds a `filterFn` that matches by day only: the picker yields a `Date`
 * while the cell renders `dd/MM/yyyy - HH:mm`, so both sides are reduced
 * to the day before comparing.
 *
 * @param selector Returns the row's formatted date, same string as the cell.
 * @returns Filter function; keeps every row when no valid date is set.
 */
export function filterByDateFn<TData>(
  selector: (row: TData) => string,
): FilterFn<TData> {
  return (row: Row<TData>, _columnId: string, filterValue: unknown) => {
    if (!filterValue) return true;

    const filterDate =
      filterValue instanceof Date ? filterValue : new Date(String(filterValue));

    if (Number.isNaN(filterDate.getTime())) return true;

    const [rowDay] = selector(row.original).split(" - ");

    return rowDay === toDayString(filterDate);
  };
}
