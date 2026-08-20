/**
 * Feed fictício da cidade.
 *
 * Nada disto existe no banco: `Analise`, `Visita`, `GanhaConquista` e a coluna
 * `status` do ponto estavam no modelo do TCC e nunca saíram do papel. Ver
 * `docs/todo/user/feed.md`.
 *
 * O conjunto foi montado para cada **motivo** e cada **tipo de item** ter caso
 * visível — inclusive os incômodos: uma avaliação nota 3 com crítica dura, uma
 * rajada de avaliações no mesmo lugar (que a tela precisa agrupar em vez de
 * repetir) e itens de bairro nenhum ligado ao perfil, para o "menos disso"
 * ter o que silenciar.
 *
 * Sem `Math.random()` nem `Date.now()`: o tempo é `diasAtras` + `hora` fixa,
 * porque data relativa ao agora renderiza diferente no servidor e no cliente.
 */

import type { AchievementIconKey } from "@/constants/achievements";
import type { FeedReason } from "@/constants/feed";

/**
 * Data-âncora do conjunto. Fixa porque `Date.now()` mudaria o feed a cada
 * build e quebraria a hidratação; `diasAtras` é contado a partir daqui.
 */
export const FEED_ANCHOR = "2026-08-17";

/**
 * Data absoluta de um item, para quem precisa de data e não de "há N dias".
 *
 * @param diasAtras Dias completos até a âncora.
 * @returns ISO `yyyy-MM-dd`.
 */
