/**
 * Dados fictícios das reivindicações de posse de estabelecimento.
 *
 * Nada disto existe no banco: `tbUsuario` não distingue pessoa de comércio (não
 * tem `tipoUsuario` nem `CNPJ`), `markers` não tem FK de dono, e não há
 * entidade de reivindicação. Ver `docs/todo/admin/businesses.md`.
 *
 * Sai daqui quando o vínculo dono↔ponto existir no schema.
 */

/** Tipo de prova anexada ao pedido. */
export type ClaimEvidence = "cnpj" | "fachada" | "email";

export const CLAIM_EVIDENCE_LABEL: Record<ClaimEvidence, string> = {
  cnpj: "CNPJ",
  fachada: "Foto da fachada",
  email: "E-mail do domínio",
};

/** Motivos de recusa. Lista fechada: vira métrica e vira aviso ao solicitante. */
export const CLAIM_REJECTION_REASONS = [
  "Sem evidência de vínculo",
  "CNPJ não corresponde ao local",
  "Local não é um estabelecimento",
  "Já possui outro dono verificado",
  "Suspeita de fraude",
] as const;

/** Motivos de revogação de um vínculo já concedido. */
export const CLAIM_REVOCATION_REASONS = [
  "Negócio encerrado",
  "Dono não é mais responsável",
  "Uso indevido das respostas",
  "Pedido do próprio dono",
  "Suspeita de fraude",
] as const;

export type ClaimReason =
  | (typeof CLAIM_REJECTION_REASONS)[number]
  | (typeof CLAIM_REVOCATION_REASONS)[number];

/**
 * Quem pede a posse. `aprovados`/`recusados` são o histórico de pedidos
 * anteriores — o dado que define o nível de escrutínio antes de ler o resto.
 */
export interface ClaimantMock {
  nome: string;
  email: string;
  iniciais: string;
  membroDesde: string;
  avaliacoesEscritas: number;
  pontosCriados: number;
  aprovados: number;
  recusados: number;
}

