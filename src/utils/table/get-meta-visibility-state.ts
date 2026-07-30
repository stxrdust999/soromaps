import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

/**
 * Derives initial column visibility from each column's
 * `meta.defaultVisibility`. Alternative to passing an explicit
 * `defaultVisibility` to `useTableConfig` — pick one per screen.
 *
 * @param columns Column definitions.
 * @returns Visibility state holding only columns that declare the meta.
 */
export function getMetaVisibilityState<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
): VisibilityState {
  return columns.reduce<VisibilityState>((state, column) => {
    const columnId =
      column.id ??
      ("accessorKey" in column ? String(column.accessorKey) : null);

    if (!columnId) return state;
    if (column.meta?.defaultVisibility === undefined) return state;

    state[columnId] = column.meta.defaultVisibility;

    return state;
  }, {});
}
