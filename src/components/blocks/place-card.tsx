import { NavigationIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { placeTagColor } from "@/constants/places";
import { cn } from "@/lib/utils";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

/**
 * Três formas, três trabalhos — e nenhuma outra.
 *
 * `sm` é o cartão de trilha, onde cabe pouco; `md` é o padrão, com bairro e
 * avaliações; `featured` ocupa a coluna inteira de um grid, com foto larga,
 * para a seção que a página quer que seja lida primeiro. Tamanho aqui é
 * hierarquia — se um card novo não muda o peso da seção, ele é `md`.
 */
type PlaceCardSize = "sm" | "md" | "featured";

interface PlaceCardProps {
  /**
   * Só id e nome: o resto do card vem de `getMarkerDetailsMock`. Aceitar o
   * recorte deixa telas sobre mock, que não têm coordenada, reusarem o card
   * sem inventar `lat`/`lng`.
   */
  marker: Pick<MarkerResource, "id" | "nome">;
  size?: PlaceCardSize;
  showTags?: boolean;
  /** Selo sobreposto à foto, no canto superior esquerdo — ex.: "Em alta". */
  badge?: React.ReactNode;
  className?: string;
}

const FRAME: Record<PlaceCardSize, string> = {
  sm: "w-44 flex-none",
  md: "w-60 flex-none",
  featured: "w-full",
};

const PHOTO: Record<PlaceCardSize, string> = {
  sm: "h-28",
  md: "h-40",
  featured: "h-52",
};

const SIZES: Record<PlaceCardSize, string> = {
  sm: "176px",
  md: "240px",
  featured: "(min-width: 1024px) 360px, 100vw",
};

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
  const isFeatured = size === "featured";

  return (
    <Link
      href={`/places/${marker.id}`}
      className={cn(
        "card-interactive group flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
        FRAME[size],
        className,
      )}
    >
      <div
        className={cn("relative w-full overflow-hidden bg-muted", PHOTO[size])}
      >
        <Image
          src={details.fotoUrl}
          alt={`Foto de ${marker.nome}`}
          fill
          sizes={SIZES[size]}
          className={cn(
            "object-cover",
            isFeatured &&
              "transition-transform duration-500 group-hover:scale-105",
          )}
        />

        {badge && <div className="absolute top-2 left-2">{badge}</div>}

        <Badge className="absolute right-2 bottom-2 bg-black/75 text-white">
          <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
          {details.nota}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <span
          className={cn(
            "truncate font-semibold",
            isFeatured ? "text-base" : "text-sm",
          )}
        >
          {marker.nome}
        </span>

        <span className="truncate text-muted-foreground text-xs">
          {isSmall
            ? `${details.categoria} · ${details.distancia}km`
            : `${details.categoria} · ${details.bairro}`}
        </span>

        {isFeatured && (
          <p className="mt-1 line-clamp-2 text-pretty text-muted-foreground text-xs leading-relaxed">
            {details.sobre}
          </p>
        )}

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
