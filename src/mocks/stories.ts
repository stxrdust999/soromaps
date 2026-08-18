/**
 * Pautas da cidade — textos editoriais ancorados em lugares do mapa.
 *
 * Não existe tabela de pauta, e o corpo destas quatro foi escrito à mão para a
 * tela poder ser desenhada antes de a geração existir. Duas coisas são de
 * verdade e continuam valendo quando a entidade nascer:
 *
 * - **`origem: "ia"` é rótulo, não detalhe interno.** Texto sobre comércio real
 *   escrito por modelo aparece marcado para o leitor, sempre.
 * - **`status: "rascunho"` é o estado inicial de tudo que a IA escreve.** A
 *   geração é etapa de autoria; publicar é decisão de gente. Ver
 *   `src/actions/stories.ts` e `docs/todo/user/community.md`.
 */

export type StoryOrigin = "ia" | "equipe";
export type StoryStatus = "rascunho" | "publicada";

export interface StoryPlaceMock {
  id: number;
  nome: string;
  bairro: string;
  categoria: string;
}

export interface StoryMock {
  slug: string;
  /** Editoria, no chapéu acima do título. */
  chapeu: string;
  titulo: string;
  chamada: string;
  /** Um item por parágrafo. */
  corpo: string[];
  fotoUrl: string;
  locais: StoryPlaceMock[];
  origem: StoryOrigin;
  /** Modelo que redigiu o rascunho — só em `origem: "ia"`. */
  modelo?: string;
  /** Quem revisou e liberou. Ausente enquanto `status` é rascunho. */
  revisadoPor?: string;
  status: StoryStatus;
  /** Dias até a âncora de `src/mocks/feed.ts`. */
  diasAtras: number;
  tempoLeitura: number;
}

const photo = (seed: number) => `https://picsum.photos/seed/${seed}/1200/800`;

