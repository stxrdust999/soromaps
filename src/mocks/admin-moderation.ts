/**
 * Dados fictícios da fila de moderação de pontos.
 *
 * Nada disto existe no banco: `markers` não tem coluna `status`, não tem dono,
 * e não há tabela de decisão nem de denúncia. A tela inteira roda sobre este
 * arquivo — ver `docs/todo/admin/moderation.md`.
 *
 * Sai daqui quando `status` existir em `markers` e as Server Actions de
 * aprovar/devolver/rejeitar estiverem escritas.
 */

export type ModerationStatus =
  | "pendente"
  | "devolvido"
  | "aprovado"
  | "rejeitado";

export const MODERATION_STATUS_LABEL: Record<ModerationStatus, string> = {
  pendente: "Aguardando decisão",
  devolvido: "Devolvido ao autor",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
};

/** Motivos de rejeição. Lista fechada: vira métrica e vira aviso ao autor. */
export const REJECTION_REASONS = [
  "Duplicata",
  "Local não existe",
  "Foto imprópria",
  "Spam ou teste",
  "Dados insuficientes",
  "Fora de Sorocaba",
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];

/**
 * Autor da sugestão. A taxa de aprovação é o dado que decide o nível de
 * escrutínio: histórico limpo passa rápido, zero de cinco pede lupa.
 */
export interface ModerationAuthorMock {
  nome: string;
  iniciais: string;
  nivel: string;
  enviados: number;
  aprovados: number;
  membroDesde: string;
  avaliacoesEscritas: number;
}

export const moderationAuthorsMock: Record<string, ModerationAuthorMock> = {
  ana: {
    nome: "Ana Paula Ferraz",
    iniciais: "AF",
    nivel: "Guia local · nível 6",
    enviados: 25,
    aprovados: 24,
    membroDesde: "agosto de 2023",
    avaliacoesEscritas: 112,
  },
  marcos: {
    nome: "Marcos Vinícius Alves",
    iniciais: "MA",
    nivel: "Explorador · nível 4",
    enviados: 12,
    aprovados: 11,
    membroDesde: "março de 2024",
    avaliacoesEscritas: 37,
  },
  bruno: {
    nome: "Bruno Okamoto",
    iniciais: "BO",
    nivel: "Explorador · nível 3",
    enviados: 7,
    aprovados: 5,
    membroDesde: "janeiro de 2025",
    avaliacoesEscritas: 18,
  },
  carla: {
    nome: "Carla Menezes",
    iniciais: "CM",
    nivel: "Novato · nível 1",
    enviados: 2,
    aprovados: 1,
    membroDesde: "há 9 dias",
    avaliacoesEscritas: 2,
  },
  jeferson: {
    nome: "Jeferson T.",
    iniciais: "JT",
    nivel: "Novato · nível 1",
    enviados: 3,
    aprovados: 0,
    membroDesde: "há 2 dias",
    avaliacoesEscritas: 0,
  },
};

/**
 * Os dez campos que o formulário de ponto coleta. `null` é campo vazio e
 * aparece na ficha como "não informado" — é o que sustenta a decisão de
 * devolver em vez de rejeitar.
 */
export interface ModerationFieldsMock {
  nome: string;
  categoria: string;
  bairro: string;
  coordenadas: string;
  sobre: string | null;
  descricao: string | null;
  temWifi: string | null;
  petFriendly: string | null;
  melhorHorario: string | null;
  segredoLocal: string | null;
}

export const MODERATION_FIELDS: {
  key: keyof ModerationFieldsMock;
  label: string;
}[] = [
  { key: "nome", label: "Nome" },
  { key: "categoria", label: "Categoria" },
  { key: "bairro", label: "Bairro" },
  { key: "coordenadas", label: "Coordenadas" },
  { key: "sobre", label: "Sobre" },
  { key: "descricao", label: "Descrição" },
  { key: "temWifi", label: "Tem wi-fi" },
  { key: "petFriendly", label: "Pet friendly" },
  { key: "melhorHorario", label: "Melhor horário" },
  { key: "segredoLocal", label: "Segredo local" },
];

/** Linha da comparação lado a lado com o ponto já aprovado. */
export interface DuplicateComparisonRow {
  label: string;
  emAnalise: string;
  existente: string;
  igual: boolean;
}

