import type { ColumnFiltersState } from "@tanstack/react-table";

interface ResolveFiltersOptions<TValues> {
  /** Form fields that map to no column. */
  exclude?: (keyof TValues)[];

  /** Replaces a field value before it becomes a filter. */
  overrides?: Record<string, unknown>;
}

/**
 * Converts filter form values into `ColumnFiltersState`, dropping what
 * filters nothing (`undefined`, `null`, `""`, `[]`).
 *
 * Each remaining key becomes the filter `id`, so filter schema keys must
 * match column ids — a mismatch filters a non-existent column silently.
 *
 * @param values Filter form values.
 * @param options Fields to skip and per-field value overrides.
 * @returns Filters ready for `table.setColumnFilters`.
 */
export function resolveFilters<TValues extends Record<string, unknown>>(
  values: TValues,
  options: ResolveFiltersOptions<TValues> = {},
): ColumnFiltersState {
  const { exclude = [], overrides = {} } = options;

  return Object.entries(values).reduce<ColumnFiltersState>(
    (filters, [key, rawValue]) => {
      if (exclude.includes(key as keyof TValues)) return filters;

      const value = key in overrides ? overrides[key] : rawValue;

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) return filters;

      filters.push({ id: key, value });

      return filters;
    },
    [],
  );
}
