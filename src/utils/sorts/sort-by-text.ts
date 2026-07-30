import type { Row, SortingFn } from "@tanstack/react-table";

/**
 * Builds a text `sortingFn` using `localeCompare` in pt-BR with
 * `sensitivity: "base"`, so accent and case do not split names apart
 * ("Ávila" sorts next to "avila").
 *
 * @param selector Returns the row's text; nullish becomes `""`.
 * @returns Sorting function comparing the selected strings.
 */
export function textSortingFn<TData>(
  selector: (row: TData) => string | null | undefined,
): SortingFn<TData> {
  return (rowA: Row<TData>, rowB: Row<TData>) => {
    const a = selector(rowA.original) ?? "";
    const b = selector(rowB.original) ?? "";

    return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
  };
}
