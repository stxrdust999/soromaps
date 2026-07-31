"use client";

import { flexRender, type Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface RowCommonProps<TData> {
  row: Row<TData>;
}

/**
 * A single table row. Renders visible cells only, so hiding a column through
 * the "Colunas" dropdown needs no logic here. `data-state="selected"` is the
 * styling hook for selection; the color comes from shadcn's `TableRow`.
 *
 * @param props Row instance.
 */
export function RowCommon<TData>({ row }: RowCommonProps<TData>) {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(cell.column.columnDef.meta?.cellClassName)}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
