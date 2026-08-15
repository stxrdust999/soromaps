"use client";

import { useCallback, useMemo, useState } from "react";

import { COMMERCIAL_CATEGORIES } from "@/constants/categories";
import {
  type BusinessClaimMock,
  businessClaimsMock,
  type VerifiedBusinessMock,
  verifiedBusinessesMock,
} from "@/mocks/admin-businesses";
import { formatDistance } from "@/utils/formatters/format-distance";

/**
 * Acima disto o endereço do CNPJ deixa de confirmar o pin e passa a
 * contradizê-lo. Um quilômetro cobre imprecisão de geocodificação e prédio
 * comercial vizinho, sem deixar passar CNPJ de outra cidade.
 */
const DISTANT_CNPJ_KM = 1;

export type ClaimSignalKind =
  | "conflito"
  | "distancia"
  | "dono"
  | "naoComercial"
  | "novo";

export interface ClaimSignal {
  kind: ClaimSignalKind;
  label: string;
  /** `bad` bloqueia a decisão; `warn` pede leitura; `neutral` é contexto. */
  tone: "bad" | "warn" | "neutral";
}

/**
 * Sinais de risco de um pedido — cada um responde a uma forma concreta de
 * fraude, e é isso que a tela precisa mostrar antes de qualquer outra coisa.
 *
 * @param claim Pedido em análise.
 * @param claims Fila inteira, para contar pedidos concorrentes.
 * @returns Sinais em ordem de gravidade.
 */
export function getClaimSignals(
  claim: BusinessClaimMock,
  claims: BusinessClaimMock[],
): ClaimSignal[] {
  const signals: ClaimSignal[] = [];

  if (claim.conflitoCom) {
    const competing = claims.filter((other) => other.ponto === claim.ponto);
    signals.push({
      kind: "conflito",
      label: `Conflito: ${competing.length} pedidos`,
      tone: "bad",
    });
  }

  if (
    claim.distanciaCnpjKm !== null &&
    claim.distanciaCnpjKm > DISTANT_CNPJ_KM
  ) {
    signals.push({
      kind: "distancia",
      label: `CNPJ a ${formatDistance(claim.distanciaCnpjKm)} do ponto`,
      tone: "warn",
    });
  }

  if (claim.donoAtual) {
    signals.push({
      kind: "dono",
      label: "Ponto já tem dono",
      tone: "warn",
    });
  }

  if (!COMMERCIAL_CATEGORIES.includes(claim.categoria)) {
    signals.push({
      kind: "naoComercial",
      label: "Categoria não comercial",
      tone: "warn",
    });
  }

  if (claim.solicitanteNovo) {
    signals.push({
      kind: "novo",
      label: "Solicitante novo",
      tone: "neutral",
    });
  }

  return signals;
}

/**
 * Estado das reivindicações. Não há entidade de vínculo nem endpoint: decidir
 * apenas tira o pedido do array local.
 *
 * Quando `markers` tiver FK de dono, isto vira `src/http/businesses` + Server
 * Actions, e o que sobra aqui é o estado de painel e diálogo.
 */
export function useBusinessClaims() {
  const [claims, setClaims] = useState(businessClaimsMock);
  const [verified, setVerified] = useState(verifiedBusinessesMock);

  const stats = useMemo(
    () => ({
      pendentes: claims.length,
      verificados: verified.length,
      conflitos: new Set(
        claims.filter((claim) => claim.conflitoCom).map((claim) => claim.ponto),
      ).size,
    }),
    [claims, verified],
  );

  /** Tira o pedido da fila. Aprovar, recusar e devolver saem todos por aqui. */
  const resolve = useCallback((id: string) => {
    setClaims((current) => current.filter((claim) => claim.id !== id));
  }, []);

  /**
   * Aprova um lado do conflito e recusa o outro no mesmo movimento — decidir
   * um sem fechar o outro deixaria o ponto pronto para ser reivindicado de
   * novo pelo perdedor.
   */
  const resolveConflict = useCallback((winnerId: string, loserId: string) => {
    setClaims((current) =>
      current.filter((claim) => claim.id !== winnerId && claim.id !== loserId),
    );
  }, []);

  const revoke = useCallback((id: string) => {
    setVerified((current) => current.filter((business) => business.id !== id));
  }, []);

  const findCompetitor = useCallback(
    (claim: BusinessClaimMock): BusinessClaimMock | null =>
      claims.find((other) => other.id === claim.conflitoCom) ?? null,
    [claims],
  );

  return {
    claims,
    verified,
    stats,
    resolve,
    resolveConflict,
    revoke,
    findCompetitor,
  };
}

export type { BusinessClaimMock, VerifiedBusinessMock };
