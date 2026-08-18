import { StarIcon, TrophyIcon } from "lucide-react";

import { PlaceRow } from "@/components/blocks/place-row";

import type { DiscoverPlace } from "./use-discover";

interface TopRatedListProps {
  places: DiscoverPlace[];
}

/**
 * Pódio por nota. Lista numerada em vez de trilha de cards porque a posição
 * é a informação — em carrossel, o 4º lugar sai da tela e a ordem se perde.
 */
export function TopRatedList({ places }: TopRatedListProps) {
  if (places.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <TrophyIcon className="size-4 text-amber-500" />
        <h2 className="font-semibold text-sm">Nota máxima da galera</h2>
      </div>

      <div className="flex flex-col gap-2">
        {places.map(({ marker, details }, index) => (
          <PlaceRow
            key={marker.id}
            marker={marker}
            position={index + 1}
            trailing={
              <span className="flex items-center gap-1 font-semibold">
                <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
                {details.nota}
              </span>
            }
          />
        ))}
      </div>
    </section>
  );
}