/** Suspeita de duplicata levantada por proximidade + nome similar. */
export interface DuplicateHintMock {
  nome: string;
  distanciaMetros: number;
  similaridadeNome: number;
  comparacao: DuplicateComparisonRow[];
}

/**
 * Vizinho no mini-mapa, em coordenada normalizada (0–1) dentro do recorte.
 * Não é projeção real: é o suficiente para julgar "tem coisa colada aqui".
 */
export interface MapNeighborMock {
  x: number;
  y: number;
  /** Marca o vizinho que disparou a suspeita de duplicata. */
  suspeito?: boolean;
}

export interface ModerationItemMock {
  id: string;
  nome: string;
  bairro: string;
  categoria: string;
  status: ModerationStatus;
  autorId: keyof typeof moderationAuthorsMock;
  /** Dias na fila. Acima de 7 a linha ganha destaque de atraso. */
  diasNaFila: number;
  fotos: number;
  autorNovo?: boolean;
  campos: ModerationFieldsMock;
  duplicata?: DuplicateHintMock;
  vizinhos: MapNeighborMock[];
}

export const moderationQueueMock: ModerationItemMock[] = [
  {
    id: "cabocafe",
    nome: "Cabocafé",
    bairro: "Santa Rosália",
    categoria: "Cafeteria",
    status: "pendente",
    autorId: "ana",
    diasNaFila: 12,
    fotos: 3,
    vizinhos: [
      { x: 0.72, y: 0.28 },
      { x: 0.24, y: 0.66 },
    ],
    campos: {
      nome: "Cabocafé",
      categoria: "Cafeteria",
      bairro: "Santa Rosália",
      coordenadas: "-23.4938, -47.4402",
      sobre: "Torra própria e mesa na calçada.",
      descricao:
        "Cafeteria pequena tocada por dois irmãos, com grãos torrados na casa e bolo de fubá saindo às 15h.",
      temWifi: "Sim",
      petFriendly: "Sim",
      melhorHorario: "Manhã, das 8h às 11h",
      segredoLocal: "Peça o coado do dia, que fica fora do cardápio.",
    },
  },
  {
    id: "asdasd",
    nome: "asdasd",
    bairro: "Centro",
    categoria: "Lazer",
    status: "pendente",
    autorId: "jeferson",
    diasNaFila: 11,
    fotos: 0,
    autorNovo: true,
    vizinhos: [
      { x: 0.6, y: 0.34 },
      { x: 0.38, y: 0.72 },
      { x: 0.82, y: 0.58 },
    ],
    campos: {
      nome: "asdasd",
      categoria: "Lazer",
      bairro: "Centro",
      coordenadas: "-23.5015, -47.4581",
      sobre: null,
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: null,
      segredoLocal: null,
    },
  },
  {
    id: "zeca",
    nome: "Boteco do Zeca",
    bairro: "Centro",
    categoria: "Bar",
    status: "pendente",
    autorId: "marcos",
    diasNaFila: 9,
    fotos: 3,
    vizinhos: [
      { x: 0.59, y: 0.38, suspeito: true },
      { x: 0.39, y: 0.62 },
      { x: 0.33, y: 0.29 },
      { x: 0.66, y: 0.65 },
    ],
    duplicata: {
      nome: "Bar do Zeca",
      distanciaMetros: 32,
      similaridadeNome: 78,
      comparacao: [
        { label: "Categoria", emAnalise: "Bar", existente: "Bar", igual: true },
        {
          label: "Bairro",
          emAnalise: "Centro",
          existente: "Centro",
          igual: true,
        },
        {
          label: "Coordenadas",
          emAnalise: "-23.5028, -47.4569",
          existente: "-23.5031, -47.4566",
          igual: false,
        },
        {
          label: "Sobre",
          emAnalise: "Boteco de esquina com mesa na calçada.",
          existente: "Boteco de esquina, mesa na calçada e chope gelado.",
          igual: false,
        },
        {
          label: "Melhor horário",
          emAnalise: "Noite, a partir das 19h",
          existente: "Noite",
          igual: false,
        },
        {
          label: "Fotos",
          emAnalise: "3 enviadas",
          existente: "11 na galeria",
          igual: false,
        },
        {
          label: "Avaliações",
          emAnalise: "nenhuma",
          existente: "46 avaliações · nota 4,5",
          igual: false,
        },
      ],
    },
    campos: {
      nome: "Boteco do Zeca",
      categoria: "Bar",
      bairro: "Centro",
      coordenadas: "-23.5028, -47.4569",
      sobre: "Boteco de esquina com mesa na calçada.",
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: "Noite, a partir das 19h",
      segredoLocal: null,
    },
  },
  {
    id: "manga",
    nome: "Feira da Manga",
    bairro: "Vila Haro",
    categoria: "Compras",
    status: "pendente",
    autorId: "ana",
    diasNaFila: 8,
    fotos: 2,
    vizinhos: [{ x: 0.3, y: 0.4 }],
    campos: {
      nome: "Feira da Manga",
      categoria: "Compras",
      bairro: "Vila Haro",
      coordenadas: "-23.4977, -47.4623",
      sobre: "Feira livre de quarta e sábado.",
      descricao:
        "Feira tradicional do bairro, com pastel de feira e barraca de temperos no fim da rua.",
      temWifi: "Não",
      petFriendly: "Sim",
      melhorHorario: "Sábado, das 7h às 12h",
      segredoLocal:
        "A última barraca vende manga por metade do preço depois das 11h.",
    },
  },
  {
    id: "aguas",
    nome: "Parque das Águas",
    bairro: "Jardim Abaeté",
    categoria: "Parque",
    status: "pendente",
    autorId: "bruno",
    diasNaFila: 6,
    fotos: 4,
    vizinhos: [
      { x: 0.75, y: 0.7 },
      { x: 0.2, y: 0.3 },
    ],
    campos: {
      nome: "Parque das Águas",
      categoria: "Parque",
      bairro: "Jardim Abaeté",
      coordenadas: "-23.4831, -47.4718",
      sobre: "Lago, pista de caminhada e quadra.",
      descricao:
        "Parque de bairro com pista de 1,2 km em volta do lago e área de piquenique sombreada.",
      temWifi: "Não",
      petFriendly: "Sim",
      melhorHorario: "Fim de tarde",
      segredoLocal: null,
    },
  },
  {
    id: "sebo",
    nome: "Sebo da Rua XV",
    bairro: "Centro",
    categoria: "Cultura",
    status: "pendente",
    autorId: "carla",
    diasNaFila: 5,
    fotos: 1,
    vizinhos: [
      { x: 0.44, y: 0.31 },
      { x: 0.68, y: 0.64 },
    ],
    campos: {
      nome: "Sebo da Rua XV",
      categoria: "Cultura",
      bairro: "Centro",
      coordenadas: "-23.5009, -47.4556",
      sobre: "Sebo de livros e discos.",
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: null,
      segredoLocal: null,
    },
  },
  {
    id: "mirante",
    nome: "Mirante do Ipanema",
    bairro: "Ipanema das Pedras",
    categoria: "Lazer",
    status: "pendente",
    autorId: "carla",
    diasNaFila: 4,
    fotos: 2,
    autorNovo: true,
    vizinhos: [],
    campos: {
      nome: "Mirante do Ipanema",
      categoria: "Lazer",
      bairro: "Ipanema das Pedras",
      coordenadas: "-23.4402, -47.4285",
      sobre: "Vista da represa no fim da estrada.",
      descricao:
        "Ponto alto de terra batida, sem estrutura, usado para ver o pôr do sol sobre a represa.",
      temWifi: "Não",
      petFriendly: "Sim",
      melhorHorario: "Pôr do sol",
      segredoLocal: null,
    },
  },
  {
    id: "estacao",
    nome: "Padaria Estação",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
    status: "pendente",
    autorId: "marcos",
    diasNaFila: 3,
    fotos: 3,
    vizinhos: [
      { x: 0.28, y: 0.55 },
      { x: 0.7, y: 0.35 },
      { x: 0.5, y: 0.78 },
    ],
    campos: {
      nome: "Padaria Estação",
      categoria: "Gastronomia",
      bairro: "Vila Barcelona",
      coordenadas: "-23.4890, -47.4501",
      sobre: "Padaria de bairro aberta desde 1978.",
      descricao:
        "Balcão comprido, pão na hora a cada duas horas e café passado no coador de pano.",
      temWifi: "Sim",
      petFriendly: "Não",
      melhorHorario: "Manhã cedo",
      segredoLocal: "O pão doce de coco sai às 16h e acaba em 20 minutos.",
    },
  },
  {
    id: "barao",
    nome: "Choperia Vila Barão",
    bairro: "Vila Barão",
    categoria: "Bar",
    status: "pendente",
    autorId: "bruno",
    diasNaFila: 2,
    fotos: 2,
    vizinhos: [{ x: 0.62, y: 0.46 }],
    campos: {
      nome: "Choperia Vila Barão",
      categoria: "Bar",
      bairro: "Vila Barão",
      coordenadas: "-23.4955, -47.4712",
      sobre: "Chope gelado e mesa de sinuca.",
      descricao:
        "Casa antiga adaptada, com pátio nos fundos e música ao vivo às sextas.",
      temWifi: "Sim",
      petFriendly: "Não",
      melhorHorario: "Noite",
      segredoLocal: null,
    },
  },
  {
    id: "trilha",
    nome: "Trilha da Serra São Francisco",
    bairro: "Éden",
    categoria: "Lazer",
    status: "pendente",
    autorId: "carla",
    diasNaFila: 2,
    fotos: 1,
    vizinhos: [],
    campos: {
      nome: "Trilha da Serra São Francisco",
      categoria: "Lazer",
      bairro: "Éden",
      coordenadas: "-23.4318, -47.5106",
      sobre: null,
      descricao: null,
      temWifi: null,
      petFriendly: "Sim",
      melhorHorario: null,
      segredoLocal: null,
    },
  },
  {
    id: "quiosque",
    nome: "Quiosque do Lago",
    bairro: "Jardim Emília",
    categoria: "Gastronomia",
    status: "pendente",
    autorId: "ana",
    diasNaFila: 1,
    fotos: 2,
    vizinhos: [{ x: 0.35, y: 0.62 }],
    campos: {
      nome: "Quiosque do Lago",
      categoria: "Gastronomia",
      bairro: "Jardim Emília",
      coordenadas: "-23.4784, -47.4390",
      sobre: "Lanche e açaí na beira do lago.",
      descricao:
        "Quiosque de alvenaria com mesas ao ar livre, aberto enquanto o parque estiver aberto.",
      temWifi: "Não",
      petFriendly: "Sim",
      melhorHorario: "Domingo de manhã",
      segredoLocal: null,
    },
  },
  {
    id: "pontofinal",
    nome: "Livraria Ponto Final",
    bairro: "Centro",
    categoria: "Cultura",
    status: "pendente",
    autorId: "marcos",
    diasNaFila: 0,
    fotos: 3,
    vizinhos: [
      { x: 0.46, y: 0.36 },
      { x: 0.71, y: 0.6 },
    ],
    campos: {
      nome: "Livraria Ponto Final",
      categoria: "Cultura",
      bairro: "Centro",
      coordenadas: "-23.5021, -47.4574",
      sobre: "Livraria com café nos fundos.",
      descricao:
        "Acervo pequeno e curado, com clube de leitura na última quinta do mês.",
      temWifi: "Sim",
      petFriendly: "Não",
      melhorHorario: "Tarde",
      segredoLocal: "O café dos fundos tem tomada em todas as mesas.",
    },
  },
  {
    id: "cultural",
    nome: "Espaço Cultural Vila Hortência",
    bairro: "Vila Hortência",
    categoria: "Cultura",
    status: "devolvido",
    autorId: "bruno",
    diasNaFila: 7,
    fotos: 1,
    vizinhos: [{ x: 0.55, y: 0.42 }],
    campos: {
      nome: "Espaço Cultural Vila Hortência",
      categoria: "Cultura",
      bairro: "Vila Hortência",
      coordenadas: "-23.5069, -47.4499",
      sobre: null,
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: null,
      segredoLocal: null,
    },
  },
  {
    id: "bosque",
    nome: "Bosque do Éden",
    bairro: "Éden",
    categoria: "Parque",
    status: "devolvido",
    autorId: "carla",
    diasNaFila: 5,
    fotos: 1,
    vizinhos: [],
    campos: {
      nome: "Bosque do Éden",
      categoria: "Parque",
      bairro: "Éden",
      coordenadas: "-23.4290, -47.5031",
      sobre: "Área verde ao lado da rodovia.",
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: null,
      segredoLocal: null,
    },
  },
  {
    id: "portuga",
    nome: "Bar do Portuga",
    bairro: "Vila Haro",
    categoria: "Bar",
    status: "devolvido",
    autorId: "jeferson",
    diasNaFila: 4,
    fotos: 2,
    autorNovo: true,
    vizinhos: [{ x: 0.4, y: 0.5 }],
    campos: {
      nome: "Bar do Portuga",
      categoria: "Bar",
      bairro: "Vila Haro",
      coordenadas: "-23.4962, -47.4640",
      sobre: "Petisco e cerveja em porção grande.",
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: "Noite",
      segredoLocal: null,
    },
  },
  {
    id: "atelie",
    nome: "Ateliê da Praça",
    bairro: "Centro",
    categoria: "Compras",
    status: "devolvido",
    autorId: "ana",
    diasNaFila: 2,
    fotos: 1,
    vizinhos: [{ x: 0.64, y: 0.44 }],
    campos: {
      nome: "Ateliê da Praça",
      categoria: "Compras",
      bairro: "Centro",
      coordenadas: "-23.5004, -47.4562",
      sobre: "Cerâmica feita à mão.",
      descricao: null,
      temWifi: null,
      petFriendly: null,
      melhorHorario: null,
      segredoLocal: null,
    },
  },
];

