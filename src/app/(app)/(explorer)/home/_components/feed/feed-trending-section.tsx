import { FlameIcon } from "lucide-react";

import { PlaceCard } from "@/components/blocks/place-card";
import { PlaceRail } from "@/components/blocks/place-rail";
import { Badge } from "@/components/ui/badge";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

const TRENDING_LIMIT = 4;

interface FeedTrendingSectionProps {
  markers: MarkerResource[];
}

/**
 * Prévia dos locais em alta — a lista completa, com as outras trilhas, é
 * `/discover`. Aqui cabe só o suficiente para tirar quem está no mapa da
 * inércia.
 */
export function FeedTrendingSection({ markers }: FeedTrendingSectionProps) {
  const trending = [...markers]
    .sort(
      (a, b) =>
        getMarkerDetailsMock(b.id).nota - getMarkerDetailsMock(a.id).nota,
    )
    .slice(0, TRENDING_LIMIT);

  if (trending.length === 0) return null;

  return (
    <PlaceRail
      title="Em alta"
      icon={<FlameIcon className="size-4 text-orange-500" />}
      seeAllHref="/discover"
    >
      {trending.map((marker) => (
        <PlaceCard
          key={marker.id}
          marker={marker}
          badge={
            <Badge className="bg-orange-500 text-white">
              <FlameIcon className="size-3" />
              Em alta
            </Badge>
          }
        />
      ))}
    </PlaceRail>
  );
}
