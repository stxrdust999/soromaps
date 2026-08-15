import { SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

interface RecentlyAddedRailProps {
  markers: MarkerResource[];
}

/**
 * Últimos locais cadastrados. Deliberadamente menor que os cards das outras
 * trilhas: é novidade, não recomendação — ninguém escolheu esses lugares.
 */
export function RecentlyAddedRail({ markers }: RecentlyAddedRailProps) {
  if (markers.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <SparklesIcon className="size-4 text-blue-500" />
        <h2 className="font-semibold text-sm">Recém-adicionados</h2>
      </div>

      <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {markers.map((marker) => {
          const details = getMarkerDetailsMock(marker.id);

          return (
            <Link
              key={marker.id}
              href={`/places/${marker.id}`}
              className="card-interactive flex flex-none items-center gap-3 rounded-xl border border-border bg-card p-2 pr-4"
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={details.fotoUrl}
                  alt={`Foto de ${marker.nome}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{marker.nome}</span>
                  <Badge variant="secondary">novo</Badge>
                </div>

                <span className="text-muted-foreground text-xs">
                  {details.categoria}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
