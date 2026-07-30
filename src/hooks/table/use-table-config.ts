"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { getMetaVisibilityState } from "@/utils/table/get-meta-visibility-state";

interface UseTableConfigProps<TData, TValue>
  extends Omit<
    Partial<TableOptions<TData>>,
    "data" | "columns" | "getCoreRowModel"
  > {
  data?: TData[];
  columns: ColumnDef<TData, TValue>[];

  defaultVisibility?: VisibilityState;
  defaultSorting?: SortingState;
  defaultRowSelection?: RowSelectionState;

  /** Rows per page on first render. */
  perPage?: number;
}

/**
 * The project's single table configuration — no screen calls `useReactTable`
 * directly. This is about not duplicating an architectural decision: one hook
 * per screen would turn any state fix into one PR per screen, and screens
 * would drift apart silently.
 *
 * Owns the controlled state (sorting, filters, visibility, selection,
 * pagination), the row models including faceting, `enableSortingRemoval:
 * false` and multi-row selection. Screens still own `data`, `columns` and the
 * defaults; the signature extends `Partial<TableOptions>` so an exotic need
 * passes a TanStack option through instead of forking the hook.
 *
 * ⚠️ `data` and `columns` must arrive memoized — TanStack compares by
 * reference, and a fresh array each render remounts the table, dropping
 * sorting, filters and current page.
 *
 * Pagination is client-side; when the API paginates, add `manualPagination`
 * here rather than rewriting the screen.
 *
 * @param props Data, columns, initial state and any TanStack option.
 * @returns `table` instance plus resolved `header` groups and `rows`.
 */
export function useTableConfig<TData, TValue>({
  data = [],
  columns,

  defaultVisibility,
  defaultSorting = [],
  defaultRowSelection = {},
  perPage = 10,

  ...options
}: UseTableConfigProps<TData, TValue>) {
  const initialVisibility = useMemo(() => {
    return defaultVisibility ?? getMetaVisibilityState(columns);
  }, [defaultVisibility, columns]);

  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(defaultRowSelection);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: perPage,
  });

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    enableSortingRemoval: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,

    ...options,
  });

  const header = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return { table, header, rows };
}
