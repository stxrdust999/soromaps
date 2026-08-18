"use client";

import {
  ArrowRightIcon,
  SlidersHorizontalIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { explorerTitle } from "@/constants/explorer-titles";
import { FEED_REASON_ORDER, FEED_REASONS } from "@/constants/feed";
import { cn } from "@/lib/utils";
import {
  feedChallengeMock,
  feedContributorsMock,
  feedProfileMock,
  feedTrendingMock,
} from "@/mocks/feed";

import { ALL_REASONS, type FeedFilter } from "./use-feed";

interface FeedAsideProps {
  counts: Record<string, number>;
  active: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
}

/**
 * Coluna de apoio do feed.
 *
 * O primeiro card é o mais importante: ele mostra **de onde** o feed veio, com
 * o número de itens de cada fonte. Num feed sem "seguindo", essa é a única
 * forma de o usuário entender por que a tela dele é diferente da de outra
 * pessoa — e cada linha filtra, então entender e ajustar são o mesmo gesto.
 */
export function FeedAside({ counts, active, onFilterChange }: FeedAsideProps) {
  const challengeProgress = Math.round(
    (feedChallengeMock.atual / feedChallengeMock.total) * 100,
  );

  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 xl:flex">
      <Card size="sm" className="sticky top-4 gap-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
            Seu recorte
          </CardTitle>
          <CardDescription>
            {feedProfileMock.bairro} e {feedProfileMock.raioKm} km em volta ·{" "}
            {feedProfileMock.categoriasFavoritas.join(" e ")} ·{" "}
            {feedProfileMock.lugaresSalvos} lugares acompanhados
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          {FEED_REASON_ORDER.map((reason) => {
            const definition = FEED_REASONS[reason];
            const Icon = definition.icon;
            const count = counts[reason] ?? 0;

            return (
              <button
                key={reason}
                type="button"
                onClick={() =>
                  onFilterChange(active === reason ? ALL_REASONS : reason)
                }
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                  active === reason && "bg-muted",
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  {definition.label}
                </span>

                <span className="text-muted-foreground text-xs tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card size="sm" className="gap-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-4 text-amber-500" />
            Desafio da semana
          </CardTitle>
          <CardDescription>{feedChallengeMock.titulo}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {feedChallengeMock.descricao}
          </p>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={feedChallengeMock.atual}
            aria-valuemin={0}
            aria-valuemax={feedChallengeMock.total}
            aria-label={`Progresso em ${feedChallengeMock.titulo}`}
          >
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${challengeProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {feedChallengeMock.atual} de {feedChallengeMock.total} visitas
            </span>
            <span className="text-muted-foreground">
              termina em {feedChallengeMock.diasRestantes} dias
            </span>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" className="gap-3">
        <CardHeader>
          <CardTitle>Exploradores da semana</CardTitle>
          <CardDescription>
            Ranking por contribuição registrada — não há seguidores para contar
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {feedContributorsMock.map((person, index) => (
            <div key={person.nome} className="flex items-center gap-3">
              <span className="w-4 shrink-0 text-center text-muted-foreground text-xs tabular-nums">
                {index + 1}
              </span>

              <Avatar className="size-8">
                {person.avatarUrl && (
                  <AvatarImage src={person.avatarUrl} alt={person.nome} />
                )}
                <AvatarFallback className="text-[10px]">
                  {person.iniciais}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                  {person.nome}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {explorerTitle(person.conquistas)} · {person.bairro}
                </span>
              </div>

              <Badge variant="ghost" className="tabular-nums">
                {person.contribuicoes}
              </Badge>
            </div>
          ))}

          <Button asChild size="sm" variant="ghost" className="self-start">
            <Link href="/community">
              Ver a comunidade
              <ArrowRightIcon />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card size="sm" className="gap-3">
        <CardHeader>
          <CardTitle>Movimento da semana</CardTitle>
          <CardDescription>
            Lugares com mais avaliações e visitas novas
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          {feedTrendingMock.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{place.nome}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {place.bairro}
                </span>
              </span>

              <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                +{place.novidades}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
