/**
 * Atividade pessoal do usuário da sessão — o que alimenta as abas de
 * `/profile`.
 *
 * `Visita`, `Favorita`, `Analise` e `GanhaConquista` não existem no banco, e é
 * delas que sai tudo aqui. Ver `docs/todo/user/profile.md`.
 *
 * Os contadores de `currentExplorerMock` (`src/mocks/community.ts`) são a
 * fonte da verdade, porque `/community` já os publica no ranking. Este arquivo
 * **deriva** em vez de repetir: as 24 visitas são as 24 do contador, e a
 * conquista é considerada obtida contando estas mesmas visitas. Número
 * digitado duas vezes é número que diverge no primeiro ajuste.
 */

import type { UserAchievement } from "@/components/ui/achievement-badge";
import { ACHIEVEMENT_EVENTS } from "@/constants/achievements";
import { formatCriterion } from "@/helpers/achievement-criteria";
import {
  type AchievementMock,
  achievementsMock,
} from "@/mocks/admin-achievements";
import { currentExplorerMock } from "@/mocks/community";
import { markerCatalogMock } from "@/mocks/markers";

/**
 * Data de referência de tudo que é relativo nesta tela.
 *
 * Fixa de propósito: "há N dias" calculado sobre `Date.now()` renderiza
 * diferente no servidor e no cliente e quebra a hidratação. Mesmo motivo do
 * `FEED_ANCHOR` em `src/mocks/feed.ts`.
 */
export const PROFILE_ANCHOR = "2026-08-19";

export interface ProfileVisitMock {
  /** Índice em `markerCatalogMock`. */
  markerId: number;
  /** Data da visita, ISO curta. */
  data: string;
  /** Nota da avaliação escrita naquela ocasião, quando houve. */
  nota?: number;
}

/**
 * Visitas registradas, da mais recente para a mais antiga.
 *
 * Lugar repetido é o ponto: `Visita` leva `data` na PK justamente porque é
 * evento repetível. Deduplicar aqui daria uma timeline que mente.
 */
export const profileVisitsMock: ProfileVisitMock[] = [
  { markerId: 0, data: "2026-08-17", nota: 5 },
  { markerId: 9, data: "2026-08-15" },
  { markerId: 0, data: "2026-08-14" },
  { markerId: 11, data: "2026-08-12", nota: 4 },
  { markerId: 3, data: "2026-08-10" },
  { markerId: 1, data: "2026-08-09" },
  { markerId: 2, data: "2026-08-08" },
  { markerId: 0, data: "2026-08-06" },
  { markerId: 12, data: "2026-08-05" },
  { markerId: 15, data: "2026-08-03" },
  { markerId: 4, data: "2026-08-02", nota: 5 },
  { markerId: 16, data: "2026-08-01" },
  { markerId: 0, data: "2026-07-30" },
  { markerId: 5, data: "2026-07-28", nota: 4 },
  { markerId: 9, data: "2026-07-26" },
  { markerId: 3, data: "2026-07-25" },
  { markerId: 0, data: "2026-07-23" },
  { markerId: 2, data: "2026-07-21" },
  { markerId: 10, data: "2026-07-19" },
  { markerId: 1, data: "2026-07-18" },
  { markerId: 13, data: "2026-07-16" },
  { markerId: 15, data: "2026-07-14" },
  { markerId: 4, data: "2026-07-12" },
  { markerId: 6, data: "2026-07-10" },
];

/**
 * Lugares salvos. Nove, o mesmo `lugaresSalvos` de `feedProfileMock` — o feed
 * usa esse número para explicar o motivo `salvo` de um card.
 */
export const profileFavoriteIdsMock = [0, 1, 3, 6, 9, 11, 12, 14, 15];

/** Dias seguidos com visita registrada, para a conquista de sequência. */
export const profileStreakMock = 4;

/**
 * Lugar do catálogo por id.
 *
 * @param markerId Índice em `markerCatalogMock`.
 * @returns O lugar, ou `undefined` quando o id não existe.
 */
export function profilePlace(markerId: number) {
  return markerCatalogMock[markerId];
}

/**
 * Dias entre duas datas ISO. Ambas são meia-noite UTC, então não há fuso no
 * meio para arredondar errado.
 *
 * @param from Data mais antiga.
 * @param to Data mais recente.
 * @returns Dias inteiros.
 */
function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

/**
 * Há quantos dias a visita aconteceu, contando da âncora.
 *
 * @param visit Visita registrada.
 * @returns Dias inteiros, para `formatWaitingDays`.
 */
