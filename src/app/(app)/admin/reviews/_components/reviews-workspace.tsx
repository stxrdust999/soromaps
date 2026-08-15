"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { RemovalDialog } from "@/components/blocks/removal-dialog";
import { SiteFooter } from "@/components/blocks/site-footer";
import type { RemovalReason } from "@/constants/content-removal";
import type { ReviewMock } from "@/mocks/admin-reviews";

import { ReviewsStats } from "./reviews-stats";
import { ReviewsTable } from "./reviews-table";
import { useReviews } from "./use-reviews";

/** Alvo da remoção: uma avaliação da linha, ou o lote selecionado. */
interface PendingRemoval {
  reviews: ReviewMock[];
  /** Limpa a seleção da tabela depois que o lote sai. */
  clearSelection?: () => void;
}

/**
 * Listagem administrativa de avaliações.
 *
 * É a única tela que vê avaliação **fora** do contexto do local — o
 * estabelecimento vê só as do próprio ponto e a moderação só as denunciadas.
 * Por isso as ações de pivotar por autor e por local importam tanto quanto a
 * remoção: padrão de nota anômalo não aparece lendo uma linha por vez.
 *
 * É client porque `Analise` não existe no banco: remover só troca o `status`
 * no array de `src/mocks/admin-reviews.ts`.
 */
export function ReviewsWorkspace() {
  const { reviews, signalsById, stats, remove, restore } = useReviews();

  const [pending, setPending] = useState<PendingRemoval | null>(null);

  const actions = useMemo(
    () => ({
      onRemove: (review: ReviewMock) => setPending({ reviews: [review] }),
      onRestore: (review: ReviewMock) => {
        restore(review.id);
        toast.success("Avaliação restaurada", {
          description: "Voltou para a vitrine do local.",
        });
      },
    }),
    [restore],
  );

  const onRemoveSelected = useCallback(
    (selected: ReviewMock[], clearSelection: () => void) => {
      setPending({ reviews: selected, clearSelection });
    },
    [],
  );

  function confirmRemoval(motivo: RemovalReason) {
    if (!pending) return;

    const count = pending.reviews.length;

    remove(
      pending.reviews.map((review) => review.id),
      motivo,
    );
    pending.clearSelection?.();
    setPending(null);

    toast.success(
      count === 1
        ? `Avaliação removida (${motivo})`
        : `${count} avaliações removidas (${motivo})`,
      { description: "Saíram da vitrine e continuam auditáveis aqui." },
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Avaliações"
        description="Todas as avaliações da plataforma, fora do contexto do local"
        className="gap-6"
        subitems={
          <ReviewsStats
            publicadas={stats.publicadas}
            notaMedia={stats.notaMedia}
            removidas={stats.removidas}
            comSinal={stats.comSinal}
          />
        }
      >
        <ReviewsTable
          reviews={reviews}
          signalsById={signalsById}
          actions={actions}
          onRemoveSelected={onRemoveSelected}
        />
      </PageSection>

      <SiteFooter />

      {pending && (
        <RemovalDialog
          subject={
            pending.reviews.length === 1
              ? `avaliação de ${pending.reviews[0].local.nome}`
              : "avaliações"
          }
          count={pending.reviews.length}
          onOpenChange={(open) => !open && setPending(null)}
          onConfirm={confirmRemoval}
        />
      )}
    </main>
  );
}
