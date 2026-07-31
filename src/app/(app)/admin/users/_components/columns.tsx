"use client";

import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

import { ColumnSortFilter } from "@/components/table/column-sort-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserResource } from "@/types/user";
import { formatISODateTime } from "@/utils/formatters/format-date";
import { dateSortingFn } from "@/utils/sorts/sort-by-date";
import { textSortingFn } from "@/utils/sorts/sort-by-text";
import { filterByDateFn } from "@/utils/table/filter-by-date";

import { UserListRowAction } from "./row-action";

/**
 * Single source of truth for `columnId -> label`, consumed by each column's
 * `header`, `meta.visibilityDisplayName` and `filter-form.tsx`.
 */
const userColumnsNames = {
  userName: "Nome",
  email: "E-mail",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
  actions: "Ações",
};

/** Initial column visibility — timestamps start hidden. */
const defaultColumnVisibility: VisibilityState = {
  // createdAt: false,
  // updatedAt: false,
};

/**
 * Column definitions for the users table. `accessorKey` doubles as the
 * filter schema key (`validations/users.ts`); `meta` carries the project's
 * width/alignment/visibility extension (`src/types/table.ts`).
 */
const columns: ColumnDef<UserResource>[] = [
  /* select - column */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todas as linhas"
        className="border border-black/35"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="border border-black/35"
      />
    ),

    enableSorting: false,
    enableHiding: false,

    meta: {
      headerClassName: "w-12 pr-0",
      cellClassName: "w-12 pr-0",
    },
  },

  /* userName - column */
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <ColumnSortFilter
        column={column}
        title={userColumnsNames.userName}
        className="w-full justify-between text-foreground"
      />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>
            {row.original.userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <span className="truncate">{row.original.userName}</span>
      </div>
    ),

    sortingFn: textSortingFn((user) => user.userName),

    meta: {
      headerClassName: "min-w-56",
      cellClassName: "min-w-56 font-medium",
    },
  },

  /* email - column */
  {
    accessorKey: "email",
    header: ({ column }) => (
      <ColumnSortFilter
        column={column}
        title={userColumnsNames.email}
        className="w-full justify-between text-foreground"
      />
    ),

    sortingFn: textSortingFn((user) => user.email),

    meta: {
      headerClassName: "min-w-64",
      cellClassName: "min-w-64 truncate text-muted-foreground",
    },
  },

  /* createdAt - column */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ColumnSortFilter
        column={column}
        title={userColumnsNames.createdAt}
        className="w-full justify-between text-foreground"
      />
    ),

    cell: ({ row }) => formatISODateTime(row.original.createdAt),

    filterFn: filterByDateFn((user) => formatISODateTime(user.createdAt)),
    sortingFn: dateSortingFn((user) => formatISODateTime(user.createdAt)),

    meta: {
      visibilityDisplayName: userColumnsNames.createdAt,
      headerClassName: "min-w-44 w-44",
      cellClassName: "min-w-44 w-44 text-muted-foreground",
    },
  },

  /* updatedAt - column */
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <ColumnSortFilter
        column={column}
        title={userColumnsNames.updatedAt}
        className="w-full justify-between text-foreground"
      />
    ),

    cell: ({ row }) => formatISODateTime(row.original.updatedAt),

    filterFn: filterByDateFn((user) => formatISODateTime(user.updatedAt)),
    sortingFn: dateSortingFn((user) => formatISODateTime(user.updatedAt)),

    meta: {
      visibilityDisplayName: userColumnsNames.updatedAt,
      headerClassName: "min-w-44 w-44",
      cellClassName: "min-w-44 w-44 text-muted-foreground",
    },
  },

  /* actions - column */
  {
    id: "actions",
    header: () => userColumnsNames.actions,
    cell: ({ row }) => <UserListRowAction row={row} />,

    enableSorting: false,
    enableHiding: false,

    meta: {
      headerClassName: "w-24",
      cellClassName: "w-24 pr-4 pl-2",
    },
  },
];

export { columns, defaultColumnVisibility, userColumnsNames };
