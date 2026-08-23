import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { PlaceCard } from "@/components/blocks/place-card";
import { PlaceRow } from "@/components/blocks/place-row";
import { StarRating } from "@/components/blocks/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentExplorerMock } from "@/mocks/community";
import {
  profileFavoriteIdsMock,
  profileLockedAchievements,
  profilePlace,
  profileVisitsMock,
  visitDaysAgo,
} from "@/mocks/profile";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

import { AchievementProgressCard } from "./_components/achievement-progress-card";
import { VerificationChecklist } from "./_components/verification-checklist";

/** Quantos itens cada prévia da visão geral mostra antes de mandar para a aba. */
const PREVIEW_SIZE = 3;

/**
 * Visão geral do perfil.
 *
 * Responde "o que eu já fiz e o que falta pro próximo passo" — por isso abre
 * com a régua do selo e a conquista mais perto de sair, não com a vitrine. O
 * que os outros veem de mim é `/community/[id]`.
 */
export default function ProfilePage() {
  const explorer = currentExplorerMock;
  const proxima = profileLockedAchievements().at(0);

  const ultimasVisitas = profileVisitsMock.slice(0, PREVIEW_SIZE);
  const favoritos = profileFavoriteIdsMock.slice(0, PREVIEW_SIZE);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <VerificationChecklist stats={explorer} />

        <div className="flex flex-col gap-3">
          <SectionHeader
            titulo="Próxima conquista"
            href="/profile/achievements"
          />

          {proxima ? (
            <AchievementProgressCard item={proxima} />
          ) : (
            <EmptyState texto="Você desbloqueou tudo que o catálogo oferece hoje." />
          )}
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <SectionHeader titulo="Últimas visitas" href="/profile/visits" />

        {ultimasVisitas.map((visita) => {
          const lugar = profilePlace(visita.markerId);

          return (
            <PlaceRow
              key={`${visita.markerId}-${visita.data}`}
              marker={{ id: lugar.id, nome: lugar.nome }}
              trailing={
                <span className="text-muted-foreground text-xs">
                  {formatWaitingDays(visitDaysAgo(visita))}
                </span>
              }
            />
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader titulo="Lugares salvos" href="/profile/favorites" />

        <div className="flex flex-wrap gap-3">
          {favoritos.map((id) => (
            <PlaceCard
              key={id}
              size="sm"
              marker={{ id, nome: profilePlace(id).nome }}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-lg">Minhas avaliações</h2>

        {explorer.ultimasAvaliacoes.length === 0 ? (
          <EmptyState texto="Você ainda não escreveu nenhuma avaliação." />
        ) : (
          explorer.ultimasAvaliacoes.map((review) => (
            <Card key={`${review.local.id}-${review.diasAtras}`} size="sm">
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/places/${review.local.id}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {review.local.nome}
                  </Link>

                  <span className="text-muted-foreground text-xs">
                    {review.local.bairro} ·{" "}
                    {formatWaitingDays(review.diasAtras)}
                  </span>
                </div>

                <StarRating nota={review.nota} showValue />

                <p className="text-pretty text-sm leading-relaxed">
                  {review.corpo}
                </p>

                <span className="text-muted-foreground text-xs">
                  {review.uteis} pessoas acharam útil
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

function SectionHeader({ titulo, href }: { titulo: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-semibold text-lg">{titulo}</h2>

      <Button asChild variant="ghost" size="sm">
        <Link href={href}>
          Ver tudo
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

function EmptyState({ texto }: { texto: string }) {
  return (
    <p className="rounded-xl border border-border border-dashed p-8 text-center text-muted-foreground text-sm">
      {texto}
    </p>
  );
}
