"use client";

import { BookImageIcon, MapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useMapDrawerLayout } from "./map-drawer-layout-context";

type MapDrawerViewToggleProps = {
  className?: string;
  expandLabel?: string;
  collapseLabel?: string;
};

/** Alterna o painel entre o primeiro e o último snap point. */
export function MapDrawerViewToggle({
  className,
  expandLabel = "Ver Feed",
  collapseLabel = "Ver Mapa",
}: MapDrawerViewToggleProps) {
  const { isExpanded, expand, collapse } = useMapDrawerLayout();

  const Icon = isExpanded ? MapIcon : BookImageIcon;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isExpanded ? collapse : expand}
      className={cn(
        "gap-2 text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <Icon size={14} />
      {isExpanded ? collapseLabel : expandLabel}
    </Button>
  );
}
