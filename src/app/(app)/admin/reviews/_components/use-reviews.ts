"use client";

import { useCallback, useMemo, useState } from "react";

import type { RemovalReason } from "@/constants/content-removal";
import { type ReviewMock, reviewsMock } from "@/mocks/admin-reviews";

/**
 * Distância mínima entre a nota e a média do local para a avaliação contar
 * como discrepante. 2,5 é meia escala: separa "gostei menos que a maioria" de
 * "avaliei outro lugar".
 */
const DISCREPANCY_THRESHOLD = 2.5;

/**
 * Abaixo disto a média do local não tem massa para servir de referência —
 * duas avaliações fazem qualquer terceira parecer discrepante.
 */
const MIN_REVIEWS_FOR_AVERAGE = 4;

export type ReviewSignalKind = "spam" | "duplicada" | "discrepante";

export interface ReviewSignal {
  kind: ReviewSignalKind;
  label: string;
  /** `bad` costuma virar remoção; `warn` pede leitura antes de decidir. */
  tone: "bad" | "warn";
}

/** Média das avaliações publicadas de cada local. */
function averageByPlace(reviews: ReviewMock[]): Map<number, number> {
  const totals = new Map<number, { soma: number; contagem: number }>();

  for (const review of reviews) {
    if (review.status !== "publicada") continue;

    const current = totals.get(review.local.id) ?? { soma: 0, contagem: 0 };
    totals.set(review.local.id, {
      soma: current.soma + review.nota,
      contagem: current.contagem + 1,
    });
  }

  return new Map(
    [...totals.entries()]
      .filter(([, { contagem }]) => contagem >= MIN_REVIEWS_FOR_AVERAGE)
      .map(([id, { soma, contagem }]) => [id, soma / contagem]),
  );
}

/**
 * Categorias formais de problema numa avaliação.
 *
 * `duplicada` e `discrepante` são **derivadas do conjunto** — é exatamente o
 * que `docs/todo/admin/reviews.md` quer dizer com "só aparece olhando o
 * conjunto, nunca uma a uma". `spam` é flag do registro porque marcar exige
 * analisar texto; quando `Analise` existir, ela vem do backend.
 *
 * @param review Avaliação em julgamento.
 * @param reviews Base inteira, para as médias e a checagem de repetição.
 * @param averages Médias por local, pré-calculadas para evitar O(n²).
 * @returns Sinais aplicáveis, dos mais graves aos menos.
 */
export function getReviewSignals(
  review: ReviewMock,
  reviews: ReviewMock[],
  averages: Map<number, number>,
): ReviewSignal[] {
  const signals: ReviewSignal[] = [];

  if (review.spam) {
    signals.push({ kind: "spam", label: "Suspeita de spam", tone: "bad" });
  }

  const duplicated = reviews.some(
    (other) =>
      other.id !== review.id &&
      other.autorId === review.autorId &&
      other.local.id === review.local.id,
  );

  if (duplicated) {
    signals.push({ kind: "duplicada", label: "Duplicada", tone: "warn" });
  }

  const average = averages.get(review.local.id);

  if (
    average !== undefined &&
    Math.abs(review.nota - average) >= DISCREPANCY_THRESHOLD
  ) {
    signals.push({ kind: "discrepante", label: "Discrepante", tone: "warn" });
  }

  return signals;
}

/**
 * Estado da listagem de avaliações. `Analise` não existe no banco: remover
 * apenas troca o `status` no array local, porque a exclusão é **lógica** — a
 * avaliação sai da vitrine e continua auditável.
 *
 * Quando a entidade existir, isto vira `src/http/reviews` + Server Actions, e
 * a remoção precisa ser a **mesma** action consumida por `/admin/reports`.
 */
export function useReviews() {
  const [reviews, setReviews] = useState<ReviewMock[]>(reviewsMock);

  const averages = useMemo(() => averageByPlace(reviews), [reviews]);

  const signalsById = useMemo(() => {
    return new Map(
      reviews.map((review) => [
        review.id,
        getReviewSignals(review, reviews, averages),
      ]),
    );
  }, [reviews, averages]);

  const stats = useMemo(() => {
    const published = reviews.filter((r) => r.status === "publicada");

    const average = published.length
      ? published.reduce((sum, r) => sum + r.nota, 0) / published.length
      : 0;

    return {
      publicadas: published.length,
      notaMedia: average,
      removidas: reviews.filter((r) => r.status === "removida").length,
      comSinal: published.filter(
        (r) => (signalsById.get(r.id)?.length ?? 0) > 0,
      ).length,
    };
  }, [reviews, signalsById]);

  /** Marca como removida, guardando quem removeu e por quê. */
  const remove = useCallback((ids: string[], motivo: RemovalReason) => {
    const alvo = new Set(ids);

    setReviews((current) =>
      current.map((review) =>
        alvo.has(review.id)
          ? {
              ...review,
              status: "removida" as const,
              // Sem sessão nem papel de admin, o autor da decisão é fixo.
              removidaPor: "Rafael Sousa",
              motivoRemocao: motivo,
            }
          : review,
      ),
    );
  }, []);

  const restore = useCallback((id: string) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              status: "publicada" as const,
              removidaPor: undefined,
              motivoRemocao: undefined,
            }
          : review,
      ),
    );
  }, []);

  return { reviews, signalsById, stats, remove, restore };
}

export type { ReviewMock };
