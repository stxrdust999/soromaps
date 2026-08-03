"use client";

import { createContext, useContext } from "react";

type SnapPoint = number | string;

type MapDrawerLayoutContextValue = {
  snap: SnapPoint | null;
  setSnap: (snap: SnapPoint | null) => void;
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
};

const MapDrawerLayoutContext =
  createContext<MapDrawerLayoutContextValue | null>(null);

function useMapDrawerLayout() {
  const context = useContext(MapDrawerLayoutContext);
  if (!context) {
    throw new Error(
      "useMapDrawerLayout must be used within a MapDrawerLayout component",
    );
  }
  return context;
}

export { MapDrawerLayoutContext, useMapDrawerLayout };
export type { MapDrawerLayoutContextValue, SnapPoint };
