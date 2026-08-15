"use client";

import { PLACE_CATEGORIES } from "@/constants/places";
import { cn } from "@/lib/utils";

interface CategoryTilesProps {
  onSelect: (category: string) => void;
  /** Quantos locais existem por categoria — a chave é o rótulo da categoria. */
  counts: Record<string, number>;
}

/** Atalhos por tipo: filtram a própria página, sem sair dela. */
export function CategoryTiles({ onSelect, counts }: CategoryTilesProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold text-sm">Explorar por tipo</h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PLACE_CATEGORIES.map((category) => (
          <button
            key={category.label}
            type="button"
            onClick={() => onSelect(category.label)}
            className={cn(
              "card-interactive flex h-16 flex-col justify-center rounded-xl border border-transparent bg-linear-to-br px-4 text-left text-white hover:scale-[1.02]",
              category.gradient,
            )}
          >
            <span className="font-semibold text-sm">{category.label}</span>
            <span className="text-white/80 text-xs">
              {counts[category.label] ?? 0}{" "}
              {counts[category.label] === 1 ? "lugar" : "lugares"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
