"use client";

import type { Table } from "@tanstack/react-table";
import { ClockIcon, MailIcon, UserSearchIcon } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ColumnVisibilityFilter } from "@/components/table/column-visibility-filter";
import { DateFilterChip, TextFilterChip } from "@/components/table/filter-chip";
import { FilterResetButton } from "@/components/table/filter-reset-button";
import { cn } from "@/lib/utils";
import type { UserResource } from "@/types/user";
import { columnIsVisible } from "@/utils/table/column-is-visible";
import { hasActiveFilters } from "@/utils/table/has-active-filters";

import { userColumnsNames } from "./columns";

interface UserListTableToolbarProps {
  table: Table<UserResource>;
}

/**
 * Single-line scroll rail for the filter chips: no wrapping — overflow
 * scrolls horizontally. The scrollbar track is always reserved (thumb
 * transparent, painted on hover), so nothing shifts; side fades appear
 * only while there is content hidden on that side. Scroll position is
 * re-checked on scroll and on resize of rail/row — the chips' expand
 * animation changes the row width without scrolling. Local to this screen
 * until a second listing needs it.
 *
 * @param props Chips row.
 */
function FilterChipsScrollArea({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const updateFades = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    setCanScrollLeft(rail.scrollLeft > 0);
    setCanScrollRight(
      rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const row = rowRef.current;
    if (!rail || !row) return;

    updateFades();

    const observer = new ResizeObserver(updateFades);
    observer.observe(rail);
    observer.observe(row);

    return () => observer.disconnect();
  }, [updateFades]);

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={railRef}
        onScroll={updateFades}
        className="overflow-x-auto pb-1 [scrollbar-color:transparent_transparent] [scrollbar-width:thin] hover:[scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&:hover::-webkit-scrollbar-thumb]:bg-border"
      >
        <div ref={rowRef} className="flex w-max items-center gap-3">
          {children}
        </div>
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-background to-transparent transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
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
