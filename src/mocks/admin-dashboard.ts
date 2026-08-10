/**
 * Dados fictícios do dashboard admin.
 *
 * Nenhum destes números vem do banco: os contadores de fila dependem dos
 * módulos irmãos (`moderation`, `reports`, `businesses`), e as séries
 * dependem de um endpoint agregado que não existe — ver
 * `docs/todo/admin/dashboard.md`.
 *
 * Sai daqui quando `GET /api/admin/stats` existir.
 */

/** Fila de trabalho do admin — um card de "despachar isto" com contador. */
export interface AttentionQueueMock {
  label: string;
  /** Para onde o atalho leva — a tela onde a ação acontece. */
  href: string;
  pendentes: number;
  /**
   * Idade do item mais antigo, em dias. Formatado por `formatWaitingDays` —
   * dias, e não data, para o texto não depender de `now`.
   */
  aguardandoHaDias: number;
}

export const attentionQueuesMock: AttentionQueueMock[] = [
  {
    label: "Moderação de pontos",
    href: "/admin/moderation",
    pendentes: 12,
    aguardandoHaDias: 9,
  },
  {
    label: "Reivindicações",
    href: "/admin/businesses",
    pendentes: 3,
    aguardandoHaDias: 2,
  },
  {
    label: "Denúncias abertas",
    href: "/admin/reports",
    pendentes: 5,
    aguardandoHaDias: 14,
  },
  {
    label: "Feedback não lido",
    href: "/admin/reports",
    pendentes: 7,
    aguardandoHaDias: 1,
  },
];

/** Fatia da rosca de segmentação — categoria e quantos pontos tem. */
export interface PlaceSegmentMock {
  categoria: string;
  /** Chave do `ChartConfig`; define a cor via `--color-{key}`. */
  key: string;
  total: number;
}

export const placeSegmentsMock: PlaceSegmentMock[] = [
  { categoria: "Gastronomia", key: "gastronomia", total: 1411 },
  { categoria: "Parque", key: "parque", total: 670 },
  { categoria: "Bar", key: "bar", total: 512 },
  { categoria: "Cafeteria", key: "cafeteria", total: 280 },
  { categoria: "Outros", key: "outros", total: 194 },
];

/** Faixa da barra de lugares novos — quanto de cada status na semana. */
export interface NewPlaceStageMock {
  label: string;
  key: string;
  total: number;
}

export const newPlacesWeekMock = {
  total: 167,
  /** Percentual da meta semanal de cadastros. */
  metaAtingida: 80,
  variacaoSemanal: 35,
  stages: [
    { label: "Aprovados", key: "aprovados", total: 94 },
    { label: "Em moderação", key: "moderacao", total: 38 },
    { label: "Incompletos", key: "incompletos", total: 24 },
    { label: "Rejeitados", key: "rejeitados", total: 11 },
  ] satisfies NewPlaceStageMock[],
};

/** Card de número seco com variação sobre a semana anterior. */
export interface MetricCardMock {
  label: string;
  hint: string;
  valor: number;
  variacaoSemanal: number;
}

export const metricCardsMock: MetricCardMock[] = [
  {
    label: "Avaliações",
    hint: "Avaliações publicadas nos últimos 7 dias, incluindo as que ainda estão em moderação.",
    valor: 254,
    variacaoSemanal: 35,
  },
  {
    label: "Novos usuários",
    hint: "Contas criadas nos últimos 7 dias, sem contar as que nunca confirmaram o e-mail.",
    valor: 189,
    variacaoSemanal: 12,
  },
];

/** Ponto semanal do gráfico de cadastros. */
export interface WeeklySignupMock {
  /** Rótulo do eixo X, já formatado — ex.: "05/04". */
  semana: string;
  pontos: number;
  usuarios: number;
}

export const weeklySignupsMock: WeeklySignupMock[] = [
  { semana: "18/05", pontos: 42, usuarios: 118 },
  { semana: "25/05", pontos: 51, usuarios: 96 },
  { semana: "01/06", pontos: 38, usuarios: 134 },
  { semana: "08/06", pontos: 66, usuarios: 121 },
  { semana: "15/06", pontos: 59, usuarios: 158 },
  { semana: "22/06", pontos: 74, usuarios: 143 },
  { semana: "29/06", pontos: 61, usuarios: 177 },
  { semana: "06/07", pontos: 88, usuarios: 162 },
  { semana: "13/07", pontos: 79, usuarios: 195 },
  { semana: "20/07", pontos: 103, usuarios: 184 },
  { semana: "27/07", pontos: 94, usuarios: 221 },
  { semana: "03/08", pontos: 121, usuarios: 209 },
];

/** Ponto diário do gráfico de qualidade de dados. */
export interface DataQualityPointMock {
  /** ISO `yyyy-MM-dd` — o eixo formata na hora de renderizar. */
  data: string;
  /** Pontos com foto, categoria e descrição preenchidos. */
  completos: number;
  /** Pontos com pelo menos um desses campos vazio. */
  incompletos: number;
}

/** Data-âncora da série. Fixa de propósito: `Date.now()` faria o gráfico
 * mudar a cada build e quebrar a hidratação. */
const SERIES_ANCHOR = "2026-08-09";
const SERIES_DAYS = 90;

/**
 * Ruído determinístico em `[0, 1)`. Não é aleatório de verdade — precisa
 * render igual no servidor e no cliente, então `Math.random` está fora.
 */
function noise(seed: number): number {
  return (Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function buildDataQualitySeries(): DataQualityPointMock[] {
  const anchor = new Date(`${SERIES_ANCHOR}T00:00:00Z`);

  return Array.from({ length: SERIES_DAYS }, (_, index) => {
    const date = new Date(anchor);
    date.setUTCDate(date.getUTCDate() - (SERIES_DAYS - 1 - index));

    // Tendência de alta suave + oscilação semanal + ruído, para a série ter
    // forma sem depender de dado real.
    const trend = 120 + index * 1.4;
    const weekly = Math.sin((index / 7) * Math.PI * 2) * 18;
    const jitter = Math.abs(noise(index + 1)) * 40;

    const completos = Math.round(trend + weekly + jitter);
    const incompletos = Math.round(
      completos * (0.42 - index * 0.002) + Math.abs(noise(index + 97)) * 12,
    );

    return {
      data: date.toISOString().slice(0, 10),
      completos,
      incompletos,
    };
  });
}

export const dataQualitySeriesMock: DataQualityPointMock[] =
  buildDataQualitySeries();
