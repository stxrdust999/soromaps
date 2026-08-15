import { NavigationIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { placeTagColor } from "@/constants/places";
import { cn } from "@/lib/utils";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

interface PlaceCardProps {
  marker: MarkerResource;
  /** `sm` mostra só categoria e distância; `md` abre bairro e avaliações. */
  size?: "sm" | "md";
  showTags?: boolean;
  /** Selo sobreposto à foto, no canto superior esquerdo — ex.: "Em alta". */
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Card de local das trilhas de descoberta. Identifica e leva ao detalhe: o que
 * aprofunda (descrição, galeria, ranking) mora em `/places/[id]`.
 */
export function PlaceCard({
  marker,
  size = "md",
  showTags = false,
  badge,
  className,
}: PlaceCardProps) {
  const details = getMarkerDetailsMock(marker.id);
  const isSmall = size === "sm";

  return (
    <Link
      href={`/places/${marker.id}`}
      className={cn(
        "card-interactive flex flex-none flex-col overflow-hidden rounded-2xl border border-border bg-card",
        isSmall ? "w-44" : "w-60",
        className,
      )}
    >
      <div
        className={cn("relative w-full bg-muted", isSmall ? "h-28" : "h-40")}
      >
        <Image
          src={details.fotoUrl}
          alt={`Foto de ${marker.nome}`}
          fill
          sizes={isSmall ? "176px" : "240px"}
          className="object-cover"
        />

        {badge && <div className="absolute top-2 left-2">{badge}</div>}

        <Badge className="absolute right-2 bottom-2 bg-black/75 text-white">
          <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
          {details.nota}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <span className="truncate font-semibold text-sm">{marker.nome}</span>

        <span className="truncate text-muted-foreground text-xs">
          {isSmall
            ? `${details.categoria} · ${details.distancia}km`
            : `${details.categoria} · ${details.bairro}`}
        </span>

        {showTags && details.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {details.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                className={cn(
                  "font-semibold text-[10px] uppercase tracking-wide",
                  placeTagColor(tag),
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {!isSmall && (
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
            <NavigationIcon className="size-3 shrink-0 text-blue-500" />
            {details.distancia}km
            <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
            {details.totalAvaliacoes} avaliações
          </div>
        )}
      </div>
    </Link>
  );
}