export const claimantsMock: Record<string, ClaimantMock> = {
  jose: {
    nome: "José Carlos Ribeiro",
    email: "jc.ribeiro@bardozeca.com.br",
    iniciais: "JR",
    membroDesde: "maio de 2024",
    avaliacoesEscritas: 14,
    pontosCriados: 3,
    aprovados: 1,
    recusados: 0,
  },
  wanderson: {
    nome: "Wanderson Alves",
    email: "wanderson.alv@gmail.com",
    iniciais: "WA",
    membroDesde: "há 6 dias",
    avaliacoesEscritas: 0,
    pontosCriados: 0,
    aprovados: 0,
    recusados: 2,
  },
  ana: {
    nome: "Ana Paula Ferraz",
    email: "contato@cabocafe.com.br",
    iniciais: "AF",
    membroDesde: "agosto de 2023",
    avaliacoesEscritas: 112,
    pontosCriados: 9,
    aprovados: 1,
    recusados: 0,
  },
  marcia: {
    nome: "Márcia Bueno",
    email: "marcia@padariaestacao.com.br",
    iniciais: "MB",
    membroDesde: "fevereiro de 2025",
    avaliacoesEscritas: 6,
    pontosCriados: 1,
    aprovados: 0,
    recusados: 0,
  },
  edson: {
    nome: "Edson Kimura",
    email: "edson.kimura@outlook.com",
    iniciais: "EK",
    membroDesde: "novembro de 2024",
    avaliacoesEscritas: 21,
    pontosCriados: 4,
    aprovados: 1,
    recusados: 1,
  },
  luana: {
    nome: "Luana Prestes",
    email: "luana@cantinadavila.com.br",
    iniciais: "LP",
    membroDesde: "junho de 2025",
    avaliacoesEscritas: 3,
    pontosCriados: 2,
    aprovados: 0,
    recusados: 0,
  },
  rogerio: {
    nome: "Rogério Tavares",
    email: "rogerio.tavares@gmail.com",
    iniciais: "RT",
    membroDesde: "há 4 dias",
    avaliacoesEscritas: 0,
    pontosCriados: 1,
    aprovados: 0,
    recusados: 0,
  },
  silvana: {
    nome: "Silvana D. Moraes",
    email: "silvana@sebodaruaxv.com.br",
    iniciais: "SM",
    membroDesde: "janeiro de 2024",
    avaliacoesEscritas: 48,
    pontosCriados: 6,
    aprovados: 1,
    recusados: 0,
  },
  paulo: {
    nome: "Paulo Henrique Sato",
    email: "ph.sato@largodocafe.com.br",
    iniciais: "PS",
    membroDesde: "março de 2025",
    avaliacoesEscritas: 9,
    pontosCriados: 2,
    aprovados: 0,
    recusados: 1,
  },
  ivete: {
    nome: "Ivete Ramos",
    email: "ivete.ramos@uol.com.br",
    iniciais: "IR",
    membroDesde: "setembro de 2024",
    avaliacoesEscritas: 33,
    pontosCriados: 5,
    aprovados: 2,
    recusados: 0,
  },
  fabio: {
    nome: "Fábio Nunes",
    email: "fabio@mangafeira.com.br",
    iniciais: "FN",
    membroDesde: "abril de 2025",
    avaliacoesEscritas: 11,
    pontosCriados: 3,
    aprovados: 0,
    recusados: 0,
  },
  tatiane: {
    nome: "Tatiane Lopes",
    email: "tatiane.lopes@gmail.com",
    iniciais: "TL",
    membroDesde: "há 9 dias",
    avaliacoesEscritas: 1,
    pontosCriados: 1,
    aprovados: 0,
    recusados: 0,
  },
  clovis: {
    nome: "Clóvis Bertolini",
    email: "clovis@empadariacentro.com.br",
    iniciais: "CB",
    membroDesde: "julho de 2024",
    avaliacoesEscritas: 27,
    pontosCriados: 4,
    aprovados: 1,
    recusados: 0,
  },
  nadia: {
    nome: "Nádia Constantino",
    email: "nadia.const@gmail.com",
    iniciais: "NC",
    membroDesde: "outubro de 2025",
    avaliacoesEscritas: 5,
    pontosCriados: 2,
    aprovados: 0,
    recusados: 0,
  },
  gilmar: {
    nome: "Gilmar Peçanha",
    email: "gilmar.pecanha@gmail.com",
    iniciais: "GP",
    membroDesde: "há 12 dias",
    avaliacoesEscritas: 0,
    pontosCriados: 0,
    aprovados: 0,
    recusados: 1,
  },
};

export interface BusinessClaimMock {
  id: string;
  claimantId: keyof typeof claimantsMock;

  /** Ponto reivindicado, como ele aparece no mapa. */
  ponto: string;
  bairro: string;
  categoria: string;
  coordenadas: string;
  temFoto: boolean;

  /** Dias na fila. Acima de 7 a linha ganha destaque de atraso. */
  diasNaFila: number;

  /** O que a pessoa declarou. `null` quando não informou. */
  cnpj: string | null;
  razaoSocial: string | null;
  enderecoCnpj: string | null;
  cidadeCnpj: string | null;
  telefone: string | null;

  /**
   * Distância entre o endereço do CNPJ e o pin, em km. `null` sem CNPJ.
   * Acima de 1 km vira sinal de risco — ver `getClaimSignals`.
   */
  distanciaCnpjKm: number | null;

  evidencias: ClaimEvidence[];

  /** Id do pedido concorrente pelo mesmo ponto. */
  conflitoCom?: string;
  /** Dono já verificado do ponto: o pedido é transferência, não concessão. */
  donoAtual?: string;
  /** Conta recém-criada, sem atividade. */
  solicitanteNovo?: boolean;
}

