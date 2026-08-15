import {
  ACHIEVEMENT_EVENTS,
  type AchievementEventKey,
  type AchievementTargetKind,
  TARGET_LABEL,
} from "@/constants/achievements";

export interface AchievementCriterion {
  evento: AchievementEventKey;
  quantidade: number;
  /** `null` = sem alvo; conta o evento em qualquer lugar. */
  tipoAlvo: AchievementTargetKind | null;
  /** Nome da categoria ou do bairro. Obrigatório quando há `tipoAlvo`. */
  alvo: string | null;
}

/**
 * Monta a frase legível do critério — "Visitar 5 lugares da categoria
 * Cafeteria".
 *
 * É a prova de que a promessa do módulo se cumpriu: três campos viram a regra
 * que o motor de concessão executa e a frase que o jogador lê, sem código no
 * meio. Devolve `null` quando o critério ainda não fecha, para o formulário
 * poder avisar em vez de mostrar frase quebrada.
 *
 * @param criterion Critério declarativo.
 * @returns Frase em pt-BR, ou `null` se o critério estiver incompleto.
 */
export function formatCriterion(
  criterion: AchievementCriterion,
): string | null {
  const definition = ACHIEVEMENT_EVENTS[criterion.evento];
  if (!definition) return null;

  if (!Number.isFinite(criterion.quantidade) || criterion.quantidade < 1) {
    return null;
  }

  // Alvo escolhido sem valor é critério pela metade — "da categoria …" o quê?
  if (criterion.tipoAlvo && !criterion.alvo) return null;

  const noun =
    criterion.quantidade === 1
      ? definition.substantivoSingular
      : definition.substantivo;

  const tail = criterion.tipoAlvo
    ? ` ${TARGET_LABEL[criterion.tipoAlvo]} ${criterion.alvo}`
    : "";

  return `${definition.verbo} ${criterion.quantidade} ${noun}${tail}`;
}

/** Quantos usuários a base tem para cada evento, antes de estreitar por alvo. */
const EVENT_AUDIENCE: Record<AchievementEventKey, number> = {
  visitar: 1400,
  avaliar: 900,
  seguir: 620,
  criar: 380,
  favoritar: 780,
  sequencia: 240,
};

/** Fração da audiência que sobra ao restringir a uma categoria ou bairro. */
const TARGET_NARROWING = 0.32;

/**
 * Quantos usuários já cumpririam o critério hoje.
 *
 * **Estimativa grosseira, não consulta.** Decai o público do evento por uma
 * potência da quantidade exigida, o que reproduz o formato da curva real:
 * dobrar a meta corta muito mais que metade. Serve para o admin descobrir
 * *antes de salvar* que criou uma conquista impossível — quando existir
 * `Visita`/`Analise`, isto vira um `COUNT` de verdade.
 *
 * @param criterion Critério declarativo.
 * @returns Estimativa de usuários, ou `null` se o critério estiver incompleto.
 */
export function estimateReach(criterion: AchievementCriterion): number | null {
  if (!formatCriterion(criterion)) return null;

  const audience = EVENT_AUDIENCE[criterion.evento];
  const narrowing = criterion.tipoAlvo ? TARGET_NARROWING : 1;

  return Math.max(
    Math.round((audience * narrowing) / criterion.quantidade ** 1.35),
    0,
  );
}
