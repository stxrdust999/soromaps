import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { MapPin } from "lucide-react";

interface DraftCoords {
  lat: number;
  lng: number;
}

interface DraggableDraftMarkerProps {
  isCreating: boolean;
  draftCoords: DraftCoords;
  setDraftCoords: (coords: DraftCoords) => void;
}

export default function DraggableDraftMarker({
  isCreating,
  draftCoords,
  setDraftCoords,
}: DraggableDraftMarkerProps) {
  if (!isCreating) return null;

  return (
    <MapMarker
      draggable
      longitude={draftCoords.lng}
      latitude={draftCoords.lat}
      onDrag={(lngLat) => {
        setDraftCoords({ lng: lngLat.lng, lat: lngLat.lat });
      }}
    >
      <MarkerContent>
        <div className="cursor-move animate-bounce">
          <MapPin className="fill-primary stroke-white" size={36} />
        </div>
      </MarkerContent>
      <MarkerPopup>
        <div className="space-y-1 p-2 w-32">
          <p className="text-sm font-bold text-center">Arraste-me!</p>
          <p className="text-xs text-muted-foreground text-center tabular-nums">
            {draftCoords.lat.toFixed(4)}, {draftCoords.lng.toFixed(4)}
          </p>
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}
