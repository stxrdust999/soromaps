"use client";

import { EyeOffIcon, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEED_SORT_LABEL, type FeedSort } from "@/constants/feed";
import { cn } from "@/lib/utils";

import { FeedAside } from "./feed-aside";
import type { FeedCardHandlers } from "./feed-card-frame";
import { FeedItem } from "./feed-item";
import { FeedSourceChips } from "./feed-source-chips";
import { ALL_REASONS, type FeedMute, useFeed } from "./use-feed";

const SORTS: FeedSort[] = ["relevancia", "recente"];

/**
 * Largura das duas colunas de conteúdo. Centralizada porque em tela larga a
 * folga sobraria toda depois da coluna de apoio; o cabeçalho e os chips seguem
 * ocupando a página inteira, como nas outras telas.
 */
const FEED_COLUMNS = "mx-auto flex w-full max-w-6xl gap-6";

/**
 * Feed do explorador.
 *
 * **Não existe "seguindo" aqui.** O produto trocou o grafo social por cinco
 * vínculos com a cidade — bairro, lugar acompanhado, categoria, movimento da
 * cidade e pauta da equipe —, todos deriváveis de `Visita` e `Favorita`, sem
 * tabela de relacionamento entre pessoas. Isso mata o cold start (feed novo
 * nunca abre vazio), tira a moderação de vínculo social do escopo e mantém o
 * assunto onde o produto quer: lugar, não gente. O detalhe está em
 * `docs/todo/user/feed.md`.
 *
 * É client porque nenhuma das entidades existe no banco: filtro, ordenação,
 * silenciamento e reação vivem no array de `src/mocks/feed.ts`.
 */
export function FeedWorkspace() {
  const feed = useFeed();

  const { mute, unmute, toggleSave, toggleUseful, saved, useful } = feed;

  const onMute = useCallback(
    (rule: FeedMute) => {
      mute(rule);

      toast.success(rule.label.replace("Menos", "Vendo menos"), {
        description: "Vale só nesta sessão, enquanto o feed é fictício.",
        action: { label: "Desfazer", onClick: () => unmute(rule) },
      });
    },
    [mute, unmute],
  );

  const onSave = useCallback(
    (placeId: number) => {
      const wasSaved = saved.has(placeId);
      toggleSave(placeId);

      toast.success(
        wasSaved ? "Você parou de acompanhar" : "Lugar acompanhado",
        {
          description: wasSaved
            ? "As novidades dele saem do seu feed."
            : "As novidades dele passam a aparecer no seu feed.",
        },
      );
    },
    [saved, toggleSave],
  );

  const handlers: FeedCardHandlers = {
    onMute,
    isSaved: (placeId) => saved.has(placeId),
    onSave,
    isUseful: (itemId) => useful.has(itemId),
    onUseful: toggleUseful,
  };

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Feed"
        description="O que aconteceu nos lugares que te interessam — sem seguir ninguém"
        className="gap-6"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
              {SORTS.map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant="ghost"
                  onClick={() => feed.setSort(option)}
                  className={cn(
                    "text-muted-foreground",
                    feed.sort === option &&
                      "bg-background text-foreground shadow-xs hover:bg-background",
                  )}
                >
                  {FEED_SORT_LABEL[option]}
                </Button>
              ))}
            </div>

            <Button asChild>
              <Link href="/places/new">
                <PlusIcon />
                Adicionar ponto
              </Link>
            </Button>
          </div>
        }
        subitems={
          <div className="mt-4 flex flex-col gap-3">
            <FeedSourceChips
              active={feed.filter}
              onChange={feed.setFilter}
              counts={feed.countByReason}
              total={Object.values(feed.countByReason).reduce(
                (total, count) => total + count,
                0,
              )}
            />

            {feed.mutes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <EyeOffIcon className="size-3.5" />
                  {feed.silenciados} itens fora do feed:
                </span>

                {feed.mutes.map((rule) => (
                  <Badge
                    key={`${rule.scope}-${rule.value}`}
                    variant="outline"
                    asChild
                  >
                    <button type="button" onClick={() => feed.unmute(rule)}>
                      {rule.label}
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div className={FEED_COLUMNS}>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {feed.groups.every((group) => group.items.length === 0) ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-muted-foreground text-sm">
                  Nada nesta fonte agora.
                </p>

                <Button
                  variant="outline"
                  onClick={() => feed.setFilter(ALL_REASONS)}
                >
                  Ver tudo que está acontecendo
                </Button>
              </div>
            ) : (
              feed.groups.map((group) => (
                <section
                  key={group.label ?? "relevancia"}
                  className="flex flex-col gap-4"
                >
                  {group.label && (
                    <h2 className="sticky top-0 z-10 -mx-1 bg-background/85 px-1 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide backdrop-blur-sm">
                      {group.label}
                    </h2>
                  )}

                  {group.items.map((item) => (
                    <FeedItem key={item.id} item={item} handlers={handlers} />
                  ))}
                </section>
              ))
            )}

            {feed.hasMore && (
              <Button
                variant="outline"
                onClick={feed.showMore}
                className="self-center"
              >
                Carregar mais
              </Button>
            )}

            {!feed.hasMore && feed.total > 0 && (
              <p className="py-4 text-center text-muted-foreground text-xs">
                Você chegou ao fim das novidades. Explore o mapa para o feed ter
                mais do que te interessa.
              </p>
            )}
          </div>

          <FeedAside
            counts={feed.countByReason}
            active={feed.filter}
            onFilterChange={feed.setFilter}
          />
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
