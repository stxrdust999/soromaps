/**
 * Dados fictícios da caixa de entrada do admin — denúncias e feedback.
 *
 * Nenhuma das duas entidades existe no banco, e **nenhuma estava no modelo do
 * TCC**: `Denuncia` (alvo polimórfico) e `Feedback` (sem alvo) são adição
 * nossa. Ver `docs/todo/admin/reports.md`.
 *
 * Sai daqui quando as duas tabelas existirem e `Analise`/`Comentario` derem o
 * conteúdo denunciável.
 */

/** Tipo do que foi denunciado. Polimórfico: `alvoTipo` + `alvoID` no schema. */
export type ReportTargetKind = "avaliacao" | "comentario" | "ponto" | "perfil";

export const TARGET_LABEL: Record<
  ReportTargetKind,
  { label: string; participio: string }
> = {
  avaliacao: { label: "Avaliação", participio: "denunciada" },
  comentario: { label: "Comentário", participio: "denunciado" },
  ponto: { label: "Ponto", participio: "denunciado" },
  perfil: { label: "Perfil", participio: "denunciado" },
};

/** Motivo escolhido por quem denuncia. Lista fechada: vira métrica. */
export type ReportReason = "spam" | "ofensa" | "falsa" | "improprio" | "escopo";

export const REASON_LABEL: Record<ReportReason, string> = {
  spam: "Spam",
  ofensa: "Ofensa",
  falsa: "Informação falsa",
  improprio: "Conteúdo impróprio",
  escopo: "Fora do escopo",
};

// Motivos de remoção vivem em `@/constants/content-removal` — são
// compartilhados com `/admin/reviews`, que remove o mesmo conteúdo por outro
// caminho, e conhecimento de produto não mora em arquivo de mock.

/**
 * Autor do conteúdo denunciado. `conteudoRemovido` é o histórico de moderação
 * — reincidência muda o peso da decisão.
 */
export interface ReportedAuthorMock {
  nome: string;
  iniciais: string;
  /** Título derivado da contagem de conquistas — não há nível. */
  titulo: string;
  membroDesde: string;
  avaliacoesEscritas: number;
  conteudoRemovido: number;
}

export const reportedAuthorsMock: Record<string, ReportedAuthorMock> = {
  wanderson: {
    nome: "Wanderson Alves",
    iniciais: "WA",
    titulo: "Novato · 1 conquista",
    membroDesde: "há 11 dias",
    avaliacoesEscritas: 3,
    conteudoRemovido: 0,
  },
  jeferson: {
    nome: "Jeferson T.",
    iniciais: "JT",
    titulo: "Novato · 2 conquistas",
    membroDesde: "março de 2026",
    avaliacoesEscritas: 8,
    conteudoRemovido: 2,
  },
  carla: {
    nome: "Carla Menezes",
    iniciais: "CM",
    titulo: "Explorador · 4 conquistas",
    membroDesde: "setembro de 2025",
    avaliacoesEscritas: 21,
    conteudoRemovido: 0,
  },
  edson: {
    nome: "Edson Kimura",
    iniciais: "EK",
    titulo: "Explorador · 5 conquistas",
    membroDesde: "novembro de 2024",
    avaliacoesEscritas: 34,
    conteudoRemovido: 1,
  },
  tatiane: {
    nome: "Tatiane Lopes",
    iniciais: "TL",
    titulo: "Novato · 1 conquista",
    membroDesde: "há 20 dias",
    avaliacoesEscritas: 2,
    conteudoRemovido: 0,
  },
  rogerio: {
    nome: "Rogério Tavares",
    iniciais: "RT",
    titulo: "Explorador · 3 conquistas",
    membroDesde: "junho de 2025",
    avaliacoesEscritas: 17,
    conteudoRemovido: 0,
  },
};

/**
 * Quem denunciou. `diasDeConta` só existe para conta recente — é o campo que
 * revela denúncia coordenada, e por isso vale mais que o nome de quem reportou.
 */
export interface ReporterMock {
  nome: string;
  iniciais: string;
  motivo: ReportReason;
  quando: string;
  /** Idade da conta em dias. Ausente = conta estabelecida. */
  diasDeConta?: number;
  membroDesde?: string;
}

