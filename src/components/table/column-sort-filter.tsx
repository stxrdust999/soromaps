"use client";

import type { Column } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ColumnSortFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;

  className?: string;
}

/**
 * Default column header: title plus sorting menu. Degrades to a plain label
 * when the column cannot sort, so it works as `header` of any column with no
 * conditional in the definition. "Ocultar" shows only for hideable columns.
 *
 * @param props Column instance and header title.
 */
export function ColumnSortFilter<TData, TValue>({
  column,
  title,
  className,
}: ColumnSortFilterProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className={cn("text-sm font-medium", className)}>{title}</span>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "group/sort -ml-2.5 h-8 px-2.5 font-medium text-muted-foreground data-[state=open]:bg-muted",
            sorted && "text-foreground",
            className,
          )}
        >
          <span>{title}</span>
          {sorted === "desc" ? (
            <ArrowDownIcon className="size-4" />
          ) : sorted === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ChevronsUpDownIcon className="size-4 opacity-0 transition-opacity group-hover/sort:opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem
          className="flex flex-row justify-between gap-6"
          onClick={() => column.toggleSorting(false)}
        >
          Crescente
          <ArrowUpIcon className="size-4 text-muted-foreground" />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex flex-row justify-between gap-6"
          onClick={() => column.toggleSorting(true)}
        >
          Decrescente
          <ArrowDownIcon className="size-4 text-muted-foreground" />
        </DropdownMenuItem>

        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex flex-row justify-between gap-6"
              onClick={() => column.toggleVisibility(false)}
            >
              Ocultar
              <EyeOffIcon className="size-4 text-muted-foreground" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
