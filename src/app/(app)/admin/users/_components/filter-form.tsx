"use client";

import type { Table } from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import { use, useMemo } from "react";
import type { useForm } from "react-hook-form";

import { FILTER_FORM_ID } from "@/components/blocks/sheet-filter-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { getUsersResponse } from "@/http/users/users";
import { cn } from "@/lib/utils";
import type { UserResource } from "@/types/user";
import { formatISODate } from "@/utils/formatters/format-date";
import { columnIsVisible } from "@/utils/table/column-is-visible";
import { resolveFilters } from "@/utils/table/resolve-filters";
import type { UserFilterFormSchema } from "@/validations/users";

import { userColumnsNames } from "./columns";

interface UserListFilterFormProps {
  table: Table<UserResource>;
  form: ReturnType<typeof useForm<UserFilterFormSchema>>;
  promises: {
    usersPromise: Promise<getUsersResponse>;
  };

  onClose: () => void;
}

/**
 * Filter form — sheet content.
 *
 * The `useForm` instance arrives as a prop (created in the toolbar) because
 * this component suspends with `use()`, and state declared in a suspending
 * component gets discarded. The form id comes from `FILTER_FORM_ID` since
 * the submit button lives in the sheet footer, outside the `<form>` tree,
 * and triggers via the HTML `form` attribute. Submit never calls the API —
 * it turns form values into `ColumnFiltersState` and applies them to the
 * already-loaded table data. Hidden columns get their filter disabled.
 *
 * @param props Table instance, form instance, data promises, close callback.
 */
export function UserListFilterForm({
  table,
  form,
  promises,
  onClose,
}: UserListFilterFormProps) {
  const usersResponse = use(promises.usersPromise);
  const totalUsers = useMemo(() => {
    return usersResponse.status === 200 ? usersResponse.data.length : 0;
  }, [usersResponse]);

  const columnVisibility = {
    createdAt: columnIsVisible({ table, columnId: "createdAt" }),
    updatedAt: columnIsVisible({ table, columnId: "updatedAt" }),
  };

  /**
   * Applies the filters to the table and closes the sheet.
   *
   * ⚠️ `setColumnFilters` replaces the whole state, including the toolbar
   * search filter — it survives because search targets `email`, which is
   * also a schema key.
   */
  function onSubmitForm(data: UserFilterFormSchema) {
    const filters = resolveFilters(data);

    table.setColumnFilters(filters);
    table.setPageIndex(0);

    onClose();
  }

  return (
    <Form {...form}>
      <form
        id={FILTER_FORM_ID}
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="w-full space-y-4 py-4"
      >
        <p className="text-muted-foreground text-xs">
          {totalUsers} usuário(s) carregado(s).
        </p>

        {/* userName - field */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userColumnsNames.userName}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex.: arthur"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* email - field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userColumnsNames.email}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex.: arthur@exemplo.com"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* createdAt - field */}
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userColumnsNames.createdAt}</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DateField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!columnVisibility.createdAt}
                    />
                  </div>
                </TooltipTrigger>

                {!columnVisibility.createdAt && (
                  <TooltipContent>
                    <p>
                      Habilite a coluna "{userColumnsNames.createdAt}" para
                      filtrar
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </FormItem>
          )}
        />

        {/* updatedAt - field */}
        <FormField
          control={form.control}
          name="updatedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userColumnsNames.updatedAt}</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DateField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!columnVisibility.updatedAt}
                    />
                  </div>
                </TooltipTrigger>

                {!columnVisibility.updatedAt && (
                  <TooltipContent>
                    <p>
                      Habilite a coluna "{userColumnsNames.updatedAt}" para
                      filtrar
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

interface DateFieldProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
}

/**
 * Filter date field: button with the formatted date opening a calendar.
 * Local to this file until a second screen needs it.
 *
 * @param props Selected date, change handler, disabled flag.
 */
function DateField({ value, onChange, disabled }: DateFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? formatISODate(value.toISOString()) : "Selecione uma data"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
