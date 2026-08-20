"use client";

import { GitForkIcon, OctagonAlertIcon, TriangleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { ReportSignal, ReportSignalKind } from "./use-reports";

const SIGNAL_ICON: Record<ReportSignalKind, typeof TriangleAlertIcon> = {
  coordenada: OctagonAlertIcon,
  reincidente: TriangleAlertIcon,
  divergente: GitForkIcon,
};

const SIGNAL_VARIANT = {
  bad: "destructive",
  warn: "warning",
  neutral: "secondary",
} as const;

interface ReportSignalBadgesProps {
  signals: ReportSignal[];
}

/** Selos de risco do caso, em ordem de gravidade. */
export function ReportSignalBadges({ signals }: ReportSignalBadgesProps) {
  if (!signals.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {signals.map((signal) => {
        const Icon = SIGNAL_ICON[signal.kind];

        return (
          <Badge key={signal.kind} variant={SIGNAL_VARIANT[signal.tone]}>
            <Icon size={12} />
            <span className="text-xs font-light">{signal.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
