"use client";

import {
  OctagonAlertIcon,
  TreesIcon,
  TriangleAlertIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { ClaimSignal, ClaimSignalKind } from "./use-business-claims";

const SIGNAL_ICON: Record<ClaimSignalKind, typeof TriangleAlertIcon> = {
  conflito: OctagonAlertIcon,
  distancia: TriangleAlertIcon,
  dono: UserCheckIcon,
  naoComercial: TreesIcon,
  novo: UserPlusIcon,
};

const SIGNAL_VARIANT = {
  bad: "destructive",
  warn: "warning",
  neutral: "secondary",
} as const;

interface RiskSignalBadgesProps {
  signals: ClaimSignal[];
  /** Chamado ao clicar no selo de conflito — abre a comparação. */
  onConflictClick?: () => void;
}

/**
 * Selos de risco do pedido. O de conflito é clicável: é o único que leva a
 * uma decisão que não cabe na linha.
 */
export function RiskSignalBadges({
  signals,
  onConflictClick,
}: RiskSignalBadgesProps) {
  if (!signals.length) {
    return <span className="text-muted-foreground/60">—</span>;
  }

  return (
    <div className="flex flex-wrap items-start gap-1">
      {signals.map((signal) => {
        const Icon = SIGNAL_ICON[signal.kind];
        const clickable = signal.kind === "conflito" && onConflictClick;

        return (
          <Badge
            key={signal.kind}
            variant={SIGNAL_VARIANT[signal.tone]}
            asChild={Boolean(clickable)}
          >
            {clickable ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onConflictClick();
                }}
              >
                <Icon size={12} />
                <span className="text-xs font-light">{signal.label}</span>
              </button>
            ) : (
              <>
                <Icon size={12} />
                <span className="text-xs font-light">{signal.label}</span>
              </>
            )}
          </Badge>
        );
      })}
    </div>
  );
}
