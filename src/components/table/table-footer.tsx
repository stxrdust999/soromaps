"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TableFooterProps<TData> {
  table: Table<TData>;

  /** Hides the selection counter on tables without checkboxes. */
  hiddenSelectedRows?: boolean;

  rowsPerPage?: number[];
  className?: string;
}

/**
 * Table footer: selection counter, rows per page and pagination controls.
 * Every part reads and writes straight to the table instance — no callbacks —
 * so moving to server-side pagination is a change in the hook, not here.
 *
 * @param props Table instance, page size options and visibility flags.
 */
export function TableFooter<TData>({
  table,
  hiddenSelectedRows = false,
  rowsPerPage = [10, 25, 50],
  className,
}: TableFooterProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex flex-row gap-6 items-center">
        {/* linhas por página - seletor */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm font-medium">Linhas por página</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              darkenOnOpen
              className="flex flex-row gap-4 border py-4.25"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper" side="top">
              {rowsPerPage.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* seleção - contador */}
        {!hiddenSelectedRows && (
          <span className="text-muted-foreground text-sm">
            {selectedRows} de {totalRows} linha(s) selecionadas.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* paginação - informação */}
        <span className="text-sm font-medium">
          Página {pageCount === 0 ? 0 : pageIndex + 1} de {pageCount}
        </span>

        {/* paginação - controles */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden size-8 md:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Primeira página"
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Próxima página"
          >
            <ChevronRightIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden size-8 md:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Última página"
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