/** Conteúdo denunciado, na forma que cada tipo de alvo exige. */
export interface ReportedContentMock {
  corpo: string;
  /** Avaliação e comentário: o local a que se referem. */
  local?: string;
  bairro?: string;
  data?: string;
  /** Só avaliação. */
  nota?: number;
  /** Só comentário: a avaliação em que está pendurado. */
  avaliacaoMae?: { autor: string; nota: number; corpo: string };
  /** Só ponto. */
  categoria?: string;
  coordenadas?: string;
  fotoNome?: string;
  /** Só perfil. */
  contadores?: { valor: number; rotulo: string }[];
}

export interface ReportCaseMock {
  id: string;
  alvoTipo: ReportTargetKind;
  /** Nome do alvo quando ele tem um — ponto e perfil. */
  alvoNome?: string;
  autorId: keyof typeof reportedAuthorsMock;
  /** Dias com o caso aberto. Acima de 7 ganha destaque. */
  diasAberto: number;
  /** Trecho mostrado na fila, já truncado no conteúdo. */
  trecho: string;
  conteudo: ReportedContentMock;
  denunciantes: ReporterMock[];
}

export const reportCasesMock: ReportCaseMock[] = [
  {
    // Coordenada: cinco contas de menos de 3 dias, todas com o mesmo motivo.
    id: "r1",
    alvoTipo: "avaliacao",
    autorId: "wanderson",
    diasAberto: 4,
    trecho:
      "Lugar fechou as portas, não existe mais. Dona sumiu com o dinheiro de todo mundo e a cozinha foi interditada pela vigilância.",
    conteudo: {
      nota: 1,
      local: "Bar do Zeca",
      bairro: "Centro",
      data: "5 de agosto de 2026",
      corpo:
        "Lugar fechou as portas, não existe mais. Dona sumiu com o dinheiro de todo mundo e a cozinha foi interditada pela vigilância. Não perca tempo indo até lá, é golpe.",
    },
    denunciantes: [
      {
        nome: "Marcos P.",
        iniciais: "MP",
        motivo: "falsa",
        quando: "há 4 dias",
        diasDeConta: 2,
      },
      {
        nome: "Rafa_S91",
        iniciais: "RS",
        motivo: "falsa",
        quando: "há 4 dias",
        diasDeConta: 3,
      },
      {
        nome: "Lu Cardoso",
        iniciais: "LC",
        motivo: "falsa",
        quando: "há 3 dias",
        diasDeConta: 2,
      },
      {
        nome: "juliana.f",
        iniciais: "JF",
        motivo: "falsa",
        quando: "há 3 dias",
        diasDeConta: 1,
      },
      {
        nome: "T. Moreira",
        iniciais: "TM",
        motivo: "falsa",
        quando: "há 2 dias",
        diasDeConta: 3,
      },
    ],
  },
  {
    // Reincidente + motivos divergentes: sinal fraco, desavença pessoal.
    id: "r2",
    alvoTipo: "comentario",
    autorId: "jeferson",
    diasAberto: 9,
    trecho:
      "Quem escreveu isso claramente nunca trabalhou em cafeteria. Segue meu perfil que eu mostro os lugares de verdade.",
    conteudo: {
      local: "Cabocafé",
      bairro: "Santa Rosália",
      data: "31 de julho de 2026",
      corpo:
        "Quem escreveu isso claramente nunca trabalhou em cafeteria e não entende nada de torra. Segue meu perfil que eu mostro os lugares de verdade em Sorocaba.",
      avaliacaoMae: {
        autor: "Ana Paula Ferraz",
        nota: 5,
        corpo:
          "Torra própria, atendimento gentil e o bolo de fubá das 15h vale a caminhada. Melhor café do bairro.",
      },
    },
    denunciantes: [
      {
        nome: "Ana Paula Ferraz",
        iniciais: "AF",
        motivo: "ofensa",
        quando: "há 9 dias",
        membroDesde: "membro desde agosto de 2023",
      },
      {
        nome: "Bruno Okamoto",
        iniciais: "BO",
        motivo: "spam",
        quando: "há 8 dias",
        membroDesde: "membro desde janeiro de 2025",
      },
    ],
  },
  {
    id: "r3",
    alvoTipo: "ponto",
    alvoNome: "asdasd",
    autorId: "jeferson",
    diasAberto: 6,
    trecho:
      "Ponto sem descrição, foto sem relação com o local e coordenada no meio da avenida.",
    conteudo: {
      bairro: "Centro",
      categoria: "Lazer",
      coordenadas: "-23.5015, -47.4581",
      fotoNome: "ponto-asdasd-01.jpg · 900×600",
      corpo:
        "Sem descrição preenchida. A foto enviada não tem relação com o endereço e a coordenada cai no meio da avenida.",
    },
    denunciantes: [
      {
        nome: "Ivete Ramos",
        iniciais: "IR",
        motivo: "escopo",
        quando: "há 6 dias",
        membroDesde: "membro desde setembro de 2024",
      },
    ],
  },
  {
    id: "r4",
    alvoTipo: "avaliacao",
    autorId: "tatiane",
    diasAberto: 2,
    trecho:
      "MELHOR PADARIA!!! Compre pelo meu link e ganhe 30% — chama no zap que eu explico o esquema.",
    conteudo: {
      nota: 5,
      local: "Padaria Estação",
      bairro: "Vila Barcelona",
      data: "7 de agosto de 2026",
      corpo:
        "MELHOR PADARIA!!! Compre pelo meu link e ganhe 30% de desconto — wa.me/5515998… chama no zap que eu explico o esquema de revenda.",
    },
    denunciantes: [
      {
        nome: "Márcia Bueno",
        iniciais: "MB",
        motivo: "spam",
        quando: "há 2 dias",
        membroDesde: "membro desde fevereiro de 2025",
      },
      {
        nome: "Clóvis Bertolini",
        iniciais: "CB",
        motivo: "spam",
        quando: "há 2 dias",
        membroDesde: "membro desde julho de 2024",
      },
      {
        nome: "Nádia Constantino",
        iniciais: "NC",
        motivo: "spam",
        quando: "há 1 dia",
        membroDesde: "membro desde outubro de 2025",
      },
      {
        nome: "Otávio Bernardes",
        iniciais: "OB",
        motivo: "spam",
        quando: "há 1 dia",
        membroDesde: "membro desde junho de 2024",
      },
      {
        nome: "Renata Sampaio",
        iniciais: "RS",
        motivo: "spam",
        quando: "há 1 dia",
        membroDesde: "membro desde março de 2025",
      },
      {
        nome: "Jorge Tanaka",
        iniciais: "JT",
        motivo: "improprio",
        quando: "há 1 dia",
        membroDesde: "membro desde maio de 2024",
      },
    ],
  },
  {
    id: "r5",
    alvoTipo: "perfil",
    alvoNome: "Edson Kimura",
    autorId: "edson",
    diasAberto: 11,
    trecho:
      'Bio com telefone comercial e link de revenda: "Consultoria de marketing local — orçamento no direct".',
    conteudo: {
      corpo:
        "Consultoria de marketing local para bares e restaurantes de Sorocaba. Orçamento no direct ou (15) 99xxx-xxxx. Trabalho com impulsionamento de avaliações.",
      contadores: [
        { valor: 34, rotulo: "avaliações" },
        { valor: 12, rotulo: "pontos criados" },
        { valor: 128, rotulo: "seguidores" },
      ],
    },
    denunciantes: [
      {
        nome: "Silvana D. Moraes",
        iniciais: "SM",
        motivo: "spam",
        quando: "há 11 dias",
        membroDesde: "membro desde janeiro de 2024",
      },
      {
        nome: "Paulo Henrique Sato",
        iniciais: "PS",
        motivo: "escopo",
        quando: "há 10 dias",
        membroDesde: "membro desde março de 2025",
      },
      {
        nome: "Beatriz Camargo",
        iniciais: "BC",
        motivo: "spam",
        quando: "há 10 dias",
        membroDesde: "membro desde maio de 2025",
      },
      {
        nome: "Luana Prestes",
        iniciais: "LP",
        motivo: "spam",
        quando: "há 9 dias",
        membroDesde: "membro desde junho de 2025",
      },
    ],
  },
  {
    id: "r6",
    alvoTipo: "avaliacao",
    autorId: "carla",
    diasAberto: 3,
    trecho:
      "A pista está esburacada e o banheiro vive trancado. Mas o pessoal da manutenção é um bando de incompetente mesmo.",
    conteudo: {
      nota: 2,
      local: "Parque das Águas",
      bairro: "Jardim Abaeté",
      data: "6 de agosto de 2026",
      corpo:
        "A pista está esburacada e o banheiro vive trancado desde maio. Mas o pessoal da manutenção é um bando de incompetente mesmo, não adianta reclamar.",
    },
    denunciantes: [
      {
        nome: "Bruno Okamoto",
        iniciais: "BO",
        motivo: "ofensa",
        quando: "há 3 dias",
        membroDesde: "membro desde janeiro de 2025",
      },
      {
        nome: "Ana Paula Ferraz",
        iniciais: "AF",
        motivo: "ofensa",
        quando: "há 2 dias",
        membroDesde: "membro desde agosto de 2023",
      },
      {
        nome: "Hugo Bandeira",
        iniciais: "HB",
        motivo: "ofensa",
        quando: "há 2 dias",
        membroDesde: "membro desde abril de 2026",
      },
    ],
  },
  {
    id: "r7",
    alvoTipo: "comentario",
    autorId: "rogerio",
    diasAberto: 8,
    trecho:
      "Acervo fraco, dono antipático e preço de livraria nova. Não sei o que vocês veem nesse lugar.",
    conteudo: {
      local: "Sebo da Rua XV",
      bairro: "Centro",
      data: "1 de agosto de 2026",
      corpo:
        "Acervo fraco, dono antipático e preço de livraria nova. Não sei o que vocês veem nesse lugar, sinceramente.",
      avaliacaoMae: {
        autor: "Silvana D. Moraes",
        nota: 4,
        corpo:
          "Sebo pequeno mas bem curado, com uma seção de discos que vale a visita de sábado.",
      },
    },
    denunciantes: [
      {
        nome: "Silvana D. Moraes",
        iniciais: "SM",
        motivo: "ofensa",
        quando: "há 8 dias",
        membroDesde: "membro desde janeiro de 2024",
      },
      {
        nome: "Sueli Menezes",
        iniciais: "SU",
        motivo: "ofensa",
        quando: "há 7 dias",
        membroDesde: "membro desde fevereiro de 2024",
      },
    ],
  },
  {
    // Segunda coordenada, para o filtro de sinal ter mais de um resultado.
    id: "r8",
    alvoTipo: "avaliacao",
    autorId: "tatiane",
    diasAberto: 5,
    trecho:
      "Feira suja, barraca de temperos vende produto vencido. Denunciei na prefeitura e ninguém faz nada.",
    conteudo: {
      nota: 1,
      local: "Feira da Manga",
      bairro: "Vila Haro",
      data: "4 de agosto de 2026",
      corpo:
        "Feira suja, barraca de temperos vende produto vencido. Denunciei na prefeitura e ninguém faz nada. Evitem, principalmente com criança.",
    },
    denunciantes: [
      {
        nome: "G. Peçanha",
        iniciais: "GP",
        motivo: "falsa",
        quando: "há 5 dias",
        diasDeConta: 3,
      },
      {
        nome: "vini_2026",
        iniciais: "VI",
        motivo: "falsa",
        quando: "há 5 dias",
        diasDeConta: 2,
      },
      {
        nome: "Alessandra M.",
        iniciais: "AM",
        motivo: "falsa",
        quando: "há 4 dias",
        diasDeConta: 2,
      },
      {
        nome: "dede.silva",
        iniciais: "DS",
        motivo: "falsa",
        quando: "há 4 dias",
        diasDeConta: 1,
      },
      {
        nome: "Kleber A.",
        iniciais: "KA",
        motivo: "falsa",
        quando: "há 4 dias",
        diasDeConta: 3,
      },
      {
        nome: "mari.hs",
        iniciais: "MH",
        motivo: "falsa",
        quando: "há 3 dias",
        diasDeConta: 1,
      },
    ],
  },
  {
    id: "r9",
    alvoTipo: "ponto",
    alvoNome: "Trilha da Serra São Francisco",
    autorId: "carla",
    diasAberto: 1,
    trecho:
      "Trilha em propriedade particular com portão trancado — não é acesso público.",
    conteudo: {
      bairro: "Éden",
      categoria: "Lazer",
      coordenadas: "-23.4318, -47.5106",
      fotoNome: "ponto-trilha-01.jpg · 1600×1200",
      corpo:
        "Trilha em propriedade particular, com portão trancado e aviso de proibida a entrada. Não é acesso público.",
    },
    denunciantes: [
      {
        nome: "Rogério Tavares",
        iniciais: "RT",
        motivo: "escopo",
        quando: "há 1 dia",
        membroDesde: "membro desde junho de 2025",
      },
      {
        nome: "Adilson Freire",
        iniciais: "AD",
        motivo: "escopo",
        quando: "há 1 dia",
        membroDesde: "membro desde maio de 2025",
      },
    ],
  },
];

