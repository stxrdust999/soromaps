/**
 * Avaliações fictícias da plataforma inteira.
 *
 * `Analise` e `Comentario` não existem no banco — as duas estavam no modelo do
 * TCC e nunca saíram do papel. Ver `docs/todo/admin/reviews.md`.
 *
 * O conjunto foi montado para os três sinais terem caso visível: um local com
 * rajada de notas máximas, um autor que avaliou o mesmo lugar duas vezes e
 * dois textos promocionais. Sem isso a tela ficaria bonita e inútil de testar.
 */

import type { RemovalReason } from "@/constants/content-removal";

export type ReviewStatus = "publicada" | "removida";

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  publicada: "Publicada",
  removida: "Removida",
};

export interface ReviewAuthorMock {
  nome: string;
  iniciais: string;
  /** Título derivado da contagem de conquistas — não existe nível. */
  titulo: string;
}

export const reviewAuthorsMock = {
  ana: {
    nome: "Ana Paula Ferraz",
    iniciais: "AF",
    titulo: "Guia local · 9 conquistas",
  },
  bruno: {
    nome: "Bruno Okamoto",
    iniciais: "BO",
    titulo: "Explorador · 4 conquistas",
  },
  carla: {
    nome: "Carla Menezes",
    iniciais: "CM",
    titulo: "Explorador · 4 conquistas",
  },
  silvana: {
    nome: "Silvana D. Moraes",
    iniciais: "SM",
    titulo: "Guia local · 9 conquistas",
  },
  edson: {
    nome: "Edson Kimura",
    iniciais: "EK",
    titulo: "Explorador · 5 conquistas",
  },
  tatiane: {
    nome: "Tatiane Lopes",
    iniciais: "TL",
    titulo: "Novato · 1 conquista",
  },
  wanderson: {
    nome: "Wanderson Alves",
    iniciais: "WA",
    titulo: "Novato · 1 conquista",
  },
  rogerio: {
    nome: "Rogério Tavares",
    iniciais: "RT",
    titulo: "Explorador · 3 conquistas",
  },
  ivete: {
    nome: "Ivete Ramos",
    iniciais: "IR",
    titulo: "Explorador · 5 conquistas",
  },
  clovis: {
    nome: "Clóvis Bertolini",
    iniciais: "CB",
    titulo: "Explorador · 5 conquistas",
  },
  marcia: {
    nome: "Márcia Bueno",
    iniciais: "MB",
    titulo: "Novato · 2 conquistas",
  },
  jorge: {
    nome: "Jorge Tanaka",
    iniciais: "JT",
    titulo: "Guia local · 8 conquistas",
  },
  beatriz: {
    nome: "Beatriz Camargo",
    iniciais: "BC",
    titulo: "Explorador · 4 conquistas",
  },
  hugo: {
    nome: "Hugo Bandeira",
    iniciais: "HB",
    titulo: "Explorador · 3 conquistas",
  },
} satisfies Record<string, ReviewAuthorMock>;

export type ReviewAuthorId = keyof typeof reviewAuthorsMock;

/** Local avaliado. Os mesmos pontos de `src/mocks/markers.ts`. */
export interface ReviewPlaceMock {
  id: number;
  nome: string;
  bairro: string;
  categoria: string;
}

const PLACES = {
  cabocafe: {
    id: 1,
    nome: "Cabocafé",
    bairro: "Santa Rosália",
    categoria: "Cafeteria",
  },
  zeca: { id: 3, nome: "Bar do Zeca", bairro: "Centro", categoria: "Bar" },
  estacao: {
    id: 12,
    nome: "Padaria Estação",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
  },
  aguas: {
    id: 2,
    nome: "Parque das Águas",
    bairro: "Jardim Abaeté",
    categoria: "Parque",
  },
  sebo: {
    id: 4,
    nome: "Sebo da Rua XV",
    bairro: "Centro",
    categoria: "Cultura",
  },
  manga: {
    id: 11,
    nome: "Feira da Manga",
    bairro: "Vila Haro",
    categoria: "Compras",
  },
  cantina: {
    id: 5,
    nome: "Cantina da Vila",
    bairro: "Vila Hortência",
    categoria: "Gastronomia",
  },
  largo: {
    id: 10,
    nome: "Largo do Café",
    bairro: "Centro",
    categoria: "Cafeteria",
  },
} satisfies Record<string, ReviewPlaceMock>;

