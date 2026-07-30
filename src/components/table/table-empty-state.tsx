import type { ColumnDef } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyStateProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  message?: string;
}

/**
 * Single row shown when the table has no results. Takes the column
 * definitions only to compute `colSpan`; without it the message would be
 * squeezed into the first column.
 *
 * @param props Column definitions and the message to show.
 */
export function TableEmptyState<TData, TValue>({
  columns,
  message = "Nenhum resultado encontrado.",
}: TableEmptyStateProps<TData, TValue>) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={columns.length}
        className="h-24 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
