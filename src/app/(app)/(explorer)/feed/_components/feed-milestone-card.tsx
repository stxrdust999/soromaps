"use client";

import { MedalIcon } from "lucide-react";
import Link from "next/link";

import type { FeedMilestoneItem } from "@/mocks/feed";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

import { FeedPlaceLink, FeedSaveButton } from "./feed-actions";
import { FeedCardFrame, type FeedCardHandlers } from "./feed-card-frame";
import { FeedEventIcon } from "./feed-event-icon";
import type { FeedMute } from "./use-feed";

interface FeedMilestoneCardProps {
  item: FeedMilestoneItem;
  mutes: FeedMute[];
  handlers: FeedCardHandlers;
}

/**
 * Marco de um lugar — cem avaliações, liderança de bairro, recorde de manhã.
 *
 * O sujeito aqui é o ponto, não uma pessoa, e é o tipo de item que só um
 * produto de mapa tem: nenhuma rede social consegue dizer "este lugar virou o
 * mais bem avaliado do seu bairro". É a resposta mais direta ao feed sem
 * grafo — conteúdo que nasce do acúmulo, não de quem você segue.
 */
export function FeedMilestoneCard({
  item,
  mutes,
  handlers,
}: FeedMilestoneCardProps) {
  return (
    <FeedCardFrame
      leading={
        <FeedEventIcon
          icon={MedalIcon}
          className="bg-amber-500/15 text-amber-600 dark:text-amber-400"
        />
      }
      reason={item.motivo}
      reasonDetail={item.motivoDetalhe}
      mutes={mutes}
      onMute={handlers.onMute}
      title={
        <span>
          <Link
            href={`/places/${item.local.id}`}
            className="font-semibold hover:underline"
          >
            {item.local.nome}
          </Link>{" "}
          <span className="text-muted-foreground">· {item.titulo}</span>
        </span>
      }
      meta={`${item.local.categoria} · ${item.local.bairro} · ${formatWaitingDays(item.diasAtras)}`}
      footer={
        <>
          <FeedSaveButton
            saved={handlers.isSaved(item.local.id)}
            onToggle={() => handlers.onSave(item.local.id)}
          />
          <FeedPlaceLink placeId={item.local.id} />
        </>
      }
    >
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {item.detalhe}
      </p>
    </FeedCardFrame>
  );
}
