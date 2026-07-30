import type { Table } from "@tanstack/react-table";

interface HasActiveFiltersProps<TData> {
  table: Table<TData>;
}

/**
 * Tells whether any column filter or sorting is applied — drives the
 * "clear filters" button, which resets both.
 *
 * @param props Table instance.
 * @returns `true` when there is something to clear.
 */
export function hasActiveFilters<TData>({
  table,
}: HasActiveFiltersProps<TData>): boolean {
  const { columnFilters, sorting } = table.getState();

  return columnFilters.length > 0 || sorting.length > 0;
}
