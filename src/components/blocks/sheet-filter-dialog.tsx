"use client";

import { ListFilterPlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Ties the "Aplicar filtros" button to the content `<form>`. The button sits
 * in the sheet footer, outside the form tree, and submits through the HTML
 * `form` attribute — renaming this id on one side only breaks the click
 * silently, with no error.
 */
const FILTER_FORM_ID = "form:submit";

interface SheetFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  children: ReactNode;

  title?: string;
  description?: string;
  triggerLabel?: string;
}

/**
 * Toolbar filter sheet: trigger, side panel, header and footer with
 * "Cancelar" / "Aplicar filtros". The screen supplies only `open`,
 * `onOpenChange` and the filter form as children.
 *
 * @param props Open state, change handler, form content and labels.
 */
export function SheetFilterDialog({
  open,
  onOpenChange,
  children,
  title = "Filtros",
  description = "Refine a listagem pelos campos abaixo.",
  triggerLabel = "Filtros",
}: SheetFilterDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 border py-4.25"
        >
          <ListFilterPlusIcon className="size-4" />
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">{children}</div>

        <SheetFooter className="flex-row justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button type="submit" form={FILTER_FORM_ID}>
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { FILTER_FORM_ID };
