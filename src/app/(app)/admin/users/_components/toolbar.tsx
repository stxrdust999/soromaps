"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Table } from "@tanstack/react-table";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { SheetFilterDialog } from "@/components/blocks/sheet-filter-dialog";
import { ColumnVisibilityFilter } from "@/components/table/column-visibility-filter";
import { FilterResetButton } from "@/components/table/filter-reset-button";
import { SearchInputFilter } from "@/components/table/search-input-filter";
import { userListFilterDefaultValues } from "@/constants/users";
import type { getUsersResponse } from "@/http/users/users";
import type { UserResource } from "@/types/user";
import { hasActiveFilters } from "@/utils/table/has-active-filters";
import {
  type UserFilterFormSchema,
  userFilterFormSchema,
} from "@/validations/users";

import { UserListFilterForm } from "./filter-form";
import { UserFilterFormSkeleton } from "./filter-form-skeleton";

interface UserListTableToolbarProps {
  table: Table<UserResource>;
  promises: {
    usersPromise: Promise<getUsersResponse>;
  };
}

/**
 * Table toolbar: search, filter sheet trigger, reset button, and column
 * visibility. Owns the filter `useForm` instance and the sheet `open` state;
 * filter fields themselves are rendered by `filter-form.tsx`.
 *
 * @param props Table instance and data promises passed down to the filter form.
 */
export function UserListTableToolbar({
  table,
  promises,
}: UserListTableToolbarProps) {
  const [open, setOpen] = useState<boolean>(false);

  function handleCloseModal() {
    setOpen(false);
  }

  const defaultValues = useMemo(() => userListFilterDefaultValues, []);
  const form = useForm<UserFilterFormSchema>({
    resolver: zodResolver(userFilterFormSchema),
    defaultValues,
  });

  const searchColumn = table.getColumn("email");

  const activeFilters = hasActiveFilters({ table });

  const clearTableFilters = useCallback(() => {
    table.resetColumnFilters();
    table.resetSorting();
    form.reset(defaultValues);
  }, [table, form, defaultValues]);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {searchColumn && (
          <SearchInputFilter
            table={table}
            column={searchColumn}
            placeholder="Pesquisar por e-mail..."
          />
        )}

        <SheetFilterDialog
          open={open}
          onOpenChange={setOpen}
          description="Refine a listagem de usuários pelos campos abaixo."
        >
          <Suspense fallback={<UserFilterFormSkeleton />}>
            <UserListFilterForm
              table={table}
              form={form}
              promises={promises}
              onClose={handleCloseModal}
            />
          </Suspense>
        </SheetFilterDialog>

        {activeFilters && <FilterResetButton action={clearTableFilters} />}
      </div>

      <ColumnVisibilityFilter table={table} />
    </div>
  );
}
