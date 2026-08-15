"use client";

import type { Table } from "@tanstack/react-table";
import { ClockIcon, MailIcon, UserSearchIcon } from "lucide-react";
import { useCallback } from "react";

import { ColumnVisibilityFilter } from "@/components/table/column-visibility-filter";
import { DateFilterChip, TextFilterChip } from "@/components/table/filter-chip";
import { FilterChipsScrollArea } from "@/components/table/filter-chips-scroll-area";
import { FilterResetButton } from "@/components/table/filter-reset-button";
import type { UserResource } from "@/types/user";
import { columnIsVisible } from "@/utils/table/column-is-visible";
import { hasActiveFilters } from "@/utils/table/has-active-filters";

import { userColumnsNames } from "./columns";

interface UserListTableToolbarProps {
  table: Table<UserResource>;
}

/**
 * Table toolbar: one filter chip per filterable column (text inline, date
 * via calendar popover), reset button and column visibility. Each chip
 * binds straight to its column filter — no form, no sheet: expanding
 * reveals the control, collapsing clears that column's filter.
 *
 * A `SelectFilterChip` for "Tipo" joins the row once the user type field
 * exists (role/permission backlog item).
 *
 * @param props Table instance.
 */
export function UserListTableToolbar({ table }: UserListTableToolbarProps) {
  const userNameColumn = table.getColumn("userName");
  const emailColumn = table.getColumn("email");
  const createdAtColumn = table.getColumn("createdAt");
  const updatedAtColumn = table.getColumn("updatedAt");

  const activeFilters = hasActiveFilters({ table });

  const clearTableFilters = useCallback(() => {
    table.resetColumnFilters();
    table.resetSorting();
  }, [table]);

  return (
    <div className="flex items-start justify-between gap-3">
      <FilterChipsScrollArea>
        {userNameColumn && (
          <TextFilterChip
            table={table}
            column={userNameColumn}
            icon={<UserSearchIcon className="size-4" />}
            label="Nome de usuário"
          />
        )}

        {emailColumn && (
          <TextFilterChip
            table={table}
            column={emailColumn}
            icon={<MailIcon className="size-4" />}
            label={userColumnsNames.email}
          />
        )}

        {createdAtColumn && (
          <DateFilterChip
            table={table}
            column={createdAtColumn}
            icon={<ClockIcon className="size-4" />}
            label={userColumnsNames.createdAt}
            disabled={!columnIsVisible({ table, columnId: "createdAt" })}
            disabledHint={`Habilite a coluna "${userColumnsNames.createdAt}" para filtrar`}
          />
        )}

        {updatedAtColumn && (
          <DateFilterChip
            table={table}
            column={updatedAtColumn}
            icon={<ClockIcon className="size-4" />}
            label={userColumnsNames.updatedAt}
            disabled={!columnIsVisible({ table, columnId: "updatedAt" })}
            disabledHint={`Habilite a coluna "${userColumnsNames.updatedAt}" para filtrar`}
          />
        )}
      </FilterChipsScrollArea>

      {activeFilters && <FilterResetButton action={clearTableFilters} />}

      <ColumnVisibilityFilter table={table} />
    </div>
  );
}
