/**
 * Exploradores fictícios da comunidade.
 *
 * `Analise`, `Visita` e `GanhaConquista` não existem no banco, então nenhum
 * destes contadores tem de onde sair — e é deles que dependem o ranking, o
 * título e o selo de verificado. Ver `docs/todo/user/community.md`.
 *
 * As mesmas pessoas de `src/mocks/feed.ts` e `src/mocks/admin-reviews.ts`, com
 * os mesmos números de conquista: o Jorge é "Guia local · 8 conquistas" nas
 * três telas. O conjunto tem, de propósito, quem **não** é verificado — conta
 * nova, ninguém com avaliação removida seria uma amostra mentirosa.
 */

import type { ExplorerStats } from "@/constants/verification";

export interface ExplorerReviewMock {
  local: { id: number; nome: string; bairro: string };
  nota: number;
  corpo: string;
  diasAtras: number;
  uteis: number;
}

export interface ExplorerMock extends ExplorerStats {
  id: number;
  nome: string;
  iniciais: string;
  avatarUrl?: string;
  bairro: string;
  /** Mês de entrada, já formatado — não há coluna de data para derivar. */
  desde: string;
  conquistas: number;
  pontosCadastrados: number;
  /** Contribuições dos últimos sete dias — critério do ranking semanal. */
  contribuicoesSemana: number;
  bio?: string;
  ultimasAvaliacoes: ExplorerReviewMock[];
}

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/160/160`;

export const explorersMock: ExplorerMock[] = [
  {
    id: 1,
    nome: "Silvana D. Moraes",
    iniciais: "SM",
    avatarUrl: avatar("silvana"),
    bairro: "Centro",
    desde: "março de 2026",
    visitas: 61,
    avaliacoes: 34,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 5,
    conquistas: 14,
    pontosCadastrados: 7,
    contribuicoesSemana: 23,
    bio: "Ando o Centro a pé todo dia. Anoto horário de pico e onde tem tomada.",
    ultimasAvaliacoes: [
      {
        local: { id: 4, nome: "Sebo da Rua XV", bairro: "Centro" },
        nota: 5,
        corpo:
          "O segundo andar é o motivo de ir. Peça ajuda ao dono em vez de garimpar sozinho — ele acha em dois minutos.",
        diasAtras: 3,
        uteis: 12,
      },
      {
        local: { id: 2, nome: "Parque das Águas", bairro: "Jardim Abaeté" },
        nota: 4,
        corpo:
          "Pista boa e sombra de verdade, mas a torneira da entrada estava quebrada de novo.",
        diasAtras: 0,
        uteis: 5,
      },
    ],
  },
  {
    id: 2,
    nome: "Ana Paula Ferraz",
    iniciais: "AF",
    avatarUrl: avatar("ana"),
    bairro: "Santa Rosália",
    desde: "abril de 2026",
    visitas: 48,
    avaliacoes: 29,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 4,
    conquistas: 9,
    pontosCadastrados: 3,
    contribuicoesSemana: 19,
    bio: "Café, samba de quinta e qualquer lugar que abra antes das sete.",
    ultimasAvaliacoes: [
      {
        local: { id: 10, nome: "Largo do Café", bairro: "Centro" },
        nota: 5,
        corpo:
          "Cheguei na quinta sem saber do samba e fiquei até fechar. Se for em grupo, chega antes das oito.",
        diasAtras: 0,
        uteis: 12,
      },
    ],
  },
  {
    id: 3,
    nome: "Jorge Tanaka",
    iniciais: "JT",
    avatarUrl: avatar("jorge"),
    bairro: "Vila Hortência",
    desde: "abril de 2026",
    visitas: 39,
    avaliacoes: 21,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 4,
    conquistas: 8,
    pontosCadastrados: 5,
    contribuicoesSemana: 15,
    bio: "Procuro o pedido que não está no cardápio. Costuma ser o melhor.",
    ultimasAvaliacoes: [
      {
        local: { id: 1, nome: "Cabocafé", bairro: "Santa Rosália" },
        nota: 5,
        corpo:
          "O café com rapadura não está no cardápio e é o melhor pedido da casa. Bolo de fubá sai às quatro.",
        diasAtras: 1,
        uteis: 21,
      },
    ],
  },
  {
    id: 4,
    nome: "Carla Menezes",
    iniciais: "CM",
    avatarUrl: avatar("carla"),
    bairro: "Éden",
    desde: "maio de 2026",
    visitas: 27,
    avaliacoes: 12,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 3,
    conquistas: 4,
    pontosCadastrados: 9,
    contribuicoesSemana: 11,
    bio: "Cadastro o que falta no mapa do meu bairro. Já foram nove.",
    ultimasAvaliacoes: [],
  },
  {
    id: 5,
    nome: "Clóvis Bertolini",
    iniciais: "CB",
    bairro: "Vila Hortência",
    desde: "maio de 2026",
    visitas: 22,
    avaliacoes: 14,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 3,
    conquistas: 5,
    pontosCadastrados: 1,
    contribuicoesSemana: 9,
    ultimasAvaliacoes: [
      {
        local: { id: 13, nome: "Museu Ferroviário", bairro: "Vila Hortência" },
        nota: 5,
        corpo:
          "Entrada gratuita e a visita leva uma hora sem pressa. Sexta tem escola em visita o dia todo.",
        diasAtras: 5,
        uteis: 15,
      },
    ],
  },
  {
    id: 6,
    nome: "Ivete Ramos",
    iniciais: "IR",
    avatarUrl: avatar("ivete"),
    bairro: "Centro",
    desde: "junho de 2026",
    visitas: 18,
    avaliacoes: 9,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 2,
    conquistas: 5,
    pontosCadastrados: 0,
    contribuicoesSemana: 8,
    ultimasAvaliacoes: [],
  },
  {
    id: 7,
    nome: "Edson Kimura",
    iniciais: "EK",
    bairro: "Vila Barcelona",
    desde: "junho de 2026",
    visitas: 15,
    avaliacoes: 8,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 2,
    conquistas: 5,
    pontosCadastrados: 2,
    contribuicoesSemana: 7,
    ultimasAvaliacoes: [],
  },
  {
    id: 8,
    nome: "Beatriz Camargo",
    iniciais: "BC",
    bairro: "Além Ponte",
    desde: "junho de 2026",
    visitas: 12,
    avaliacoes: 6,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 2,
    conquistas: 4,
    pontosCadastrados: 0,
    contribuicoesSemana: 6,
    ultimasAvaliacoes: [],
  },
  {
    id: 9,
    nome: "Hugo Bandeira",
    iniciais: "HB",
    avatarUrl: avatar("hugo"),
    bairro: "Éden",
    desde: "julho de 2026",
    visitas: 9,
    avaliacoes: 4,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 1,
    conquistas: 3,
    pontosCadastrados: 3,
    contribuicoesSemana: 5,
    ultimasAvaliacoes: [],
  },
  {
    id: 10,
    nome: "Rogério Tavares",
    iniciais: "RT",
    bairro: "Centro",
    desde: "julho de 2026",
    visitas: 11,
    avaliacoes: 7,
    // Uma removida: é o caso que mostra o selo caindo por conduta, não por volume.
    avaliacoesRemovidas: 1,
    mesesNaPlataforma: 1,
    conquistas: 3,
    pontosCadastrados: 0,
    contribuicoesSemana: 4,
    ultimasAvaliacoes: [],
  },
  {
    id: 11,
    nome: "Márcia Bueno",
    iniciais: "MB",
    bairro: "Vila Hortência",
    desde: "agosto de 2026",
    visitas: 6,
    avaliacoes: 2,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 1,
    conquistas: 2,
    pontosCadastrados: 0,
    contribuicoesSemana: 3,
    ultimasAvaliacoes: [],
  },
  {
    id: 12,
    nome: "Tatiane Lopes",
    iniciais: "TL",
    avatarUrl: avatar("tatiane"),
    bairro: "Vila Haro",
    desde: "agosto de 2026",
    // Conta nova: aparece na busca, no ranking, e sem selo.
    visitas: 3,
    avaliacoes: 1,
    avaliacoesRemovidas: 0,
    mesesNaPlataforma: 0,
    conquistas: 1,
    pontosCadastrados: 0,
    contribuicoesSemana: 2,
    ultimasAvaliacoes: [],
  },
];

/**
 * O usuário da sessão, para o ranking mostrar onde ele está.
 *
 * Fica fora de `explorersMock` porque a lista é "as outras pessoas": misturar
 * os dois obrigaria toda listagem a filtrar o próprio usuário.
 */
export const currentExplorerMock: ExplorerMock = {
  id: 0,
  nome: "Você",
  iniciais: "VC",
  bairro: "Santa Rosália",
  desde: "julho de 2026",
  visitas: 24,
  avaliacoes: 4,
  avaliacoesRemovidas: 0,
  mesesNaPlataforma: 1,
  conquistas: 5,
  pontosCadastrados: 1,
  contribuicoesSemana: 6,
  ultimasAvaliacoes: [],
};

/** Total de contribuições registradas — a métrica do ranking geral. */
export function totalContributions(explorer: ExplorerMock): number {
  return explorer.visitas + explorer.avaliacoes + explorer.pontosCadastrados;
}

/**
 * Bairros com pelo menos um explorador, para o recorte do ranking.
 *
 * O recorte por bairro é o ponto do módulo: no ranking geral só os dez
 * primeiros existem; por bairro, quase todo mundo é destaque de alguma coisa.
 */
export function explorerNeighborhoods(): string[] {
  return [
    ...new Set(
      [...explorersMock, currentExplorerMock].map((person) => person.bairro),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/**
 * Explorador por id, para a rota de perfil público.
 *
 * @param id Id do explorador.
 * @returns O explorador, ou `undefined` quando o id não existe.
 */
export function getExplorerMock(id: number): ExplorerMock | undefined {
  if (id === currentExplorerMock.id) return currentExplorerMock;
  return explorersMock.find((person) => person.id === id);
}