export type FeedbackKind = "bug" | "sugestao" | "elogio";
export type FeedbackStatus = "novo" | "lido" | "respondido";

export const FEEDBACK_KIND_LABEL: Record<FeedbackKind, string> = {
  bug: "Bug",
  sugestao: "Sugestão",
  elogio: "Elogio",
};

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  novo: "Novo",
  lido: "Lido",
  respondido: "Respondido",
};

/**
 * Envio de feedback. **Não tem alvo** — é sobre o produto, não sobre conteúdo
 * de outro usuário, e por isso não há o que remover nem quem punir.
 */
export interface FeedbackMock {
  id: string;
  tipo: FeedbackKind;
  mensagem: string;
  status: FeedbackStatus;
  /** Dias desde o envio. Formatado por `formatWaitingDays`. */
  diasRecebido: number;

  /** Ausente = envio anônimo, que não tem canal de resposta. */
  autor?: { nome: string; iniciais: string; titulo: string };

  /** Só bug: onde aconteceu. É o que separa relato acionável de "não funciona". */
  rota?: string;
  dispositivo?: string;
}

export const feedbackMock: FeedbackMock[] = [
  {
    id: "f1",
    tipo: "bug",
    status: "novo",
    diasRecebido: 1,
    autor: {
      nome: "Bruno Okamoto",
      iniciais: "BO",
      titulo: "Explorador · 4 conquistas",
    },
    rota: "/places/new",
    dispositivo: "Chrome · Android",
    mensagem:
      'Tentei cadastrar a Padaria Nova Ipanema e o botão "Salvar ponto" não faz nada depois que eu anexo a segunda foto. Não aparece erro, a tela só fica parada. Tentei três vezes, na terceira o formulário voltou vazio e perdi tudo que eu tinha digitado.',
  },
  {
    id: "f2",
    tipo: "sugestao",
    status: "novo",
    diasRecebido: 1,
    autor: {
      nome: "Ana Paula Ferraz",
      iniciais: "AF",
      titulo: "Guia local · 9 conquistas",
    },
    mensagem:
      'Seria muito útil poder filtrar o mapa por "aberto agora". Hoje eu descubro que o lugar está fechado só quando chego lá. O horário já está no cadastro, é só cruzar com a hora do celular.',
  },
  {
    id: "f3",
    tipo: "elogio",
    status: "novo",
    diasRecebido: 2,
    mensagem:
      "Descobri o Cabocafé por aqui e virou meu ponto de sábado. Muito bom ter um mapa feito por gente da cidade e não por algoritmo de fora. Obrigado a quem mantém isso de pé.",
  },
  {
    id: "f4",
    tipo: "bug",
    status: "novo",
    diasRecebido: 2,
    rota: "/home",
    dispositivo: "Safari · iOS 18",
    mensagem:
      "O mapa fica cinza quando eu dou zoom muito rápido. Só volta se eu fechar e abrir o app de novo.",
  },
  {
    id: "f5",
    tipo: "sugestao",
    status: "novo",
    diasRecebido: 3,
    autor: {
      nome: "Edson Kimura",
      iniciais: "EK",
      titulo: "Explorador · 5 conquistas",
    },
    mensagem:
      "Deixem eu salvar uma lista de lugares para visitar depois, tipo um roteiro. Favoritos não serve porque é onde eu já fui.",
  },
  {
    id: "f6",
    tipo: "bug",
    status: "novo",
    diasRecebido: 4,
    autor: {
      nome: "Carla Menezes",
      iniciais: "CM",
      titulo: "Explorador · 4 conquistas",
    },
    rota: "/places/12",
    dispositivo: "Firefox · Windows",
    mensagem:
      "A nota do Bar do Zeca aparece 4,5 na busca e 4,2 na página do local. Um dos dois está errado.",
  },
  {
    id: "f7",
    tipo: "elogio",
    status: "novo",
    diasRecebido: 5,
    autor: {
      nome: "Silvana D. Moraes",
      iniciais: "SM",
      titulo: "Guia local · 9 conquistas",
    },
    mensagem:
      "A fila de aprovação melhorou muito depois que vocês passaram a devolver o ponto em vez de recusar direto. Deu vontade de completar o cadastro.",
  },
  {
    id: "f8",
    tipo: "sugestao",
    status: "lido",
    diasRecebido: 6,
    autor: {
      nome: "Rogério Tavares",
      iniciais: "RT",
      titulo: "Explorador · 3 conquistas",
    },
    mensagem:
      "Notificação quando um lugar que eu favoritei muda de horário ou fecha. Fui num sebo que tinha mudado de endereço.",
  },
  {
    id: "f9",
    tipo: "bug",
    status: "lido",
    diasRecebido: 7,
    autor: {
      nome: "Ivete Ramos",
      iniciais: "IR",
      titulo: "Explorador · 5 conquistas",
    },
    rota: "/profile",
    dispositivo: "Chrome · Windows",
    mensagem:
      "Minhas conquistas aparecem duplicadas no perfil depois que eu troco de aba e volto.",
  },
  {
    id: "f10",
    tipo: "sugestao",
    status: "respondido",
    diasRecebido: 8,
    mensagem: "Modo escuro no app inteiro, não só no mapa.",
  },
  {
    id: "f11",
    tipo: "elogio",
    status: "respondido",
    diasRecebido: 9,
    autor: {
      nome: "Márcia Bueno",
      iniciais: "MB",
      titulo: "Novato · 2 conquistas",
    },
    mensagem:
      "Recebi o pedido de posse da padaria aprovado em dois dias. Atendimento melhor que de banco.",
  },
  {
    id: "f12",
    tipo: "sugestao",
    status: "respondido",
    diasRecebido: 11,
    autor: {
      nome: "Fábio Nunes",
      iniciais: "FN",
      titulo: "Explorador · 3 conquistas",
    },
    mensagem:
      "Colocar a feira livre com dia da semana em vez de horário fixo. Feira de quarta e de sábado são coisas diferentes.",
  },
  {
    id: "f13",
    tipo: "sugestao",
    status: "lido",
    diasRecebido: 12,
    autor: {
      nome: "Clóvis Bertolini",
      iniciais: "CB",
      titulo: "Explorador · 5 conquistas",
    },
    mensagem:
      'Deixem marcar "fui aqui" sem precisar escrever avaliação. Nem toda visita rende texto, mas conta como visita.',
  },
  {
    id: "f14",
    tipo: "sugestao",
    status: "lido",
    diasRecebido: 13,
    mensagem:
      "Filtro de acessibilidade: rampa, banheiro adaptado, piso tátil. Faz diferença para escolher onde ir.",
  },
  {
    id: "f15",
    tipo: "sugestao",
    status: "lido",
    diasRecebido: 14,
    autor: {
      nome: "Beatriz Camargo",
      iniciais: "BC",
      titulo: "Explorador · 4 conquistas",
    },
    mensagem:
      "Mostrar quantas pessoas visitaram o lugar no último mês. Ajuda a saber se o ponto está vivo ou parado.",
  },
  {
    id: "f16",
    tipo: "sugestao",
    status: "respondido",
    diasRecebido: 16,
    autor: {
      nome: "Luana Prestes",
      iniciais: "LP",
      titulo: "Novato · 2 conquistas",
    },
    mensagem:
      "Busca por bairro na tela de explorar, não só por nome. Quero ver tudo da Vila Hortência de uma vez.",
  },
  {
    id: "f17",
    tipo: "sugestao",
    status: "respondido",
    diasRecebido: 18,
    autor: {
      nome: "Jorge Tanaka",
      iniciais: "JT",
      titulo: "Guia local · 8 conquistas",
    },
    mensagem:
      "Permitir editar minha própria avaliação depois de publicar. Hoje só dá para apagar e escrever de novo.",
  },
  {
    id: "f18",
    tipo: "sugestao",
    status: "respondido",
    diasRecebido: 21,
    autor: {
      nome: "Sueli Menezes",
      iniciais: "SU",
      titulo: "Explorador · 6 conquistas",
    },
    mensagem:
      "Compartilhar um ponto por link direto, com foto e nota, para mandar no grupo da família.",
  },
];

/** Números que só um agregado dará — hoje fixos. */
export const reportsSummaryMock = {
  resolvidosNaSemana: 14,
  tempoMedioResolucao: "14 h",
};