export const storiesMock: StoryMock[] = [
  {
    slug: "tres-cafes-para-trabalhar",
    chapeu: "Roteiro",
    titulo: "Três cafés para trabalhar sem gastar o dia inteiro",
    chamada:
      "Tomada em quase toda mesa, wi-fi que aguenta chamada de vídeo e ninguém olhando torto para quem fica duas horas.",
    corpo: [
      "Trabalhar fora de casa em Sorocaba costuma esbarrar em três problemas na mesma ordem: a mesa não tem tomada, o wi-fi cai na primeira chamada de vídeo, ou o lugar enche num horário que ninguém avisou. Os três cafés abaixo resolvem os dois primeiros e são previsíveis no terceiro — que é o que importa para quem precisa marcar reunião.",
      "O Cabocafé, em Santa Rosália, tem tomada em quase toda mesa e virou escritório informal de meia dúzia de gente do bairro. A recomendação de horário é do próprio público: o fim de tarde, depois das quatro, é quando o salão respira. O Largo do Café, no Centro, funciona melhor no meio da manhã — na quinta à noite ele é outro lugar, com samba de roda e mesa na calçada.",
      "O Café da Esquina Velha, no Além Ponte, entra na lista com uma ressalva honesta: são seis lugares no total, contando o balcão da janela. Não é lugar de passar a tarde, é lugar de uma hora concentrada antes das dez. Quem chega depois disso encontra o croissant esgotado e a janela ocupada.",
    ],
    fotoUrl: photo(22),
    locais: [
      {
        id: 1,
        nome: "Cabocafé",
        bairro: "Santa Rosália",
        categoria: "Cafeteria",
      },
      {
        id: 10,
        nome: "Largo do Café",
        bairro: "Centro",
        categoria: "Cafeteria",
      },
      {
        id: 16,
        nome: "Café da Esquina Velha",
        bairro: "Além Ponte",
        categoria: "Cafeteria",
      },
    ],
    origem: "ia",
    modelo: "gemini-2.5-flash",
    revisadoPor: "Equipe Soromaps",
    status: "publicada",
    diasAtras: 1,
    tempoLeitura: 4,
  },
  {
    slug: "o-que-abre-cedo-no-domingo",
    chapeu: "Roteiro",
    titulo: "O que abre cedo no domingo",
    chamada:
      "A pergunta mais repetida no mapa em fim de semana, respondida com três lugares que já estão funcionando antes das oito.",
    corpo: [
      "Domingo de manhã é o horário em que o mapa mais recebe busca e menos entrega resposta: a maior parte dos lugares cadastrados abre depois das dez. Estes três estão de portas abertas antes das oito, e todos foram conferidos por visita registrada este mês.",
      "A Feira da Manga, na Vila Haro, começa às seis e ocupa quatro quarteirões até o meio-dia. Vá antes das nove: depois disso a rua fica intransitável com carrinho de feira, e a fila da barraca de pastel do meio da rua passa dos vinte minutos. Leve dinheiro trocado — metade dos feirantes ainda não aceita cartão.",
      "O Parque Campolim abre a pista antes das sete e é o único da lista com estrutura para quem vai com criança. A Padaria Estação, na Vila Barcelona, fecha o roteiro: o pão sai de hora em hora e o café da manhã de balcão custa menos que em qualquer cafeteria da região.",
    ],
    fotoUrl: photo(17),
    locais: [
      {
        id: 11,
        nome: "Feira da Manga",
        bairro: "Vila Haro",
        categoria: "Compras",
      },
      {
        id: 7,
        nome: "Parque Campolim",
        bairro: "Parque Campolim",
        categoria: "Parque",
      },
      {
        id: 12,
        nome: "Padaria Estação",
        bairro: "Vila Barcelona",
        categoria: "Gastronomia",
      },
    ],
    origem: "ia",
    modelo: "gemini-2.5-flash",
    revisadoPor: "Equipe Soromaps",
    status: "publicada",
    diasAtras: 4,
    tempoLeitura: 3,
  },
  {
    slug: "o-centro-que-ainda-tem-galeria",
    chapeu: "Spotlight",
    titulo: "O Centro que ainda tem galeria de rua",
    chamada:
      "Loja de disco, conserto de relógio e lanchonete de balcão sobreviveram no mesmo corredor — e fecham às seis, como sempre fecharam.",
    corpo: [
      "A Galeria Rio Branco é dos anos setenta e sobreviveu inteira, o que no centro de qualquer cidade média já é notícia. O corredor tem loja de disco, chaveiro, conserto de relógio e uma lanchonete de balcão no fundo, na mesma configuração de quando abriu.",
      "O padrão de visita registrado no mapa conta uma história específica: quase todo mundo chega por acaso, atravessando, e volta de propósito depois. É o oposto do comércio de shopping, que depende de fluxo planejado. Vale saber que ela fecha às seis — não adianta passar depois do trabalho.",
      "A duas quadras dali, o Sebo da Rua XV faz o mesmo movimento em outro formato: o térreo é o esperado, e o segundo andar guarda uma sala inteira de quadrinhos e revistas antigas organizada por editora. Os dois endereços juntos são uma tarde completa sem gastar quase nada.",
    ],
    fotoUrl: photo(24),
    locais: [
      {
        id: 17,
        nome: "Galeria Rio Branco",
        bairro: "Centro",
        categoria: "Compras",
      },
      { id: 4, nome: "Sebo da Rua XV", bairro: "Centro", categoria: "Cultura" },
    ],
    origem: "equipe",
    revisadoPor: "Equipe Soromaps",
    status: "publicada",
    diasAtras: 7,
    tempoLeitura: 5,
  },
  {
    slug: "parques-comparados-pela-sombra",
    chapeu: "Comparativo",
    titulo: "Os parques da cidade, comparados pela sombra",
    chamada:
      "Arborização antiga, pista emborrachada e trilha de terra batida atendem gente diferente — e o mapa já sabe qual é qual.",
    corpo: [
      "Rascunho gerado a partir dos dados de quatro parques cadastrados: categoria, tags, melhor horário e as avaliações publicadas. Ainda não passou por revisão — os trechos sobre estrutura precisam ser conferidos no lugar antes de publicar.",
      "O Parque das Águas tem arborização antiga, então sombra não falta nem no meio do dia, e a pista contorna o lago em quase dois quilômetros. O Parque Campolim é o oposto: pista emborrachada, playground novo e movimento alto de domingo de manhã.",
      "O Bosque dos Ipês entra como terceira opção para quem quer trilha curta e silêncio, com o pico de visita concentrado em agosto por causa da florada.",
    ],
    fotoUrl: photo(21),
    locais: [
      {
        id: 2,
        nome: "Parque das Águas",
        bairro: "Jardim Abaeté",
        categoria: "Parque",
      },
      {
        id: 7,
        nome: "Parque Campolim",
        bairro: "Parque Campolim",
        categoria: "Parque",
      },
      {
        id: 15,
        nome: "Bosque dos Ipês",
        bairro: "Jardim Vera Cruz",
        categoria: "Parque",
      },
    ],
    origem: "ia",
    modelo: "gemini-2.5-flash",
    status: "rascunho",
    diasAtras: 0,
    tempoLeitura: 4,
  },
];

/** Só o que está publicado — rascunho não vaza para leitor. */
export const publishedStoriesMock = storiesMock.filter(
  (story) => story.status === "publicada",
);

/**
 * Pauta pelo slug.
 *
 * @param slug Slug da pauta.
 * @returns A pauta, ou `undefined` quando não existe.
 */
export function getStoryMock(slug: string): StoryMock | undefined {
  return storiesMock.find((story) => story.slug === slug);
}
