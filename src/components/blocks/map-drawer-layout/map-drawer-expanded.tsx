"use client";

import type { ReactNode } from "react";

import { useMapDrawerLayout } from "./map-drawer-layout-context";

/** Renderiza os filhos apenas quando o painel está no último snap point. */
export function MapDrawerExpanded({ children }: { children: ReactNode }) {
  const { isExpanded } = useMapDrawerLayout();

  return isExpanded ? children : null;
}
