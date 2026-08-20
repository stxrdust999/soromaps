"use client";

import { SparklesIcon } from "lucide-react";

import { PLACE_VIBES } from "@/constants/places";
import { cn } from "@/lib/utils";

interface VibeChipsProps {
  /** Vibe ativa, ou `null` quando nenhuma está — clicar na ativa desliga. */
  active: string | null;
  onChange: (vibe: string | null) => void;
}

export function VibeChips({ active, onChange }: VibeChipsProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <SparklesIcon className="size-4 text-violet-500" />
        <h2 className="font-semibold text-sm">Qual a vibe de hoje?</h2>
      </div>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
        {PLACE_VIBES.map((vibe) => {
          const isActive = active === vibe.label;

          return (
            <button
              key={vibe.label}
              type="button"
              onClick={() => onChange(isActive ? null : vibe.label)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 rounded-full bg-linear-to-r px-4 py-1.5 font-medium text-sm text-white transition-all",
                vibe.gradient,
                isActive
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              {vibe.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
