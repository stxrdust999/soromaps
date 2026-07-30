"use client";

import { flexRender, type HeaderGroup } from "@tanstack/react-table";

import { TableHead, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableHeaderTemplateProps<TData> {
  /** Resolved by `useTableConfig`, so the whole table instance is not needed. */
  header: HeaderGroup<TData>[];
}

/**
 * Renders the table header groups. Each `<th>` takes width and alignment from
 * `meta.headerClassName` in the column definition, not from screen JSX —
 * `meta.cellClassName` repeats it to keep header and body aligned.
 *
 * @param props Header groups to render.
 */
export function TableHeaderTemplate<TData>({
  header,
}: TableHeaderTemplateProps<TData>) {
  return (
    <>
      {header.map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((headerItem) => (
            <TableHead
              key={headerItem.id}
              colSpan={headerItem.colSpan}
              className={cn(headerItem.column.columnDef.meta?.headerClassName)}
            >
              {headerItem.isPlaceholder
                ? null
                : flexRender(
                    headerItem.column.columnDef.header,
                    headerItem.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </>
  );
}
