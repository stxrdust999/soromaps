"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FilterResetButtonProps {
  action: () => void;

  label?: string;
}

/**
 * "Clear filters" button, rendered by the toolbar only when there is
 * something to clear. The action comes from outside because it resets three
 * things at once: column filters, sorting and the sheet form values.
 *
 * @param props Reset callback and optional label.
 */
export function FilterResetButton({
  action,
  label = "Limpar filtros",
}: FilterResetButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={action}
      className="flex flex-row gap-2 border py-4.25"
    >
      {label}
      <XIcon className="size-4" />
    </Button>
  );
}
