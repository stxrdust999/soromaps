import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

interface PlaceRowProps {
  /** Só id e nome, como em `PlaceCard`; o resto vem do mock de detalhes. */
  marker: Pick<MarkerResource, "id" | "nome">;
  /** Número à direita — distância, nota, contagem. Cabe uma informação só. */
  trailing?: ReactNode;
  /** Posição, quando a linha faz parte de um ranking. */
  position?: number;
  className?: string;
}

/**
 * Linha compacta de local: miniatura, nome e uma informação à direita.
 *
 * É a forma para lista **densa** — onde o usuário compara vários de relance e
 * a foto é só reconhecimento visual, não convite. Card com foto grande na
 * mesma tela disputaria atenção com a seção que deve ser lida primeiro.
 */
export function PlaceRow({
  marker,
  trailing,
  position,
  className,
}: PlaceRowProps) {
  const details = getMarkerDetailsMock(marker.id);

  return (
    <Link
      href={`/places/${marker.id}`}
      className={cn(
        "card-interactive flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-3",
        className,
      )}
    >
      {position !== undefined && (
        <span className="w-5 shrink-0 text-center font-bold text-lg text-muted-foreground/50">
          {position}
        </span>
      )}

      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={details.fotoUrl}
          alt={`Foto de ${marker.nome}`}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold text-sm">{marker.nome}</span>
        <span className="truncate text-muted-foreground text-xs">
          {details.categoria} · {details.bairro}
        </span>
      </div>

      {trailing && (
        <span className="ml-auto shrink-0 pl-2 text-sm">{trailing}</span>
      )}
    </Link>
  );
}
