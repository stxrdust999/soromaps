"use client";

import { useMarkers } from "@/hooks/use-markers";

import LocationMarker from "./marker";

export function HomeMapLayers() {
  const { markers } = useMarkers();

  return markers.map((marker) => (
    <LocationMarker key={marker.id} marker={marker} />
  ));
}