export function visitDaysAgo(visit: ProfileVisitMock): number {
  return daysBetween(visit.data, PROFILE_ANCHOR);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Data da visita em `dd/MM/yyyy`.
 *
 * Fixada em UTC porque a data chega como dia puro (`2026-08-17`), que o
 * `Date` lê como meia-noite UTC: formatar no fuso local devolveria o dia
 * anterior no Brasil, e um fuso diferente no servidor e no navegador quebraria
 * a hidratação.
 *
 * @param data Data ISO curta.
 * @returns Data formatada.
 */
export function formatVisitDate(data: string): string {
  return dateFormatter.format(new Date(data));
}

export interface ProfileVisitGroup {
  /** Ex.: "agosto de 2026". */
  rotulo: string;
  visitas: ProfileVisitMock[];
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Visitas agrupadas por mês, na ordem em que a timeline as mostra.
 *
 * @returns Grupos do mês mais recente para o mais antigo.
 */
export function profileVisitGroups(): ProfileVisitGroup[] {
  const groups: ProfileVisitGroup[] = [];

  for (const visita of profileVisitsMock) {
    const rotulo = monthFormatter.format(new Date(visita.data));
    const last = groups.at(-1);

    if (last?.rotulo === rotulo) last.visitas.push(visita);
    else groups.push({ rotulo, visitas: [visita] });
  }

  return groups;
}

export interface ProfileVisitSummary {
  visitas: number;
  lugares: number;
  bairros: number;
  categorias: number;
}

/** Resumo do topo da timeline — visitas contam repetição, o resto não. */
export function profileVisitSummary(): ProfileVisitSummary {
  const places = new Set(profileVisitsMock.map((visita) => visita.markerId));

  return {
    visitas: profileVisitsMock.length,
    lugares: places.size,
    bairros: new Set([...places].map((id) => profilePlace(id).bairro)).size,
    categorias: new Set([...places].map((id) => profilePlace(id).categoria))
      .size,
  };
}

export interface ProfileCoverage {
  visitados: number;
  total: number;
  /** Inteiro de 0 a 100. */
  percentual: number;
}

/**
 * Quanto da cidade já foi explorado — bairros com ao menos uma visita sobre os
 * bairros que o catálogo conhece.
 *
 * É o número-âncora da aba de estatísticas: completar mapa é a mecânica que a
 * tela empresta dos jogos, aplicada à cidade real.
 */
export function profileCoverage(): ProfileCoverage {
  const visitados = new Set(
    profileVisitsMock.map((visita) => profilePlace(visita.markerId).bairro),
  ).size;

  const total = new Set(markerCatalogMock.map((place) => place.bairro)).size;

  return {
    visitados,
    total,
    percentual: Math.round((visitados / total) * 100),
  };
}

export interface ProfileCategoryCount {
  categoria: string;
  visitas: number;
}

/** Categorias por número de visitas, da mais visitada para a menos. */
export function profileTopCategories(): ProfileCategoryCount[] {
  const counts = new Map<string, number>();

  for (const visita of profileVisitsMock) {
    const { categoria } = profilePlace(visita.markerId);
    counts.set(categoria, (counts.get(categoria) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([categoria, visitas]) => ({ categoria, visitas }))
    .sort((a, b) => b.visitas - a.visitas);
}

/** Quantas semanas o gráfico de atividade mostra. */
const ACTIVITY_WEEKS = 8;

export interface ProfileWeekActivity {
  /** Início da semana, `dd/MM`. */
  semana: string;
  visitas: number;
  avaliacoes: number;
}

const dayFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

/**
 * Visitas e avaliações por semana, derivadas das próprias visitas.
 *
 * Semana é a janela de sete dias contada a partir da âncora — não o calendário
 * — para o gráfico ter sempre o mesmo número de barras.
 */
export function profileWeeklyActivity(): ProfileWeekActivity[] {
  const buckets: ProfileWeekActivity[] = [];

  for (let week = ACTIVITY_WEEKS - 1; week >= 0; week--) {
    const start = Date.parse(PROFILE_ANCHOR) - (week + 1) * 7 * 86_400_000;

    buckets.push({
      semana: dayFormatter.format(new Date(start)),
      visitas: 0,
      avaliacoes: 0,
    });
  }

  for (const visita of profileVisitsMock) {
    const week = Math.floor((visitDaysAgo(visita) - 1) / 7);
    const bucket = buckets[ACTIVITY_WEEKS - 1 - week];

    if (!bucket) continue;

    bucket.visitas += 1;
    if (visita.nota !== undefined) bucket.avaliacoes += 1;
  }

  return buckets;
}

/**
 * Visitas que contam para um critério, da mais antiga para a mais recente.
 *
 * @param achievement Conquista do catálogo.
 * @returns Visitas em ordem cronológica.
 */
function qualifyingVisits(achievement: AchievementMock): ProfileVisitMock[] {
  return [...profileVisitsMock].reverse().filter((visita) => {
    const place = profilePlace(visita.markerId);

    if (achievement.tipoAlvo === "categoria") {
      return place.categoria === achievement.alvo;
    }

    if (achievement.tipoAlvo === "bairro") {
      return place.bairro === achievement.alvo;
    }

    return true;
  });
}

/**
 * Quanto o usuário já fez do que a conquista pede.
 *
 * Cada evento lê o contador que existiria no banco de verdade — visita conta
 * `Visita`, favoritar conta `Favorita`. Nada é digitado à mão, então mexer nas
 * visitas mexe na galeria sozinho.
 *
 * @param achievement Conquista do catálogo.
 * @returns Progresso absoluto, na unidade do critério.
 */
function currentProgress(achievement: AchievementMock): number {
  switch (achievement.evento) {
    case "visitar":
      return qualifyingVisits(achievement).length;
    case "avaliar":
      return currentExplorerMock.avaliacoes;
    case "criar":
      return currentExplorerMock.pontosCadastrados;
    case "favoritar":
      return profileFavoriteIdsMock.length;
    case "sequencia":
      return profileStreakMock;
    default:
      return 0;
  }
}

/**
 * Quando a conquista foi obtida.
 *
 * Para critério de visita a data sai da própria visita que cruzou o limiar —
 * é o que o motor de concessão faria. Os outros eventos não têm evento datado
 * no mock, então caem na âncora.
 *
 * @param achievement Conquista do catálogo.
 * @returns Data ISO, ou `null` quando ainda travada.
 */
function achievedAt(achievement: AchievementMock): string | null {
  if (currentProgress(achievement) < achievement.quantidade) return null;

  if (achievement.evento !== "visitar") return PROFILE_ANCHOR;

  return qualifyingVisits(achievement)[achievement.quantidade - 1].data;
}

export interface ProfileAchievement {
  /** O que o `AchievementBadge` desenha. */
  badge: UserAchievement;
  nome: string;
  descricao: string;
  /** Frase do critério — "Visitar 5 lugares da categoria Cafeteria". */
  criterio: string;
  atual: number;
  meta: number;
}

/**
 * Conquistas do usuário: as obtidas com data, as travadas com o que falta.
 *
 * Fora da galeria ficam as desativadas do catálogo e as de evento `seguir` —
 * `Segue` saiu do produto em 2026-08-17, então cobrar "siga 15 pessoas" seria
 * pedir algo que a plataforma não faz mais.
 */
export function profileAchievements(): ProfileAchievement[] {
  return achievementsMock
    .filter(
      (achievement) => achievement.ativa && achievement.evento !== "seguir",
    )
    .map((achievement) => {
      const atual = currentProgress(achievement);
      const meta = achievement.quantidade;
      const obtidaEm = achievedAt(achievement);

      return {
        badge: {
          id: achievement.id,
          name: achievement.nome,
          trigger: ACHIEVEMENT_EVENTS[achievement.evento].trigger,
          icon: achievement.icone,
          color: achievement.cor,
          progress: Math.min(100, Math.round((atual / meta) * 100)),
          rarity: achievement.raridade,
          achievedAt: obtidaEm,
        },
        nome: achievement.nome,
        descricao: achievement.descricao,
        criterio:
          formatCriterion({
            evento: achievement.evento,
            quantidade: achievement.quantidade,
            tipoAlvo: achievement.tipoAlvo,
            alvo: achievement.alvo,
          }) ?? achievement.descricao,
        atual,
        meta,
      };
    });
}

/** As obtidas, da mais recente para a mais antiga. */
export function profileUnlockedAchievements(): ProfileAchievement[] {
  return profileAchievements()
    .filter((item) => item.badge.achievedAt !== null)
    .sort((a, b) =>
      (b.badge.achievedAt ?? "").localeCompare(a.badge.achievedAt ?? ""),
    );
}

/** As travadas, da mais perto de sair para a mais distante. */
export function profileLockedAchievements(): ProfileAchievement[] {
  return profileAchievements()
    .filter((item) => item.badge.achievedAt === null)
    .sort((a, b) => (b.badge.progress ?? 0) - (a.badge.progress ?? 0));
}
