/**
 * Dados fictícios de local — o que o modelo de Ponto ainda **não** persiste.
 *
 * A API devolve `nome`/`lat`/`lng`; foto, categoria, amenidades e o resto só
 * existem aqui, para as telas poderem ser desenhadas e revisadas antes de o
 * schema crescer. Spec do modelo real:
 * `docs/propostas/2026-08-03-expansao-modelo-ponto.md`.
 *
 * Sai daqui quando a API passar a devolver esses campos.
 */

export interface MarkerDetailsMock {
  nome: string;
  bairro: string;
  /** Foto de capa — banner, card do feed e popup do mapa. */
  fotoUrl: string;
  /** Galeria da página do local; a capa entra como primeira. */
  fotos: string[];
  /** Chamada de uma linha, para card e popup do mapa. */
  sobre: string;
  /** Texto da seção "Descrição" da página do local — dois ou três períodos. */
  descricao: string;
  categoria: string;
  temWifi: boolean;
  petFriendly: boolean;
  melhorHorario?: string;
  segredoLocal?: string;
  nota: number;
  totalAvaliacoes: number;
  /** Em km, a partir do centro de Sorocaba — sem cálculo real de distância. */
  distancia: number;
}

const photo = (seed: number) => `https://picsum.photos/seed/${seed}/400/300`;

export const markerDetailsMocks: MarkerDetailsMock[] = [
  {
    nome: "Cabocafé",
    bairro: "Santa Rosália",
    fotoUrl: photo(14),
    fotos: [photo(14), photo(71), photo(72), photo(73)],
    sobre:
      "Café pequeno de esquina, torra própria e bolo de fubá saindo do forno às quatro.",
    descricao:
      "Ocupa uma casa antiga de esquina, com sete mesas e um balcão que quase sempre tem alguém conversando com o barista. O café é torrado ali mesmo, em lotes pequenos, e o quadro-negro muda conforme o que chegou do produtor. Tem tomada em quase toda mesa, o que fez o lugar virar escritório informal de meia dúzia de gente do bairro.",
    categoria: "Cafeteria",
    temWifi: true,
    petFriendly: true,
    melhorHorario: "Fim de tarde, depois das 16h",
    segredoLocal: "Peça o café da casa com rapadura — não está no cardápio.",
    nota: 4.8,
    totalAvaliacoes: 21,
    distancia: 1.2,
  },
  {
    nome: "Parque das Águas",
    bairro: "Jardim Abaeté",
    fotoUrl: photo(16),
    fotos: [photo(16), photo(74), photo(75), photo(76)],
    sobre:
      "Pista de caminhada em volta do lago, sombra de verdade e pouca gente no meio da semana.",
    descricao:
      "São quase dois quilômetros de pista contornando o lago, com trecho de terra batida para quem corre e calçada para quem só quer andar. A arborização é antiga, então sombra não falta nem no meio do dia. Fim de semana enche por causa da feirinha na entrada principal; no meio da semana o parque é praticamente de quem mora em volta.",
    categoria: "Parque",
    temWifi: false,
    petFriendly: true,
    melhorHorario: "Manhã de terça a quinta",
    segredoLocal:
      "A entrada dos fundos tem estacionamento livre e fica a 2 minutos do lago.",
    nota: 4.6,
    totalAvaliacoes: 87,
    distancia: 3.4,
  },
  {
    nome: "Bar do Zeca",
    bairro: "Centro",
    fotoUrl: photo(23),
    fotos: [photo(23), photo(77), photo(78), photo(79)],
    sobre:
      "Boteco de balcão, chope gelado e o melhor bolinho de bacalhau da região.",
    descricao:
      "Boteco de balcão comprido no sentido literal: a maior parte da clientela bebe em pé mesmo, e as poucas mesas ficam na calçada. O cardápio é curto e não muda há anos — o bolinho de bacalhau é o que trouxe a fama, mas o pastel de carne segura o mesmo nível. A partir das oito de sexta é difícil achar lugar.",
    categoria: "Bar",
    temWifi: false,
    petFriendly: false,
    melhorHorario: "Sexta a partir das 19h",
    segredoLocal: "Mesa dos fundos é a única com tomada — chega cedo.",
    nota: 4.4,
    totalAvaliacoes: 132,
    distancia: 0.8,
  },
  {
    nome: "Sebo da Rua XV",
    bairro: "Centro",
    fotoUrl: photo(31),
    fotos: [photo(31), photo(80), photo(81), photo(82)],
    sobre:
      "Dois andares de livro usado, com uma seção de quadrinhos que ninguém espera.",
    descricao:
      "O térreo é o que se espera de sebo: literatura, didáticos e uma mesa de promoção que vale garimpar. O segundo andar é a surpresa — uma sala inteira de quadrinhos e revistas antigas, organizada por editora. O dono conhece o acervo de cabeça e acha em dois minutos o que o sistema não encontraria.",
    categoria: "Compras",
    temWifi: true,
    petFriendly: true,
    segredoLocal:
      "O dono troca livro por livro se você levar algo da lista dele.",
    nota: 4.9,
    totalAvaliacoes: 44,
    distancia: 1.9,
  },
  {
    nome: "Cantina da Vila",
    bairro: "Vila Hortência",
    fotoUrl: photo(42),
    fotos: [photo(42), photo(83), photo(84), photo(85)],
    sobre: "Massa fresca feita na hora, cardápio curto e fila que anda rápido.",
    descricao:
      "Cantina de bairro no formato clássico: cardápio de uma página, massa feita na hora e molho que não muda de receita desde que abriu. O salão é pequeno e costuma formar fila na porta, mas a rotatividade é alta e a espera raramente passa de quinze minutos. Domingo no almoço é outra história.",
    categoria: "Restaurante",
    temWifi: true,
    petFriendly: false,
    melhorHorario: "Evita o almoço de domingo",
    nota: 4.7,
    totalAvaliacoes: 256,
    distancia: 2.6,
  },
  {
    nome: "Mirante do Ipanema",
    bairro: "Ipanema das Pedras",
    fotoUrl: photo(57),
    fotos: [photo(57), photo(86), photo(87), photo(88)],
    sobre:
      "Vista aberta da represa, ideal para o fim de tarde e para quem leva câmera.",
    descricao:
      "Ponto alto com vista limpa da represa, sem grade nem construção atrapalhando o enquadramento. Não tem estrutura nenhuma: nem banco, nem banheiro, nem quiosque — quem vai leva o que precisa. Em compensação, é o melhor pôr do sol que se acha sem sair da cidade.",
    categoria: "Point cultural",
    temWifi: false,
    petFriendly: true,
    melhorHorario: "Uma hora antes do pôr do sol",
    segredoLocal:
      "Suba pela trilha da direita: chega no mesmo lugar sem a subida íngreme.",
    nota: 4.5,
    totalAvaliacoes: 63,
    distancia: 5.1,
  },
];