export const businessClaimsMock: BusinessClaimMock[] = [
  {
    id: "c1",
    claimantId: "jose",
    ponto: "Bar do Zeca",
    bairro: "Centro",
    categoria: "Bar",
    coordenadas: "-23.5031, -47.4566",
    temFoto: true,
    diasNaFila: 6,
    cnpj: "31.204.877/0001-45",
    razaoSocial: "Zeca Bar e Petiscaria Ltda",
    enderecoCnpj: "R. Barão de Piratininga, 480 — Centro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3231-7742",
    distanciaCnpjKm: 0.12,
    evidencias: ["cnpj", "fachada"],
    conflitoCom: "c2",
  },
  {
    id: "c2",
    claimantId: "wanderson",
    ponto: "Bar do Zeca",
    bairro: "Centro",
    categoria: "Bar",
    coordenadas: "-23.5031, -47.4566",
    temFoto: true,
    diasNaFila: 4,
    cnpj: null,
    razaoSocial: null,
    enderecoCnpj: null,
    cidadeCnpj: null,
    telefone: null,
    distanciaCnpjKm: null,
    evidencias: [],
    conflitoCom: "c1",
    solicitanteNovo: true,
  },
  {
    id: "c3",
    claimantId: "luana",
    ponto: "Cantina da Vila",
    bairro: "Vila Hortência",
    categoria: "Gastronomia",
    coordenadas: "-23.5069, -47.4499",
    temFoto: true,
    diasNaFila: 9,
    cnpj: "42.918.330/0001-08",
    razaoSocial: "Cantina da Vila Alimentação ME",
    enderecoCnpj: "Av. 31 de Março, 1.205 — Centro",
    cidadeCnpj: "Votorantim · SP",
    telefone: "(15) 3243-1180",
    distanciaCnpjKm: 8.1,
    evidencias: ["cnpj"],
  },
  {
    id: "c4",
    claimantId: "rogerio",
    ponto: "Parque das Águas",
    bairro: "Jardim Abaeté",
    categoria: "Parque",
    coordenadas: "-23.4831, -47.4718",
    temFoto: true,
    diasNaFila: 3,
    cnpj: "55.110.902/0001-71",
    razaoSocial: "RT Eventos e Locações Ltda",
    enderecoCnpj: "R. Antônio Cassio, 77 — Jd. Abaeté",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 99841-2200",
    distanciaCnpjKm: 0.4,
    evidencias: ["cnpj"],
    solicitanteNovo: true,
  },
  {
    id: "c5",
    claimantId: "marcia",
    ponto: "Padaria Estação",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
    coordenadas: "-23.4890, -47.4501",
    temFoto: true,
    diasNaFila: 5,
    cnpj: "18.663.451/0001-19",
    razaoSocial: "Panificadora Estação Sorocabana Ltda",
    enderecoCnpj: "R. Jaraguá, 96 — Vila Barcelona",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3221-4408",
    distanciaCnpjKm: 0.08,
    evidencias: ["cnpj", "fachada", "email"],
    donoAtual: "Otávio Bernardes",
  },
  {
    id: "c6",
    claimantId: "ana",
    ponto: "Cabocafé",
    bairro: "Santa Rosália",
    categoria: "Cafeteria",
    coordenadas: "-23.4938, -47.4402",
    temFoto: true,
    diasNaFila: 2,
    cnpj: "29.771.006/0001-63",
    razaoSocial: "Cabocafé Torrefação Ltda",
    enderecoCnpj: "R. Sorocabana, 312 — Santa Rosália",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3033-5514",
    distanciaCnpjKm: 0.05,
    evidencias: ["cnpj", "fachada", "email"],
  },
  {
    id: "c7",
    claimantId: "silvana",
    ponto: "Sebo da Rua XV",
    bairro: "Centro",
    categoria: "Cultura",
    coordenadas: "-23.5009, -47.4556",
    temFoto: true,
    diasNaFila: 8,
    cnpj: "11.402.885/0001-30",
    razaoSocial: "Sebo XV Livros Usados ME",
    enderecoCnpj: "R. XV de Novembro, 210 — Centro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3232-9017",
    distanciaCnpjKm: 0.09,
    evidencias: ["cnpj", "email"],
  },
  {
    id: "c8",
    claimantId: "paulo",
    ponto: "Largo do Café",
    bairro: "Centro",
    categoria: "Cafeteria",
    coordenadas: "-23.5021, -47.4574",
    temFoto: true,
    diasNaFila: 11,
    cnpj: "37.550.128/0001-22",
    razaoSocial: "Largo do Café Bebidas Ltda",
    enderecoCnpj: "R. Cel. Nogueira Martins, 55 — Centro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3211-6690",
    distanciaCnpjKm: 1.9,
    evidencias: ["cnpj", "fachada"],
    conflitoCom: "c9",
  },
  {
    id: "c9",
    claimantId: "gilmar",
    ponto: "Largo do Café",
    bairro: "Centro",
    categoria: "Cafeteria",
    coordenadas: "-23.5021, -47.4574",
    temFoto: false,
    diasNaFila: 13,
    cnpj: null,
    razaoSocial: null,
    enderecoCnpj: null,
    cidadeCnpj: null,
    telefone: null,
    distanciaCnpjKm: null,
    evidencias: [],
    conflitoCom: "c8",
    solicitanteNovo: true,
  },
  {
    id: "c10",
    claimantId: "fabio",
    ponto: "Feira da Manga",
    bairro: "Vila Haro",
    categoria: "Compras",
    coordenadas: "-23.4977, -47.4623",
    temFoto: true,
    diasNaFila: 7,
    cnpj: "46.208.774/0001-90",
    razaoSocial: "Nunes Comércio de Hortifruti ME",
    enderecoCnpj: "R. Frei Baraúna, 640 — Vila Haro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 99712-3388",
    distanciaCnpjKm: 0.3,
    evidencias: ["cnpj"],
  },
  {
    id: "c11",
    claimantId: "edson",
    ponto: "Choperia Vila Barão",
    bairro: "Vila Barão",
    categoria: "Bar",
    coordenadas: "-23.4955, -47.4712",
    temFoto: true,
    diasNaFila: 4,
    cnpj: "24.877.310/0001-04",
    razaoSocial: "EK Choperia e Eventos Ltda",
    enderecoCnpj: "R. Ipanema, 1.020 — Vila Barão",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3218-2244",
    distanciaCnpjKm: 4.2,
    evidencias: ["cnpj", "fachada"],
  },
  {
    id: "c12",
    claimantId: "ivete",
    ponto: "Quiosque do Lago",
    bairro: "Jardim Emília",
    categoria: "Gastronomia",
    coordenadas: "-23.4784, -47.4390",
    temFoto: true,
    diasNaFila: 1,
    cnpj: "52.309.114/0001-56",
    razaoSocial: "Ramos Lanches e Açaí ME",
    enderecoCnpj: "Av. Ipanema, 3.400 — Jd. Emília",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 99630-7781",
    distanciaCnpjKm: 0.2,
    evidencias: ["cnpj", "fachada"],
  },
  {
    id: "c13",
    claimantId: "tatiane",
    ponto: "Mirante do Ipanema",
    bairro: "Ipanema das Pedras",
    categoria: "Lazer",
    coordenadas: "-23.4402, -47.4285",
    temFoto: false,
    diasNaFila: 9,
    cnpj: null,
    razaoSocial: null,
    enderecoCnpj: null,
    cidadeCnpj: null,
    telefone: null,
    distanciaCnpjKm: null,
    evidencias: [],
    solicitanteNovo: true,
  },
  {
    id: "c14",
    claimantId: "clovis",
    ponto: "Empadaria do Centro",
    bairro: "Centro",
    categoria: "Gastronomia",
    coordenadas: "-23.5017, -47.4548",
    temFoto: true,
    diasNaFila: 3,
    cnpj: "33.712.669/0001-88",
    razaoSocial: "Bertolini Empadas e Salgados ME",
    enderecoCnpj: "R. Dr. Braguinha, 128 — Centro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 3234-0091",
    distanciaCnpjKm: 0.06,
    evidencias: ["cnpj", "email"],
  },
  {
    id: "c15",
    claimantId: "nadia",
    ponto: "Ateliê da Praça",
    bairro: "Centro",
    categoria: "Compras",
    coordenadas: "-23.5004, -47.4562",
    temFoto: true,
    diasNaFila: 2,
    cnpj: "61.044.207/0001-15",
    razaoSocial: "NC Cerâmica Artesanal ME",
    enderecoCnpj: "R. da Penha, 305 — Centro",
    cidadeCnpj: "Sorocaba · SP",
    telefone: "(15) 99408-5512",
    distanciaCnpjKm: 0.15,
    evidencias: ["fachada"],
  },
];