export function feedItemDate(diasAtras: number): string {
  const date = new Date(`${FEED_ANCHOR}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - diasAtras);
  return date.toISOString().slice(0, 10);
}

export type FeedItemKind =
  | "avaliacao"
  | "movimento"
  | "novo-ponto"
  | "conquista"
  | "marco"
  | "curadoria";

/** Completa a frase "Menos ..." do menu de ajuste do card. */
export const FEED_KIND_LABEL: Record<FeedItemKind, string> = {
  avaliacao: "avaliações",
  movimento: "movimento de lugares",
  "novo-ponto": "pontos novos",
  conquista: "conquistas",
  marco: "marcos de lugares",
  curadoria: "pautas da equipe",
};

export interface FeedAuthorMock {
  nome: string;
  iniciais: string;
  /** O título vem daqui — não existe nível. Ver `@/constants/explorer-titles`. */
  conquistas: number;
  /** Ausente de propósito em alguns: exercita o fallback de inicial. */
  avatarUrl?: string;
  /** Selo de explorador verificado — critério ainda em aberto no backlog. */
  verificado?: boolean;
}

export interface FeedPlaceMock {
  id: number;
  nome: string;
  bairro: string;
  categoria: string;
  fotoUrl: string;
}

const photo = (seed: number) => `https://picsum.photos/seed/${seed}/640/400`;
const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

const AUTHORS = {
  ana: {
    nome: "Ana Paula Ferraz",
    iniciais: "AF",
    conquistas: 9,
    avatarUrl: avatar("ana"),
    verificado: true,
  },
  bruno: { nome: "Bruno Okamoto", iniciais: "BO", conquistas: 4 },
  carla: {
    nome: "Carla Menezes",
    iniciais: "CM",
    conquistas: 4,
    avatarUrl: avatar("carla"),
  },
  silvana: {
    nome: "Silvana D. Moraes",
    iniciais: "SM",
    conquistas: 14,
    avatarUrl: avatar("silvana"),
    verificado: true,
  },
  edson: { nome: "Edson Kimura", iniciais: "EK", conquistas: 5 },
  tatiane: {
    nome: "Tatiane Lopes",
    iniciais: "TL",
    conquistas: 1,
    avatarUrl: avatar("tatiane"),
  },
  jorge: {
    nome: "Jorge Tanaka",
    iniciais: "JT",
    conquistas: 8,
    avatarUrl: avatar("jorge"),
    verificado: true,
  },
  beatriz: { nome: "Beatriz Camargo", iniciais: "BC", conquistas: 4 },
  hugo: {
    nome: "Hugo Bandeira",
    iniciais: "HB",
    conquistas: 3,
    avatarUrl: avatar("hugo"),
  },
  rogerio: { nome: "Rogério Tavares", iniciais: "RT", conquistas: 3 },
  ivete: {
    nome: "Ivete Ramos",
    iniciais: "IR",
    conquistas: 5,
    avatarUrl: avatar("ivete"),
  },
  clovis: { nome: "Clóvis Bertolini", iniciais: "CB", conquistas: 5 },
  marcia: { nome: "Márcia Bueno", iniciais: "MB", conquistas: 2 },
} satisfies Record<string, FeedAuthorMock>;

/** Os mesmos pontos de `src/mocks/markers.ts`, com os ids de `admin-reviews`. */
const PLACES = {
  cabocafe: {
    id: 1,
    nome: "Cabocafé",
    bairro: "Santa Rosália",
    categoria: "Cafeteria",
    fotoUrl: photo(14),
  },
  aguas: {
    id: 2,
    nome: "Parque das Águas",
    bairro: "Jardim Abaeté",
    categoria: "Parque",
    fotoUrl: photo(16),
  },
  zeca: {
    id: 3,
    nome: "Bar do Zeca",
    bairro: "Centro",
    categoria: "Bar",
    fotoUrl: photo(23),
  },
  sebo: {
    id: 4,
    nome: "Sebo da Rua XV",
    bairro: "Centro",
    categoria: "Cultura",
    fotoUrl: photo(31),
  },
  cantina: {
    id: 5,
    nome: "Cantina da Vila",
    bairro: "Vila Hortência",
    categoria: "Gastronomia",
    fotoUrl: photo(42),
  },
  mirante: {
    id: 6,
    nome: "Mirante do Ipanema",
    bairro: "Ipanema das Pedras",
    categoria: "Lazer",
    fotoUrl: photo(57),
  },
  campolim: {
    id: 7,
    nome: "Parque Campolim",
    bairro: "Parque Campolim",
    categoria: "Parque",
    fotoUrl: photo(11),
  },
  cachorrodromo: {
    id: 8,
    nome: "Cachorródromo do Éden",
    bairro: "Éden",
    categoria: "Lazer",
    fotoUrl: photo(12),
  },
  largo: {
    id: 10,
    nome: "Largo do Café",
    bairro: "Centro",
    categoria: "Cafeteria",
    fotoUrl: photo(15),
  },
  manga: {
    id: 11,
    nome: "Feira da Manga",
    bairro: "Vila Haro",
    categoria: "Compras",
    fotoUrl: photo(17),
  },
  estacao: {
    id: 12,
    nome: "Padaria Estação",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
    fotoUrl: photo(18),
  },
  museu: {
    id: 13,
    nome: "Museu Ferroviário",
    bairro: "Vila Hortência",
    categoria: "Cultura",
    fotoUrl: photo(19),
  },
  bosque: {
    id: 15,
    nome: "Bosque dos Ipês",
    bairro: "Jardim Vera Cruz",
    categoria: "Parque",
    fotoUrl: photo(21),
  },
  esquina: {
    id: 16,
    nome: "Café da Esquina Velha",
    bairro: "Além Ponte",
    categoria: "Cafeteria",
    fotoUrl: photo(22),
  },
  galeria: {
    id: 17,
    nome: "Galeria Rio Branco",
    bairro: "Centro",
    categoria: "Compras",
    fotoUrl: photo(24),
  },
} satisfies Record<string, FeedPlaceMock>;

interface FeedItemBase {
  id: string;
  kind: FeedItemKind;
  /** Dias completos até hoje. `0` é hoje, `1` é ontem. */
  diasAtras: number;
  /** `HH:mm` — desempata dentro do dia e aparece no card. */
  hora: string;
  motivo: FeedReason;
  /** O que casou o motivo: bairro, categoria ou nome do lugar salvo. */
  motivoDetalhe?: string;
  /**
   * Peso do ranking, de 0 a 100. No mock é um número escrito à mão; no backend
   * é decaimento por idade multiplicado pelo peso da fonte — a ordenação
   * "Mais relevantes" só depende de ser comparável, não de ser precisa.
   */
  relevancia: number;
}

export interface FeedReviewItem extends FeedItemBase {
  kind: "avaliacao";
  autor: FeedAuthorMock;
  local: FeedPlaceMock;
  /** De 1 a 5. */
  nota: number;
  corpo: string;
  /** Foto anexada à avaliação, quando houver. */
  fotoUrl?: string;
  uteis: number;
}

/**
 * Rajada de atividade num mesmo lugar, já agregada.
 *
 * Existe para o feed não repetir cinco cards do Cabocafé numa tarde: quando o
 * mesmo ponto acumula eventos do mesmo tipo na mesma janela, o interessante é
 * o volume, não cada linha.
 */
export interface FeedBurstItem extends FeedItemBase {
  kind: "movimento";
  local: FeedPlaceMock;
  tipo: "avaliacoes" | "visitas";
  total: number;
  /** Só em `avaliacoes` — média das notas da janela. */
  notaMedia?: number;
  /** Quem participou, para o card mostrar os rostos. */
  participantes: FeedAuthorMock[];
  /** Janela do agrupamento, em texto: "nas últimas 6 horas". */
  janela: string;
}

export interface FeedNewPlaceItem extends FeedItemBase {
  kind: "novo-ponto";
  local: FeedPlaceMock;
  /** Quem cadastrou o ponto. */
  autor: FeedAuthorMock;
  sobre: string;
}

export interface FeedAchievementItem extends FeedItemBase {
  kind: "conquista";
  autor: FeedAuthorMock;
  conquista: {
    nome: string;
    icon: AchievementIconKey;
    /** Hex da paleta de `@/constants/achievements`. */
    cor: string;
    criterio: string;
  };
  /** Onde ela fechou, quando a conquista é ancorada em lugar. */
  local?: FeedPlaceMock;
}

/** Marco de um lugar — o que o próprio ponto conquistou, não uma pessoa. */
export interface FeedMilestoneItem extends FeedItemBase {
  kind: "marco";
  local: FeedPlaceMock;
  titulo: string;
  detalhe: string;
}

/** Roteiro montado pela equipe: o editorial que não depende de atividade. */
export interface FeedCurationItem extends FeedItemBase {
  kind: "curadoria";
  /** Casa com o slug de `src/mocks/stories.ts` — o card leva à pauta inteira. */
  slug: string;
  titulo: string;
  chamada: string;
  fotoUrl: string;
  editor: string;
  locais: FeedPlaceMock[];
}

export type FeedItemMock =
  | FeedReviewItem
  | FeedBurstItem
  | FeedNewPlaceItem
  | FeedAchievementItem
  | FeedMilestoneItem
  | FeedCurationItem;

export const feedItemsMock: FeedItemMock[] = [
  // --- Hoje ---
  {
    id: "mov-cabocafe",
    kind: "movimento",
    diasAtras: 0,
    hora: "17:10",
    motivo: "salvo",
    motivoDetalhe: "Cabocafé",
    relevancia: 97,
    local: PLACES.cabocafe,
    tipo: "avaliacoes",
    total: 4,
    notaMedia: 4.9,
    participantes: [AUTHORS.ana, AUTHORS.edson, AUTHORS.tatiane, AUTHORS.jorge],
    janela: "nas últimas 6 horas",
  },
  {
    id: "av-largo",
    kind: "avaliacao",
    diasAtras: 0,
    hora: "20:05",
    motivo: "perto",
    motivoDetalhe: "Centro, 1,4 km de você",
    relevancia: 92,
    autor: AUTHORS.ana,
    local: PLACES.largo,
    nota: 5,
    corpo:
      "Cheguei na quinta sem saber do samba e acabei ficando até fechar. Mesa na calçada, ninguém cobra couvert e o pastel de queijo sai na hora. Se for em grupo, chega antes das oito — depois disso só sobra lugar em pé.",
    fotoUrl: photo(15),
    uteis: 12,
  },
  {
    id: "np-bosque",
    kind: "novo-ponto",
    diasAtras: 0,
    hora: "09:20",
    motivo: "categoria",
    motivoDetalhe: "Parque",
    relevancia: 86,
    local: PLACES.bosque,
    autor: AUTHORS.carla,
    sobre:
      "Mata fechada com trilha curta e florada de ipê que para o bairro inteiro em agosto.",
  },
  {
    id: "av-aguas",
    kind: "avaliacao",
    diasAtras: 0,
    hora: "08:15",
    motivo: "categoria",
    motivoDetalhe: "Parque",
    relevancia: 74,
    autor: AUTHORS.silvana,
    local: PLACES.aguas,
    nota: 4,
    corpo:
      "Pista boa e sombra de verdade, mas a torneira da entrada estava quebrada de novo. Leve garrafa cheia de casa.",
    uteis: 5,
  },
  {
    id: "cq-bruno",
    kind: "conquista",
    diasAtras: 0,
    hora: "23:40",
    motivo: "cidade",
    relevancia: 52,
    autor: AUTHORS.bruno,
    conquista: {
      nome: "Noite Sorocabana",
      icon: "moon-star",
      cor: "#7c3aed",
      criterio: "Avaliar 5 locais depois das 22h",
    },
    local: PLACES.zeca,
  },

  // --- Ontem ---
  {
    id: "av-cabocafe",
    kind: "avaliacao",
    diasAtras: 1,
    hora: "16:30",
    motivo: "salvo",
    motivoDetalhe: "Cabocafé",
    relevancia: 93,
    autor: AUTHORS.jorge,
    local: PLACES.cabocafe,
    nota: 5,
    corpo:
      "O café com rapadura não está no cardápio e é o melhor pedido da casa — o barista faz se você perguntar. Bolo de fubá sai às quatro e acaba rápido.",
    fotoUrl: photo(71),
    uteis: 21,
  },
  {
    id: "cur-cafes",
    kind: "curadoria",
    diasAtras: 1,
    hora: "10:00",
    motivo: "curadoria",
    relevancia: 84,
    slug: "tres-cafes-para-trabalhar",
    titulo: "Três cafés para trabalhar sem gastar o dia inteiro",
    chamada:
      "Tomada em quase toda mesa, wi-fi que aguenta chamada de vídeo e ninguém olhando torto para quem fica duas horas. Roteiro montado com o que os exploradores marcaram como “bom para trabalhar”.",
    fotoUrl: photo(22),
    editor: "Equipe Soromaps",
    locais: [PLACES.cabocafe, PLACES.largo, PLACES.esquina],
  },
  {
    id: "mov-campolim",
    kind: "movimento",
    diasAtras: 1,
    hora: "07:50",
    motivo: "categoria",
    motivoDetalhe: "Parque",
    relevancia: 70,
    local: PLACES.campolim,
    tipo: "visitas",
    total: 6,
    participantes: [AUTHORS.silvana, AUTHORS.hugo, AUTHORS.beatriz],
    janela: "na manhã de ontem",
  },
  {
    id: "mc-zeca",
    kind: "marco",
    diasAtras: 1,
    hora: "19:00",
    motivo: "cidade",
    relevancia: 61,
    local: PLACES.zeca,
    titulo: "Chegou a 100 avaliações",
    detalhe:
      "Primeiro bar do Centro a passar da marca. Média de 4,4 depois de cem opiniões — o bolinho de bacalhau aparece em 38 delas.",
  },
  {
    id: "av-manga",
    kind: "avaliacao",
    diasAtras: 1,
    hora: "11:20",
    motivo: "cidade",
    relevancia: 44,
    autor: AUTHORS.tatiane,
    local: PLACES.manga,
    nota: 4,
    corpo:
      "Fui às sete e peguei a barraca de pastel sem fila. Depois das nove a rua fica intransitável com carrinho de feira.",
    uteis: 2,
  },

  // --- Dois dias ---
  {
    id: "mc-cabocafe",
    kind: "marco",
    diasAtras: 2,
    hora: "18:05",
    motivo: "salvo",
    motivoDetalhe: "Cabocafé",
    relevancia: 88,
    local: PLACES.cabocafe,
    titulo: "Virou a cafeteria mais bem avaliada de Santa Rosália",
    detalhe:
      "Passou o Café da Esquina Velha por 0,1 depois da rajada de avaliações desta semana.",
  },
  {
    id: "av-esquina",
    kind: "avaliacao",
    diasAtras: 2,
    hora: "09:45",
    motivo: "categoria",
    motivoDetalhe: "Cafeteria",
    relevancia: 79,
    autor: AUTHORS.beatriz,
    local: PLACES.esquina,
    nota: 5,
    corpo:
      "São seis lugares, então ou você chega às sete ou pega o café para viagem. O croissant acabou às nove e meia no sábado — dá para encomendar na véspera.",
    uteis: 7,
  },
  {
    id: "av-sebo",
    kind: "avaliacao",
    diasAtras: 2,
    hora: "15:10",
    motivo: "perto",
    motivoDetalhe: "Centro, 1,9 km de você",
    relevancia: 58,
    autor: AUTHORS.rogerio,
    local: PLACES.sebo,
    nota: 4,
    corpo:
      "O segundo andar tem uma sala inteira de quadrinhos que não aparece em foto nenhuma. Pedi um título esgotado e o dono achou em dois minutos.",
    uteis: 9,
  },
  {
    id: "cq-carla",
    kind: "conquista",
    diasAtras: 2,
    hora: "12:30",
    motivo: "cidade",
    relevancia: 47,
    autor: AUTHORS.carla,
    conquista: {
      nome: "Guia Local",
      icon: "compass",
      cor: "#4d7c0f",
      criterio: "Cadastrar 5 pontos aprovados no mesmo bairro",
    },
    local: PLACES.cachorrodromo,
  },

  // --- Esta semana ---
  {
    id: "cur-domingo",
    kind: "curadoria",
    diasAtras: 4,
    hora: "08:00",
    motivo: "curadoria",
    relevancia: 68,
    slug: "o-que-abre-cedo-no-domingo",
    titulo: "O que abre cedo no domingo",
    chamada:
      "A pergunta mais repetida no mapa em fim de semana. Três lugares que já estão funcionando antes das oito, conferidos por visita registrada este mês.",
    fotoUrl: photo(17),
    editor: "Equipe Soromaps",
    locais: [PLACES.manga, PLACES.campolim, PLACES.estacao],
  },
  {
    id: "mov-mirante",
    kind: "movimento",
    diasAtras: 5,
    hora: "18:20",
    motivo: "cidade",
    relevancia: 63,
    local: PLACES.mirante,
    tipo: "visitas",
    total: 9,
    participantes: [AUTHORS.clovis, AUTHORS.ivete, AUTHORS.bruno],
    janela: "no pôr do sol de sábado",
  },
  {
    id: "av-museu",
    kind: "avaliacao",
    diasAtras: 5,
    hora: "14:00",
    motivo: "cidade",
    relevancia: 50,
    autor: AUTHORS.clovis,
    local: PLACES.museu,
    nota: 5,
    corpo:
      "Entrada gratuita e a visita leva uma hora sem pressa. Fui numa terça e estava vazio; sexta tem escola em visita o dia todo.",
    fotoUrl: photo(19),
    uteis: 15,
  },
  {
    id: "np-cachorrodromo",
    kind: "novo-ponto",
    diasAtras: 6,
    hora: "16:40",
    motivo: "cidade",
    relevancia: 46,
    local: PLACES.cachorrodromo,
    autor: AUTHORS.hugo,
    sobre:
      "Área cercada com portão duplo e divisão por porte, bebedouro e sombra o dia todo.",
  },
  {
    id: "av-cantina",
    kind: "avaliacao",
    diasAtras: 6,
    hora: "13:15",
    motivo: "cidade",
    relevancia: 38,
    autor: AUTHORS.marcia,
    local: PLACES.cantina,
    nota: 3,
    corpo:
      "A massa é ótima, mas domingo no almoço a espera passou de quarenta minutos com a fila na calçada, no sol. Voltarei em dia de semana.",
    uteis: 18,
  },

  // --- Antes disso ---
  {
    id: "mov-largo",
    kind: "movimento",
    diasAtras: 8,
    hora: "21:30",
    motivo: "perto",
    motivoDetalhe: "Centro, 1,4 km de você",
    relevancia: 42,
    local: PLACES.largo,
    tipo: "avaliacoes",
    total: 5,
    notaMedia: 4.6,
    participantes: [AUTHORS.ana, AUTHORS.rogerio, AUTHORS.marcia],
    janela: "na quinta do samba",
  },
  {
    id: "av-galeria",
    kind: "avaliacao",
    diasAtras: 9,
    hora: "10:50",
    motivo: "cidade",
    relevancia: 31,
    autor: AUTHORS.ivete,
    local: PLACES.galeria,
    nota: 4,
    corpo:
      "Loja de disco, chaveiro e conserto de relógio no mesmo corredor. Fecha às seis, então não adianta passar depois do trabalho.",
    uteis: 4,
  },
  {
    id: "cq-ana",
    kind: "conquista",
    diasAtras: 10,
    hora: "19:15",
    motivo: "cidade",
    relevancia: 28,
    autor: AUTHORS.ana,
    conquista: {
      nome: "Pé na Estrada",
      icon: "footprints",
      cor: "#0f766e",
      criterio: "Registrar visita em 10 bairros diferentes",
    },
  },
  {
    id: "mc-estacao",
    kind: "marco",
    diasAtras: 11,
    hora: "07:30",
    motivo: "cidade",
    relevancia: 26,
    local: PLACES.estacao,
    titulo: "Lugar mais visitado antes das 9h",
    detalhe:
      "Lidera as visitas registradas na primeira hora do dia há três semanas seguidas.",
  },
];

/**
 * O recorte que alimenta o feed desta pessoa.
 *
 * É o substituto do "quem você segue": no lugar de uma lista de gente, o feed
 * é montado a partir de bairro, raio, categorias exploradas e lugares salvos —
 * tudo derivável de `Visita` e `Favorita`, sem tabela nova de relacionamento.
 */
export const feedProfileMock = {
  bairro: "Santa Rosália",
  raioKm: 3,
  categoriasFavoritas: ["Cafeteria", "Parque"],
  lugaresSalvos: 9,
  visitasRegistradas: 24,
};

/** Desafio semanal — a ponta do pilar de gamificação que aparece no feed. */
export const feedChallengeMock = {
  titulo: "Rota das padarias",
  descricao:
    "Registre visita em 3 padarias diferentes da zona sul e desbloqueie a conquista Paladar Local.",
  atual: 1,
  total: 3,
  recompensa: "Paladar Local",
  diasRestantes: 4,
};

export interface FeedContributorMock {
  nome: string;
  iniciais: string;
  avatarUrl?: string;
  conquistas: number;
  /** Contribuições na semana — avaliações, visitas e pontos somados. */
  contribuicoes: number;
  bairro: string;
}

/**
 * Exploradores em destaque da semana.
 *
 * Ranking por contribuição, não por seguidores: sem grafo social, o que
 * qualifica alguém é o que a pessoa registrou. O recorte por bairro vem do
 * módulo de Comunidade — em ranking geral só os dez primeiros existem; por
 * bairro, quase todo mundo é destaque de algo.
 */
export const feedContributorsMock: FeedContributorMock[] = [
  {
    nome: "Silvana D. Moraes",
    iniciais: "SM",
    avatarUrl: avatar("silvana"),
    conquistas: 14,
    contribuicoes: 23,
    bairro: "Centro",
  },
  {
    nome: "Ana Paula Ferraz",
    iniciais: "AF",
    avatarUrl: avatar("ana"),
    conquistas: 9,
    contribuicoes: 19,
    bairro: "Santa Rosália",
  },
  {
    nome: "Jorge Tanaka",
    iniciais: "JT",
    avatarUrl: avatar("jorge"),
    conquistas: 8,
    contribuicoes: 15,
    bairro: "Vila Hortência",
  },
  {
    nome: "Carla Menezes",
    iniciais: "CM",
    avatarUrl: avatar("carla"),
    conquistas: 4,
    contribuicoes: 11,
    bairro: "Éden",
  },
];

export interface FeedTrendingPlaceMock {
  id: number;
  nome: string;
  bairro: string;
  /** Avaliações e visitas novas nos últimos sete dias. */
  novidades: number;
}

/** Lugares com mais movimento na semana — a lista completa é `/discover`. */
export const feedTrendingMock: FeedTrendingPlaceMock[] = [
  { id: 1, nome: "Cabocafé", bairro: "Santa Rosália", novidades: 14 },
  { id: 3, nome: "Bar do Zeca", bairro: "Centro", novidades: 11 },
  {
    id: 6,
    nome: "Mirante do Ipanema",
    bairro: "Ipanema das Pedras",
    novidades: 9,
  },
  { id: 10, nome: "Largo do Café", bairro: "Centro", novidades: 7 },
];