/** Comentário pendurado numa avaliação — a conversa que `Comentario` guardaria. */
export interface ReviewCommentMock {
  autor: string;
  iniciais: string;
  corpo: string;
  diasPublicado: number;
}

export interface ReviewMock {
  id: string;
  autorId: ReviewAuthorId;
  local: ReviewPlaceMock;
  /** De 1 a 5. */
  nota: number;
  corpo: string;
  diasPublicado: number;
  status: ReviewStatus;

  /** Preenchidos só quando `status === "removida"`. */
  removidaPor?: string;
  motivoRemocao?: RemovalReason;

  /**
   * Marcado como promocional. Hoje é flag no mock; quando `Analise` existir,
   * vem do backend — marcar exige analisar texto, e fingir que temos
   * classificador seria mentira.
   */
  spam?: boolean;

  comentarios: ReviewCommentMock[];
}

export const reviewsMock: ReviewMock[] = [
  // --- Bar do Zeca: rajada de notas máximas num local de média baixa ---
  {
    id: "av1",
    autorId: "tatiane",
    local: PLACES.zeca,
    nota: 5,
    corpo:
      "Melhor boteco da cidade sem discussão nenhuma. Atendimento nota mil, ambiente perfeito, tudo impecável do começo ao fim.",
    diasPublicado: 3,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av2",
    autorId: "wanderson",
    local: PLACES.zeca,
    nota: 5,
    corpo:
      "Simplesmente o melhor. Não tem defeito, recomendo para todo mundo sem pensar duas vezes.",
    diasPublicado: 3,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av3",
    autorId: "hugo",
    local: PLACES.zeca,
    nota: 5,
    corpo:
      "Perfeito em tudo. Melhor lugar de Sorocaba, sem exagero nenhum na minha parte.",
    diasPublicado: 4,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av4",
    autorId: "beatriz",
    local: PLACES.zeca,
    nota: 5,
    corpo: "Nota máxima. Tudo excelente, nada a reclamar.",
    diasPublicado: 4,
    status: "publicada",
    comentarios: [],
  },
  {
    // A nota real do lugar, afogada pela rajada acima.
    id: "av5",
    autorId: "jorge",
    local: PLACES.zeca,
    nota: 4,
    corpo:
      "Bolinho de bacalhau é o melhor da região, isso é fato. Mas depois das oito de sexta não tem onde encostar, e o balcão fica impraticável.",
    diasPublicado: 21,
    status: "publicada",
    comentarios: [
      {
        autor: "Silvana D. Moraes",
        iniciais: "SM",
        corpo: "Concordo, sexta é impossível. Terça é outro lugar.",
        diasPublicado: 19,
      },
    ],
  },
  {
    // Discrepante: 1★ contra a média alta do próprio local.
    id: "av6",
    autorId: "carla",
    local: PLACES.zeca,
    nota: 1,
    corpo:
      "Fui num sábado, esperei quarenta minutos por uma porção e ninguém veio na mesa. Não volto.",
    diasPublicado: 9,
    status: "publicada",
    comentarios: [],
  },

  // --- Cabocafé ---
  {
    id: "av7",
    autorId: "ana",
    local: PLACES.cabocafe,
    nota: 5,
    corpo:
      "Torra própria, atendimento gentil e o bolo de fubá das 15h vale a caminhada. Melhor café do bairro.",
    diasPublicado: 12,
    status: "publicada",
    comentarios: [
      {
        autor: "Jeferson T.",
        iniciais: "JT",
        corpo:
          "Quem escreveu isso claramente nunca trabalhou em cafeteria e não entende nada de torra.",
        diasPublicado: 11,
      },
      {
        autor: "Bruno Okamoto",
        iniciais: "BO",
        corpo: "O coado do dia é fora de série mesmo. Peça sem medo.",
        diasPublicado: 10,
      },
    ],
  },
  {
    id: "av8",
    autorId: "bruno",
    local: PLACES.cabocafe,
    nota: 4,
    corpo:
      "Café ótimo e tem tomada em quase toda mesa, o que salva quem trabalha fora. Só falta espaço — sete mesas enchem rápido.",
    diasPublicado: 25,
    status: "publicada",
    comentarios: [],
  },
  {
    // Duplicada: a mesma autora já avaliou este local em av7.
    id: "av9",
    autorId: "ana",
    local: PLACES.cabocafe,
    nota: 5,
    corpo:
      "Voltei depois de uns meses e continua o mesmo padrão. Merecia mais gente conhecendo.",
    diasPublicado: 2,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av10",
    autorId: "clovis",
    local: PLACES.cabocafe,
    nota: 4,
    corpo: "Bom café, atendimento simpático. O croissant costuma acabar cedo.",
    diasPublicado: 33,
    status: "publicada",
    comentarios: [],
  },

  // --- Padaria Estação ---
  {
    // Spam declarado.
    id: "av11",
    autorId: "tatiane",
    local: PLACES.estacao,
    nota: 5,
    corpo:
      "MELHOR PADARIA!!! Compre pelo meu link e ganhe 30% de desconto — wa.me/5515998… chama no zap que eu explico o esquema de revenda.",
    diasPublicado: 2,
    status: "publicada",
    spam: true,
    comentarios: [],
  },
  {
    id: "av12",
    autorId: "marcia",
    local: PLACES.estacao,
    nota: 5,
    corpo:
      "Pão saindo de hora em hora e o café da manhã no balcão custa menos que em qualquer cafeteria da região. Tradicional no melhor sentido.",
    diasPublicado: 15,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av13",
    autorId: "ivete",
    local: PLACES.estacao,
    nota: 4,
    corpo:
      "O pão doce de coco das 16h vale a espera. Fila de sábado testa a paciência, mas anda.",
    diasPublicado: 28,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av14",
    autorId: "jorge",
    local: PLACES.estacao,
    nota: 5,
    corpo: "Padaria de bairro como tem que ser. Balcão de fórmica e tudo.",
    diasPublicado: 41,
    status: "publicada",
    comentarios: [],
  },

  // --- Parque das Águas ---
  {
    id: "av15",
    autorId: "carla",
    local: PLACES.aguas,
    nota: 2,
    corpo:
      "A pista está esburacada e o banheiro vive trancado desde maio. Mas o pessoal da manutenção é um bando de incompetente mesmo, não adianta reclamar.",
    diasPublicado: 3,
    status: "publicada",
    comentarios: [
      {
        autor: "Rogério Tavares",
        iniciais: "RT",
        corpo:
          "O buraco da pista é real, mas o pessoal da manutenção não tem culpa de verba.",
        diasPublicado: 2,
      },
    ],
  },
  {
    id: "av16",
    autorId: "rogerio",
    local: PLACES.aguas,
    nota: 5,
    corpo:
      "Pista de quase dois quilômetros com sombra de verdade. No meio da semana é praticamente do bairro.",
    diasPublicado: 18,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av17",
    autorId: "beatriz",
    local: PLACES.aguas,
    nota: 4,
    corpo:
      "Ótimo para correr de manhã. A feirinha da entrada no fim de semana lota tudo.",
    diasPublicado: 30,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av18",
    autorId: "edson",
    local: PLACES.aguas,
    nota: 5,
    corpo:
      "Levo as crianças todo domingo. A entrada dos fundos tem estacionamento livre e quase ninguém sabe.",
    diasPublicado: 46,
    status: "publicada",
    comentarios: [],
  },

  // --- Sebo da Rua XV ---
  {
    id: "av19",
    autorId: "silvana",
    local: PLACES.sebo,
    nota: 4,
    corpo:
      "Sebo pequeno mas bem curado, com uma seção de discos que vale a visita de sábado.",
    diasPublicado: 8,
    status: "publicada",
    comentarios: [
      {
        autor: "Rogério Tavares",
        iniciais: "RT",
        corpo:
          "Acervo fraco, dono antipático e preço de livraria nova. Não sei o que vocês veem nesse lugar.",
        diasPublicado: 7,
      },
    ],
  },
  {
    id: "av20",
    autorId: "clovis",
    local: PLACES.sebo,
    nota: 5,
    corpo:
      "O segundo andar é a surpresa: uma sala inteira de quadrinhos organizada por editora. O dono acha qualquer coisa em dois minutos.",
    diasPublicado: 22,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av21",
    autorId: "ivete",
    local: PLACES.sebo,
    nota: 4,
    corpo: "Bom para garimpar. A mesa de promoção da entrada compensa.",
    diasPublicado: 37,
    status: "publicada",
    comentarios: [],
  },

  // --- Feira da Manga ---
  {
    id: "av22",
    autorId: "tatiane",
    local: PLACES.manga,
    nota: 1,
    corpo:
      "Feira suja, barraca de temperos vende produto vencido. Denunciei na prefeitura e ninguém faz nada. Evitem, principalmente com criança.",
    diasPublicado: 5,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av23",
    autorId: "ana",
    local: PLACES.manga,
    nota: 5,
    corpo:
      "O pastel do meio da rua sustenta a fama sozinho. Vá com dinheiro trocado, metade não aceita cartão.",
    diasPublicado: 14,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av24",
    autorId: "marcia",
    local: PLACES.manga,
    nota: 5,
    corpo:
      "Hortifruti bom e barato. A última barraca vende o resto por metade do preço depois das onze.",
    diasPublicado: 26,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av25",
    autorId: "hugo",
    local: PLACES.manga,
    nota: 4,
    corpo: "Feira de sábado clássica. Chegue antes das nove.",
    diasPublicado: 39,
    status: "publicada",
    comentarios: [],
  },

  // --- Cantina da Vila ---
  {
    id: "av26",
    autorId: "edson",
    local: PLACES.cantina,
    nota: 5,
    corpo:
      "Massa feita na hora e molho que não muda de receita desde que abriu. Fila anda rápido, exceto domingo.",
    diasPublicado: 11,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av27",
    autorId: "beatriz",
    local: PLACES.cantina,
    nota: 4,
    corpo:
      "Cardápio de uma página, do jeito certo. Salão pequeno, então prepare-se para esperar na porta.",
    diasPublicado: 24,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av28",
    autorId: "bruno",
    local: PLACES.cantina,
    nota: 5,
    corpo: "Melhor cantina de bairro que já fui. Preço justo pelo que entrega.",
    diasPublicado: 35,
    status: "publicada",
    comentarios: [],
  },

  // --- Largo do Café ---
  {
    id: "av29",
    autorId: "silvana",
    local: PLACES.largo,
    nota: 5,
    corpo:
      "Samba de roda na quinta sem couvert, num casarão de pé-direito alto. Difícil pedir mais.",
    diasPublicado: 6,
    status: "publicada",
    comentarios: [],
  },
  {
    id: "av30",
    autorId: "rogerio",
    local: PLACES.largo,
    nota: 4,
    corpo:
      "Mesa na calçada é disputada mas vale. Cozinha pequena, cardápio curto, cinco petiscos que saem bem.",
    diasPublicado: 19,
    status: "publicada",
    comentarios: [],
  },

  // --- Já removidas: auditoria ---
  {
    id: "av31",
    autorId: "wanderson",
    local: PLACES.zeca,
    nota: 1,
    corpo:
      "Lugar fechou as portas, não existe mais. Dona sumiu com o dinheiro de todo mundo e a cozinha foi interditada pela vigilância.",
    diasPublicado: 12,
    status: "removida",
    removidaPor: "Rafael Sousa",
    motivoRemocao: "Informação falsa",
    comentarios: [],
  },
  {
    id: "av32",
    autorId: "tatiane",
    local: PLACES.cantina,
    nota: 5,
    corpo:
      "Cupom SORO30 dá desconto em qualquer pedido, chama no direct que eu passo. Trabalho com divulgação de restaurantes.",
    diasPublicado: 17,
    status: "removida",
    removidaPor: "Letícia Prado",
    motivoRemocao: "Spam",
    spam: true,
    comentarios: [],
  },
  {
    id: "av33",
    autorId: "wanderson",
    local: PLACES.sebo,
    nota: 1,
    corpo:
      "Dono é um velho ranzinza que não sabe atender ninguém. Devia fechar as portas de uma vez.",
    diasPublicado: 29,
    status: "removida",
    removidaPor: "Rafael Sousa",
    motivoRemocao: "Ofensa ou discurso de ódio",
    comentarios: [],
  },
];

/** Números que só um agregado dará — hoje fixos. */
export const reviewsSummaryMock = {
  variacaoNotaMedia: "-0,2",
};
