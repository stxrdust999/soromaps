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
          className={cn("-ml-3 h-8 data-[state=open]:bg-muted", className)}
        >
          <span>{title}</span>
          {sorted === "desc" ? (
            <ArrowDownIcon className="size-4" />
          ) : sorted === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon className="size-4 text-muted-foreground" />
          Crescente
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon className="size-4 text-muted-foreground" />
          Decrescente
        </DropdownMenuItem>

        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon className="size-4 text-muted-foreground" />
              Ocultar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
