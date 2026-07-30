import type { Table } from "@tanstack/react-table";

interface ColumnIsVisibleProps<TData> {
  table: Table<TData>;
  columnId: string;
}

/**
 * Tells whether a column is currently visible. The filter form uses it to
 * disable fields of hidden columns.
 *
 * @param props Table instance and column id.
 * @returns `true` when visible; `false` when hidden or unknown.
 */
export function columnIsVisible<TData>({
  table,
  columnId,
}: ColumnIsVisibleProps<TData>): boolean {
  return table.getColumn(columnId)?.getIsVisible() ?? false;
}
