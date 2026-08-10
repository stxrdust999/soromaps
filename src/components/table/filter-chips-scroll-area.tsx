"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface FilterChipsScrollAreaProps {
  children: ReactNode;
}

/**
 * Single-line scroll rail for the filter chips: no wrapping — overflow
 * scrolls horizontally. The scrollbar track is always reserved (thumb
 * transparent, painted on hover), so nothing shifts; side fades appear only
 * while there is content hidden on that side. Scroll position is re-checked
 * on scroll and on resize of rail/row — the chips' expand animation changes
 * the row width without scrolling.
 *
 * @param props Chips row.
 */
export function FilterChipsScrollArea({
  children,
}: FilterChipsScrollAreaProps) {
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
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-background to-transparent transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
