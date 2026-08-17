"use client";

import Link from "next/link";

import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Button } from "@/components/ui/button";
import { type FeedAchievementItem, feedItemDate } from "@/mocks/feed";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

import { FeedPlaceLink } from "./feed-actions";
import { FeedAuthorAvatar, FeedAuthorName } from "./feed-author";
import { FeedCardFrame, type FeedCardHandlers } from "./feed-card-frame";
import type { FeedMute } from "./use-feed";

interface FeedAchievementCardProps {
  item: FeedAchievementItem;
  mutes: FeedMute[];
  handlers: FeedCardHandlers;
}

/**
 * Conquista de outro explorador.
 *
 * Mostra o **critério** junto do badge de propósito: sem ele o card é vaidade
 * alheia; com ele é uma sugestão do que dá para fazer na cidade — que é o
 * único motivo de conquista de estranho valer espaço num feed sem grafo.
 */
export function FeedAchievementCard({
  item,
  mutes,
  handlers,
}: FeedAchievementCardProps) {
  const { conquista, local } = item;

  return (
    <FeedCardFrame
      leading={<FeedAuthorAvatar author={item.autor} />}
      reason={item.motivo}
      reasonDetail={item.motivoDetalhe}
      mutes={mutes}
      onMute={handlers.onMute}
      title={
        <FeedAuthorName
          author={item.autor}
          action={
            <span className="text-muted-foreground">
              desbloqueou uma conquista
            </span>
          }
        />
      }
      meta={
        local
          ? `Fechou em ${local.nome} · ${local.bairro} · ${formatWaitingDays(item.diasAtras)}`
          : formatWaitingDays(item.diasAtras)
      }
      footer={
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/achievements">Ver minhas conquistas</Link>
          </Button>

          {local && <FeedPlaceLink placeId={local.id} />}
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-3">
        <AchievementBadge
          layout="icon"
          badgeSize="default"
          achievement={{
            id: item.id,
            name: conquista.nome,
            trigger: "metric",
            icon: conquista.icon,
            color: conquista.cor,
            achievedAt: feedItemDate(item.diasAtras),
          }}
        />

        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm">{conquista.nome}</span>
          <span className="text-muted-foreground text-xs">
            {conquista.criterio}
          </span>
        </div>
      </div>
    </FeedCardFrame>
  );
}
