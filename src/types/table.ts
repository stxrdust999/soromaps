import type { RowData } from "@tanstack/react-table";

/**
 * Extends TanStack Table's `ColumnMeta` so width, alignment and visibility
 * live in the column definition instead of the table JSX.
 */
declare module "@tanstack/react-table" {
  /**
   * `TData` and `TValue` are unused here but must keep these exact names:
   * declaration merging requires type parameters identical to the original
   * (`TS2428`), so the linter's `_` rename breaks the build.
   */
  // biome-ignore lint/correctness/noUnusedVariables: exigidos pelo declaration merging
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Label shown in the "Colunas" dropdown. Columns without it stay out of
     * the menu and cannot be hidden — that is what protects the actions and
     * search columns.
     */
    visibilityDisplayName?: string;

    /**
     * `false` starts the column hidden. Only applies when `useTableConfig`
     * runs without `defaultVisibility`.
     */
    defaultVisibility?: boolean;

    /** `<th>` classes — header width and alignment. */
    headerClassName?: string;

    /** `<td>` classes — usually repeats the header width. */
    cellClassName?: string;
  }
}
