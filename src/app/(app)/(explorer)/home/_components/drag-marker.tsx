import { MapPin } from "lucide-react";

import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";

interface DraftCoords {
  lat: number;
  lng: number;
}

interface DraggableDraftMarkerProps {
  isCreating: boolean;

  /** `false` congela o pin na posição já confirmada. */
  isDraggable?: boolean;

  draftCoords: DraftCoords;
  setDraftCoords: (coords: DraftCoords) => void;
}

export default function DraggableDraftMarker({
  isCreating,
  isDraggable = true,
  draftCoords,
  setDraftCoords,
}: DraggableDraftMarkerProps) {
  if (!isCreating) return null;

  return (
    <MapMarker
      draggable={isDraggable}
      longitude={draftCoords.lng}
      latitude={draftCoords.lat}
      onDrag={(lngLat) => {
        setDraftCoords({ lng: lngLat.lng, lat: lngLat.lat });
      }}
    >
      <MarkerContent>
        <div className={isDraggable ? "cursor-move animate-bounce" : undefined}>
          <MapPin className="fill-primary stroke-white" size={36} />
        </div>
      </MarkerContent>

      {isDraggable && (
        <MarkerPopup>
          <div className="w-32 space-y-1 p-2">
            <p className="text-center font-bold text-sm">Arraste-me!</p>
            <p className="text-center text-muted-foreground text-xs tabular-nums">
              {draftCoords.lat.toFixed(4)}, {draftCoords.lng.toFixed(4)}
            </p>
          </div>
        </MarkerPopup>
      )}
    </MapMarker>
  );
}
