import type { Table } from "@tanstack/react-table";

interface HasActiveFiltersProps<TData> {
  table: Table<TData>;
}

/**
 * Tells whether any column filter is applied, or sorting differs from the
 * table's `defaultSorting` — drives the "clear filters" button, which resets
 * both. Comparing against `defaultSorting` (not `sorting.length > 0`) is what
 * lets a screen open pre-sorted without the button showing on load.
 *
 * @param props Table instance.
 * @returns `true` when there is something to clear.
 */
export function hasActiveFilters<TData>({
  table,
}: HasActiveFiltersProps<TData>): boolean {
  const { columnFilters, sorting } = table.getState();
  const defaultSorting = table.initialState.sorting ?? [];

  const sortingChanged =
    JSON.stringify(sorting) !== JSON.stringify(defaultSorting);

  return columnFilters.length > 0 || sortingChanged;
}
