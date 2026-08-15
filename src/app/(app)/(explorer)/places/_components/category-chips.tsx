"use client";

import { Button } from "@/components/ui/button";
import { PET_FRIENDLY_FILTER, PLACE_CATEGORIES } from "@/constants/places";
import { cn } from "@/lib/utils";

export const ALL_FILTER = "Todos";

interface CategoryChipsProps {
  active: string;
  onChange: (filter: string) => void;
}

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  const filters = [
    ALL_FILTER,
    ...PLACE_CATEGORIES.map((category) => category.label),
    PET_FRIENDLY_FILTER,
  ];

  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {filters.map((filter) => (
        <Button
          key={filter}
          type="button"
          size="sm"
          variant={active === filter ? "default" : "outline"}
          onClick={() => onChange(filter)}
          className={cn("shrink-0 rounded-full", active !== filter && "border")}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