/**
 * Escolhe um mock a partir do id do marker. Determinístico de propósito: o
 * mesmo ponto mostra sempre os mesmos dados, em vez de trocar a cada render.
 *
 * @param id Id do marker.
 * @returns Detalhes fictícios correspondentes.
 */
export function getMarkerDetailsMock(id: number): MarkerDetailsMock {
  const index = Math.abs(id) % markerDetailsMocks.length;
  return markerDetailsMocks[index];
}

/**
 * Quem mais visitou um local. Depende de três coisas que o banco não tem:
 * tabela `Visita`, FK ligando visita a usuário e a pontuação/nível do perfil.
 */
export interface PlaceVisitorMock {
  nome: string;
  nivel: number;
  visitas: number;
  /** Ausente de propósito em alguns: exercita o fallback de inicial do avatar. */
  avatarUrl?: string;
}

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

const placeLeaderboardMocks: PlaceVisitorMock[][] = [
  [
    { nome: "Maria S.", nivel: 8, visitas: 42, avatarUrl: avatar("maria") },
    { nome: "João P.", nivel: 7, visitas: 38, avatarUrl: avatar("joao") },
    { nome: "Ana Clara", nivel: 5, visitas: 21 },
  ],
  [
    { nome: "Rafael T.", nivel: 9, visitas: 57, avatarUrl: avatar("rafael") },
    { nome: "Bruna L.", nivel: 6, visitas: 33 },
    { nome: "Diego M.", nivel: 4, visitas: 18, avatarUrl: avatar("diego") },
  ],
  [
    { nome: "Camila R.", nivel: 7, visitas: 29, avatarUrl: avatar("camila") },
    { nome: "Otávio F.", nivel: 5, visitas: 24, avatarUrl: avatar("otavio") },
    { nome: "Lúcia N.", nivel: 3, visitas: 11 },
  ],
];

/**
 * Ranking de visitantes de um local, escolhido pelo id como o
 * `getMarkerDetailsMock` — o mesmo lugar mantém o mesmo pódio.
 *
 * @param id Id do marker.
 * @returns Visitantes em ordem decrescente de visitas.
 */
export function getPlaceLeaderboardMock(id: number): PlaceVisitorMock[] {
  const index = Math.abs(id) % placeLeaderboardMocks.length;
  return placeLeaderboardMocks[index];
}

/**
 * Comentário em destaque de um explorador verificado. Depende de `Analise`
 * (o comentário em si) e do selo de verificação, que ainda não existe em
 * lugar nenhum — ver o backlog de produto no `CLAUDE.md`.
 */
export interface PlaceCommentMock {
  nome: string;
  nivel: number;
  avatarUrl?: string;
  comentario: string;
}

const placeCommentMocks: PlaceCommentMock[] = [
  {
    nome: "Maria S.",
    nivel: 8,
    avatarUrl: avatar("maria"),
    comentario:
      "Venho aqui há dois anos e nunca me decepcionou. O atendimento faz toda a diferença.",
  },
  {
    nome: "Rafael T.",
    nivel: 9,
    avatarUrl: avatar("rafael"),
    comentario:
      "Melhor lugar do bairro pra ir sem pressa. Sempre tem mesa livre no meio da semana.",
  },
  {
    nome: "Camila R.",
    nivel: 7,
    comentario:
      "Descobri por acaso e virou parada obrigatória. Vale o desvio, mesmo vindo de longe.",
  },
];

/**
 * Comentário destacado de um local, escolhido pelo id como os outros mocks.
 *
 * @param id Id do marker.
 * @returns Comentário fictício de explorador verificado.
 */
export function getPlaceCommentMock(id: number): PlaceCommentMock {
  const index = Math.abs(id) % placeCommentMocks.length;
  return placeCommentMocks[index];
}