/** Vínculo já concedido. Aqui não se aprova nada — se revoga. */
export interface VerifiedBusinessMock {
  id: string;
  dono: string;
  email: string;
  iniciais: string;
  ponto: string;
  bairro: string;
  categoria: string;
  cnpj: string;
  verificadoEm: string;
  verificadoPor: string;
  ativo: boolean;
}

export const verifiedBusinessesMock: VerifiedBusinessMock[] = [
  {
    id: "v1",
    dono: "Otávio Bernardes",
    email: "otavio@padariaestacao.com.br",
    iniciais: "OB",
    ponto: "Padaria Estação",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
    cnpj: "18.663.451/0001-19",
    verificadoEm: "12/06/2026",
    verificadoPor: "Rafael Sousa",
    ativo: true,
  },
  {
    id: "v2",
    dono: "Renata Sampaio",
    email: "renata@casadopastel.com.br",
    iniciais: "RS",
    ponto: "Casa do Pastel",
    bairro: "Vila Barcelona",
    categoria: "Gastronomia",
    cnpj: "27.881.340/0001-72",
    verificadoEm: "09/06/2026",
    verificadoPor: "Letícia Prado",
    ativo: true,
  },
  {
    id: "v3",
    dono: "Jorge Tanaka",
    email: "jorge@mercadaosoro.com.br",
    iniciais: "JT",
    ponto: "Mercadão Municipal",
    bairro: "Centro",
    categoria: "Compras",
    cnpj: "10.554.902/0001-38",
    verificadoEm: "02/06/2026",
    verificadoPor: "Rafael Sousa",
    ativo: true,
  },
  {
    id: "v4",
    dono: "Beatriz Camargo",
    email: "bia@livrariapontofinal.com.br",
    iniciais: "BC",
    ponto: "Livraria Ponto Final",
    bairro: "Centro",
    categoria: "Cultura",
    cnpj: "48.220.117/0001-90",
    verificadoEm: "28/05/2026",
    verificadoPor: "Rafael Sousa",
    ativo: true,
  },
  {
    id: "v5",
    dono: "Nelson Prado",
    email: "nelson@chacaradosabor.com.br",
    iniciais: "NP",
    ponto: "Chácara do Sabor",
    bairro: "Éden",
    categoria: "Gastronomia",
    cnpj: "39.117.664/0001-11",
    verificadoEm: "21/05/2026",
    verificadoPor: "Letícia Prado",
    ativo: false,
  },
  {
    id: "v6",
    dono: "Cristina Salles",
    email: "cristina@estacaosorocabana.com",
    iniciais: "CS",
    ponto: "Café da Estação Sorocabana",
    bairro: "Centro",
    categoria: "Cafeteria",
    cnpj: "15.900.783/0001-27",
    verificadoEm: "17/05/2026",
    verificadoPor: "Rafael Sousa",
    ativo: true,
  },
  {
    id: "v7",
    dono: "Adilson Freire",
    email: "adilson@barportuga.com.br",
    iniciais: "AF",
    ponto: "Bar do Portuga",
    bairro: "Vila Haro",
    categoria: "Bar",
    cnpj: "22.404.881/0001-63",
    verificadoEm: "11/05/2026",
    verificadoPor: "Letícia Prado",
    ativo: true,
  },
  {
    id: "v8",
    dono: "Vera Lúcia Antunes",
    email: "vera@ateliedapraca.com.br",
    iniciais: "VA",
    ponto: "Ateliê da Praça",
    bairro: "Centro",
    categoria: "Compras",
    cnpj: "58.703.229/0001-44",
    verificadoEm: "05/05/2026",
    verificadoPor: "Rafael Sousa",
    ativo: false,
  },
  {
    id: "v9",
    dono: "Hugo Bandeira",
    email: "hugo@pizzariavilaharo.com.br",
    iniciais: "HB",
    ponto: "Pizzaria Vila Haro",
    bairro: "Vila Haro",
    categoria: "Gastronomia",
    cnpj: "30.998.512/0001-06",
    verificadoEm: "29/04/2026",
    verificadoPor: "Rafael Sousa",
    ativo: true,
  },
  {
    id: "v10",
    dono: "Sueli Menezes",
    email: "sueli@docariacentro.com.br",
    iniciais: "SM",
    ponto: "Doçaria do Centro",
    bairro: "Centro",
    categoria: "Gastronomia",
    cnpj: "44.331.705/0001-59",
    verificadoEm: "24/04/2026",
    verificadoPor: "Letícia Prado",
    ativo: true,
  },
];

