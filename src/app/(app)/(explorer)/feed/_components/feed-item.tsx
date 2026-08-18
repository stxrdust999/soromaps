"use client";

import { FEED_KIND_LABEL, type FeedItemMock } from "@/mocks/feed";

import { FeedAchievementCard } from "./feed-achievement-card";
import { FeedBurstCard } from "./feed-burst-card";
import type { FeedCardHandlers } from "./feed-card-frame";
import { FeedCurationCard } from "./feed-curation-card";
import { FeedMilestoneCard } from "./feed-milestone-card";
import { FeedNewPlaceCard } from "./feed-new-place-card";
import { FeedReviewCard } from "./feed-review-card";
import { type FeedMute, feedItemPlace } from "./use-feed";

/**
 * O que este card oferece silenciar.
 *
 * Bairro e categoria só entram quando o item tem **um** lugar: num roteiro de
 * três, "menos deste bairro" silenciaria os outros dois de quebra.
 *
 * @param item Item exibido.
 * @returns Regras na ordem em que aparecem no menu, da mais estreita à mais larga.
 */
function buildMutes(item: FeedItemMock): FeedMute[] {
  const local = feedItemPlace(item);

  const rules: FeedMute[] = [];

  if (local) {
    rules.push({
      scope: "bairro",
      value: local.bairro,
      label: `Menos do bairro ${local.bairro}`,
    });
    rules.push({
      scope: "categoria",
      value: local.categoria,
      label: `Menos de ${local.categoria}`,
    });
  }

  rules.push({
    scope: "tipo",
    value: item.kind,
    label: `Menos ${FEED_KIND_LABEL[item.kind]}`,
  });

  return rules;
}

interface FeedItemProps {
  item: FeedItemMock;
  handlers: FeedCardHandlers;
}

/**
 * Escolhe o card pelo tipo do item.
 *
 * A união é discriminada por `kind`, então tipo novo no modelo quebra este
 * `switch` em tempo de compilação — que é onde se quer descobrir que faltou
 * desenhar o card.
 */
export function FeedItem({ item, handlers }: FeedItemProps) {
  const mutes = buildMutes(item);

  switch (item.kind) {
    case "avaliacao":
      return <FeedReviewCard item={item} mutes={mutes} handlers={handlers} />;
    case "movimento":
      return <FeedBurstCard item={item} mutes={mutes} handlers={handlers} />;
    case "novo-ponto":
      return <FeedNewPlaceCard item={item} mutes={mutes} handlers={handlers} />;
    case "conquista":
      return (
        <FeedAchievementCard item={item} mutes={mutes} handlers={handlers} />
      );
    case "marco":
      return (
        <FeedMilestoneCard item={item} mutes={mutes} handlers={handlers} />
      );
    case "curadoria":
      return <FeedCurationCard item={item} mutes={mutes} handlers={handlers} />;
  }
}
