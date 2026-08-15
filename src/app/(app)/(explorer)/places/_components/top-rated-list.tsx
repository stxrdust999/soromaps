import { StarIcon, TrophyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

interface TopRatedListProps {
  markers: MarkerResource[];
}

/**
 * Pódio por nota. Lista numerada em vez de trilha de cards porque a posição
 * é a informação — em carrossel, o 4º lugar sai da tela e a ordem se perde.
 */
export function TopRatedList({ markers }: TopRatedListProps) {
  if (markers.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <TrophyIcon className="size-4 text-amber-500" />
        <h2 className="font-semibold text-sm">Nota máxima da galera</h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {markers.map((marker, index) => {
          const details = getMarkerDetailsMock(marker.id);

          return (
            <Link
              key={marker.id}
              href={`/places/${marker.id}`}
              className="card-interactive flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-5 shrink-0 text-center font-bold text-lg text-muted-foreground/50">
                {index + 1}
              </span>

              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={details.fotoUrl}
                  alt={`Foto de ${marker.nome}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold text-sm">
                  {marker.nome}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {details.categoria} · {details.bairro}
                </span>
              </div>

              <span className="ml-auto flex shrink-0 items-center gap-1 font-semibold text-sm">
                <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
                {details.nota}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