/**
 * Ponto comercial que ninguém reivindicou. Não é fila — é lista de
 * prospecção, ordenada por movimento.
 */
export interface UnclaimedPlaceMock {
  id: string;
  nome: string;
  bairro: string;
  categoria: string;
  avaliacoes: number;
  nota: number;
  visitasNoMes: number;
}

export const unclaimedPlacesMock: UnclaimedPlaceMock[] = [
  {
    id: "u1",
    nome: "Bar do Zeca",
    bairro: "Centro",
    categoria: "Bar",
    avaliacoes: 46,
    nota: 4.5,
    visitasNoMes: 1240,
  },
  {
    id: "u2",
    nome: "Feira da Manga",
    bairro: "Vila Haro",
    categoria: "Compras",
    avaliacoes: 38,
    nota: 4.7,
    visitasNoMes: 980,
  },
  {
    id: "u3",
    nome: "Sebo da Rua XV",
    bairro: "Centro",
    categoria: "Cultura",
    avaliacoes: 31,
    nota: 4.8,
    visitasNoMes: 610,
  },
  {
    id: "u4",
    nome: "Cabocafé",
    bairro: "Santa Rosália",
    categoria: "Cafeteria",
    avaliacoes: 28,
    nota: 4.9,
    visitasNoMes: 870,
  },
  {
    id: "u5",
    nome: "Largo do Café",
    bairro: "Centro",
    categoria: "Cafeteria",
    avaliacoes: 24,
    nota: 4.4,
    visitasNoMes: 720,
  },
  {
    id: "u6",
    nome: "Cantina da Vila",
    bairro: "Vila Hortência",
    categoria: "Gastronomia",
    avaliacoes: 22,
    nota: 4.3,
    visitasNoMes: 540,
  },
  {
    id: "u7",
    nome: "Choperia Vila Barão",
    bairro: "Vila Barão",
    categoria: "Bar",
    avaliacoes: 19,
    nota: 4.1,
    visitasNoMes: 480,
  },
  {
    id: "u8",
    nome: "Empadaria do Centro",
    bairro: "Centro",
    categoria: "Gastronomia",
    avaliacoes: 17,
    nota: 4.6,
    visitasNoMes: 460,
  },
  {
    id: "u9",
    nome: "Quiosque do Lago",
    bairro: "Jardim Emília",
    categoria: "Gastronomia",
    avaliacoes: 14,
    nota: 4.2,
    visitasNoMes: 390,
  },
  {
    id: "u10",
    nome: "Padaria Nova Ipanema",
    bairro: "Ipanema das Pedras",
    categoria: "Gastronomia",
    avaliacoes: 12,
    nota: 4.0,
    visitasNoMes: 350,
  },
];

/** Números que só um agregado dará — hoje fixos. */
export const businessesSummaryMock = {
  verificadosNoMes: 9,
};
