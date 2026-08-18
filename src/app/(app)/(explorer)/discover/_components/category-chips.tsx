"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PET_FRIENDLY_FILTER, PLACE_CATEGORIES } from "@/constants/places";
import { cn } from "@/lib/utils";

export const ALL_FILTER = "Todos";

interface CategoryChipsProps {
  active: string;
  onChange: (filter: string) => void;
  /** Locais por categoria — a contagem que os antigos tiles mostravam. */
  counts: Record<string, number>;
  total: number;
}

/**
 * Filtro por categoria.
 *
 * Carrega a contagem porque os tiles "Explorar por tipo" saíram: eram uma
 * terceira forma de escolher categoria na mesma tela, ao lado destes chips e
 * da busca, e o único dado que só eles mostravam era o número.
 */
export function CategoryChips({
  active,
  onChange,
  counts,
  total,
}: CategoryChipsProps) {
  const filters = [
    { label: ALL_FILTER, count: total },
    ...PLACE_CATEGORIES.map((category) => ({
      label: category.label,
      count: counts[category.label] ?? 0,
    })),
    { label: PET_FRIENDLY_FILTER, count: undefined },
  ];

  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {filters.map(({ label, count }) => {
        const isActive = active === label;

        return (
          <Button
            key={label}
            type="button"
            size="sm"
            disabled={count === 0}
            variant={isActive ? "default" : "outline"}
            onClick={() => onChange(label)}
            className={cn("shrink-0 rounded-full", !isActive && "border")}
          >
            {label}

            {count !== undefined && (
              <Badge
                variant={isActive ? "secondary" : "ghost"}
                className="tabular-nums"
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
