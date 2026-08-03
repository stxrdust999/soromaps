"use client";

import { useMarkers } from "@/hooks/use-markers";

import LocationMarker from "./marker";

export function HomeMapLayers() {
  const { markers, updateMarker, removeMarker } = useMarkers();

  return markers.map((marker) => (
    <LocationMarker
      key={marker.id}
      marker={marker}
      onUpdate={updateMarker}
      onDelete={removeMarker}
    />
  ));
}
