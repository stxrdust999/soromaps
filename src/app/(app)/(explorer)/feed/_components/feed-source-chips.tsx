"use client";

import { LayersIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEED_REASON_ORDER, FEED_REASONS } from "@/constants/feed";
import { cn } from "@/lib/utils";

import { ALL_REASONS, type FeedFilter } from "./use-feed";

interface FeedSourceChipsProps {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
  /** Quantos itens cada fonte tem hoje — fonte vazia fica desabilitada. */
  counts: Record<string, number>;
  total: number;
}

/**
 * As fontes do feed, como chip.
 *
 * Ocupa o lugar que em rede social seria "Seguindo / Para você". Aqui a
 * escolha não é entre grafos, é entre **vínculos com a cidade** — e a contagem
 * ao lado do rótulo é o que deixa claro que nenhuma fonte está vazia por bug.
 */
export function FeedSourceChips({
  active,
  onChange,
  counts,
  total,
}: FeedSourceChipsProps) {
  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      <Button
        size="sm"
        variant={active === ALL_REASONS ? "default" : "outline"}
        onClick={() => onChange(ALL_REASONS)}
        className="rounded-full"
      >
        <LayersIcon />
        Tudo
        <Badge
          variant={active === ALL_REASONS ? "secondary" : "ghost"}
          className="tabular-nums"
        >
          {total}
        </Badge>
      </Button>

      {FEED_REASON_ORDER.map((reason) => {
        const definition = FEED_REASONS[reason];
        const Icon = definition.icon;
        const count = counts[reason] ?? 0;
        const isActive = active === reason;

        return (
          <Button
            key={reason}
            size="sm"
            variant={isActive ? "default" : "outline"}
            disabled={count === 0}
            onClick={() => onChange(reason)}
            className={cn("rounded-full", !isActive && definition.className)}
          >
            <Icon />
            {definition.label}
            <Badge
              variant={isActive ? "secondary" : "ghost"}
              className="tabular-nums"
            >
              {count}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
