import { NavigationIcon } from "lucide-react";

import { PlaceCard } from "@/components/blocks/place-card";
import { PlaceRail } from "@/components/blocks/place-rail";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

const NEARBY_LIMIT = 6;

interface FeedNearbySectionProps {
  markers: MarkerResource[];
}

/**
 * Locais mais próximos. É a seção que só a home justifica: fora do mapa,
 * proximidade perde o contexto que a torna útil.
 *
 * A distância ainda é fictícia (`getMarkerDetailsMock`) — vira cálculo real
 * quando houver a posição do usuário.
 */
export function FeedNearbySection({ markers }: FeedNearbySectionProps) {
  const nearby = [...markers]
    .sort(
      (a, b) =>
        getMarkerDetailsMock(a.id).distancia -
        getMarkerDetailsMock(b.id).distancia,
    )
    .slice(0, NEARBY_LIMIT);

  if (nearby.length === 0) return null;

  return (
    <PlaceRail
      title="Perto de você"
      icon={<NavigationIcon className="size-4 text-blue-500" />}
    >
      {nearby.map((marker) => (
        <PlaceCard key={marker.id} marker={marker} />
      ))}
    </PlaceRail>
  );
}
