"use client";

import type { Column, Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputFilterProps<TData, TValue> {
  table: Table<TData>;
  column: Column<TData, TValue>;

  placeholder?: string;
  className?: string;
}

/**
 * Toolbar quick search. Not global: it targets one column chosen by the
 * screen — the one users actually search by. Local state mirrors the column
 * filter so the input stays controlled when the filter is cleared elsewhere.
 *
 * @param props Table and target column, plus placeholder text.
 */
export function SearchInputFilter<TData, TValue>({
  table,
  column,
  placeholder = "Pesquisar...",
  className,
}: SearchInputFilterProps<TData, TValue>) {
  const columnFilterValue = (column.getFilterValue() as string) ?? "";
  const [value, setValue] = useState<string>(columnFilterValue);

  useEffect(() => {
    setValue(columnFilterValue);
  }, [columnFilterValue]);

  function handleChange(nextValue: string) {
    setValue(nextValue);
    column.setFilterValue(nextValue);

    table.setPageIndex(0);
  }

  return (
    <div className={cn("relative w-full max-w-72", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
