"use client";

import { NewspaperIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { FeedCurationItem } from "@/mocks/feed";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

import { FeedCardFrame, type FeedCardHandlers } from "./feed-card-frame";
import { FeedEventIcon } from "./feed-event-icon";
import type { FeedMute } from "./use-feed";

interface FeedCurationCardProps {
  item: FeedCurationItem;
  mutes: FeedMute[];
  handlers: FeedCardHandlers;
}

/**
 * Roteiro montado pela equipe.
 *
 * É a fonte que não depende de ninguém ter feito nada: em cidade pequena e
 * base nova, há dias em que a atividade real não enche uma tela. A pauta
 * garante que o feed nunca abra vazio — e é o lugar onde o produto tem voz
 * própria, em vez de só espelhar o banco.
 */
export function FeedCurationCard({
  item,
  mutes,
  handlers,
}: FeedCurationCardProps) {
  return (
    <FeedCardFrame
      leading={
        <FeedEventIcon
          icon={NewspaperIcon}
          className="bg-teal-500/15 text-teal-600 dark:text-teal-400"
        />
      }
      reason={item.motivo}
      reasonDetail={item.motivoDetalhe}
      mutes={mutes}
      onMute={handlers.onMute}
      title={<span className="font-semibold text-base">{item.titulo}</span>}
      meta={`Por ${item.editor} · ${item.locais.length} lugares · ${formatWaitingDays(item.diasAtras)}`}
      footer={
        <div className="flex flex-wrap gap-1.5">
          {item.locais.map((local) => (
            <Badge key={local.id} variant="outline" asChild>
              <Link href={`/places/${local.id}`}>
                {local.nome}
                <span className="text-muted-foreground">· {local.bairro}</span>
              </Link>
            </Badge>
          ))}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={item.fotoUrl}
            alt={item.titulo}
            fill
            sizes="(min-width: 1280px) 640px, 100vw"
            className="object-cover"
          />
        </div>

        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {item.chamada}
        </p>
      </div>
    </FeedCardFrame>
  );
}
