"use client";

import { useCallback, useMemo, useState } from "react";

import { ACHIEVEMENT_EVENTS } from "@/constants/achievements";
import {
  type AchievementCriterion,
  formatCriterion,
} from "@/helpers/achievement-criteria";
import {
  type AchievementMock,
  achievementsMock,
} from "@/mocks/admin-achievements";
import type { AchievementFormSchema } from "@/validations/achievements";

/** Quantas conquistas cada painel de calibragem mostra. */
export const CALIBRATION_SIZE = 5;

/**
 * Critério de uma conquista do catálogo, no formato que os helpers esperam.
 *
 * @param achievement Conquista do catálogo.
 * @returns Critério declarativo.
 */
export function toCriterion(
  achievement: AchievementMock,
): AchievementCriterion {
  return {
    evento: achievement.evento,
    quantidade: achievement.quantidade,
    tipoAlvo: achievement.tipoAlvo,
    alvo: achievement.alvo,
  };
}

/**
 * Frase do critério pronta para exibição, com fallback — o catálogo nunca
 * deveria ter critério quebrado, mas a coluna não pode renderizar vazio.
 *
 * @param achievement Conquista do catálogo.
 * @returns Frase legível.
 */
export function describeCriterion(achievement: AchievementMock): string {
  return formatCriterion(toCriterion(achievement)) ?? "Critério incompleto";
}

/**
 * Como o motor descobre que a conquista foi cumprida — deriva do evento, não
 * é escolha do admin. Um critério de sequência é sempre `streak`.
 *
 * @param achievement Conquista do catálogo.
 * @returns Gatilho correspondente.
 */
export function triggerOf(achievement: AchievementMock) {
  return ACHIEVEMENT_EVENTS[achievement.evento].trigger;
}

/**
 * Catálogo de conquistas em memória. Não há tabela `Conquista` nem motor de
 * concessão: criar, editar e desativar mexem só neste array.
 *
 * **Não existe excluir.** Conquista já concedida não pode sumir — quem ganhou
 * mantém. A única saída é desativar, que tira do catálogo visível sem tocar
 * no histórico.
 */
export function useAchievements() {
  const [achievements, setAchievements] =
    useState<AchievementMock[]>(achievementsMock);

  const stats = useMemo(
    () => ({
      total: achievements.length,
      ativas: achievements.filter((item) => item.ativa).length,
      zeradas: achievements.filter((item) => item.obtencoes === 0).length,
      concedidas: achievements.reduce((sum, item) => sum + item.obtencoes, 0),
    }),
    [achievements],
  );

  /** Ordenado por obtenções, para os dois painéis de calibragem. */
  const byPopularity = useMemo(
    () => [...achievements].sort((a, b) => b.obtencoes - a.obtencoes),
    [achievements],
  );

  const calibration = useMemo(
    () => ({
      mostEarned: byPopularity.slice(0, CALIBRATION_SIZE),
      leastEarned: byPopularity.slice(-CALIBRATION_SIZE).reverse(),
    }),
    [byPopularity],
  );

  const save = useCallback(
    (values: AchievementFormSchema, id: string | null) => {
      setAchievements((current) => {
        if (id) {
          return current.map((item) =>
            item.id === id ? { ...item, ...values } : item,
          );
        }

        return [
          ...current,
          {
            ...values,
            id: `a${current.length + 1}`,
            obtencoes: 0,
            raridade: 0,
          },
        ];
      });
    },
    [],
  );

  const duplicate = useCallback((id: string) => {
    setAchievements((current) => {
      const source = current.find((item) => item.id === id);
      if (!source) return current;

      return [
        ...current,
        {
          ...source,
          id: `${source.id}-copia`,
          nome: `${source.nome} (cópia)`,
          obtencoes: 0,
          raridade: 0,
          // Cópia nasce inativa: publicar duas conquistas idênticas divide a
          // base entre as duas e estraga a leitura de calibragem.
          ativa: false,
        },
      ];
    });
  }, []);

  const setActive = useCallback((id: string, active: boolean) => {
    setAchievements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ativa: active } : item,
      ),
    );
  }, []);

  return { achievements, stats, calibration, save, duplicate, setActive };
}
