import type { Row, SortingFn } from "@tanstack/react-table";

/**
 * Parses `dd/MM/yyyy` or `dd/MM/yyyy - HH:mm` into a comparable timestamp;
 * unparseable input becomes `0` and sinks to the bottom.
 *
 * @param value Formatted date string.
 * @returns Epoch milliseconds, or `0` when invalid.
 */
function toTimestamp(value: string): number {
  const [datePart, timePart] = value.split(" - ");
  const [day, month, year] = datePart.split("/").map(Number);

  if (!day || !month || !year) return 0;

  const [hours = 0, minutes = 0] = (timePart ?? "")
    .split(":")
    .map(Number)
    .filter((part) => !Number.isNaN(part));

  return new Date(year, month - 1, day, hours, minutes).getTime();
}

/**
 * Builds a date `sortingFn`. Sorting the raw text would put 02/01 before
 * 01/12, so both values go through {@link toTimestamp} first.
 *
 * @param selector Returns the row's formatted date, same string as the cell.
 * @returns Sorting function comparing timestamps.
 */
export function dateSortingFn<TData>(
  selector: (row: TData) => string,
): SortingFn<TData> {
  return (rowA: Row<TData>, rowB: Row<TData>) => {
    return (
      toTimestamp(selector(rowA.original)) -
      toTimestamp(selector(rowB.original))
    );
  };
}
