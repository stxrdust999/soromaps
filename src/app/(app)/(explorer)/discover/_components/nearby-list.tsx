import { NavigationIcon } from "lucide-react";

import { PlaceRow } from "@/components/blocks/place-row";
import { formatDistance } from "@/utils/formatters/format-distance";

import type { DiscoverPlace } from "./use-discover";

interface NearbyListProps {
  places: DiscoverPlace[];
}

/**
 * Os mais próximos, em lista.
 *
 * Era trilha de cards e virou lista: proximidade é para **comparar** — cinco
 * distâncias alinhadas na mesma coluna se leem de um golpe, o que carrossel de
 * foto não entrega.
 */
export function NearbyList({ places }: NearbyListProps) {
  if (places.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <NavigationIcon className="size-4 text-blue-500" />
        <h2 className="font-semibold text-sm">Perto de você</h2>
      </div>

      <div className="flex flex-col gap-2">
        {places.map(({ marker, details }) => (
          <PlaceRow
            key={marker.id}
            marker={marker}
            trailing={
              <span className="font-medium text-muted-foreground tabular-nums">
                {formatDistance(details.distancia)}
              </span>
            }
          />
        ))}
      </div>
    </section>
  );
}