/** Decisão já tomada, para a aba Histórico. */
export interface ModerationDecisionMock {
  id: string;
  nome: string;
  bairro: string;
  decisao: Exclude<ModerationStatus, "pendente">;
  motivo: string | null;
  moderador: string;
  quando: string;
  /** "Desfazer" vale por 24 h — depois disso a linha só mostra o registro. */
  podeDesfazer: boolean;
}

export const moderationHistoryMock: ModerationDecisionMock[] = [
  {
    id: "h1",
    nome: "Casa do Pastel",
    bairro: "Vila Barcelona",
    decisao: "aprovado",
    motivo: null,
    moderador: "Rafael Sousa",
    quando: "há 40 min",
    podeDesfazer: true,
  },
  {
    id: "h2",
    nome: "teste teste 1",
    bairro: "Centro",
    decisao: "rejeitado",
    motivo: "Spam ou teste",
    moderador: "Rafael Sousa",
    quando: "há 1 h",
    podeDesfazer: true,
  },
  {
    id: "h3",
    nome: "Praça Coronel Fernando Prestes",
    bairro: "Centro",
    decisao: "aprovado",
    motivo: null,
    moderador: "Letícia Prado",
    quando: "há 3 h",
    podeDesfazer: true,
  },
  {
    id: "h4",
    nome: "Café da Estação Sorocabana",
    bairro: "Centro",
    decisao: "devolvido",
    motivo: "Dados insuficientes",
    moderador: "Rafael Sousa",
    quando: "há 6 h",
    podeDesfazer: true,
  },
  {
    id: "h5",
    nome: "Chácara em Votorantim",
    bairro: "Votorantim",
    decisao: "rejeitado",
    motivo: "Fora de Sorocaba",
    moderador: "Letícia Prado",
    quando: "ontem, 18h12",
    podeDesfazer: false,
  },
  {
    id: "h6",
    nome: "Mercadão Municipal",
    bairro: "Centro",
    decisao: "aprovado",
    motivo: null,
    moderador: "Rafael Sousa",
    quando: "ontem, 15h40",
    podeDesfazer: false,
  },
];

/** Categorias disponíveis no filtro — as mesmas de `src/mocks/markers.ts`. */
export const MODERATION_CATEGORIES = [
  "Gastronomia",
  "Parque",
  "Bar",
  "Cafeteria",
  "Cultura",
  "Compras",
  "Lazer",
];

/** Decisões fechadas hoje e tempo médio — números que só um agregado dará. */
export const moderationSummaryMock = {
  decididosHoje: 23,
  tempoMedio: "1d 6h",
  variacaoTempoMedio: "+9h",
};

/**
 * Quantos dos dez campos vieram preenchidos. Completude baixa é motivo de
 * devolução, não de rejeição — daí ser número, e não booleano.
 *
 * @param campos Ficha do ponto.
 * @returns Quantidade de campos não vazios.
 */
export function countFilledFields(campos: ModerationFieldsMock): number {
  return MODERATION_FIELDS.filter(({ key }) => campos[key]).length;
}
