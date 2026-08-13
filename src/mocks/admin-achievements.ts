/**
 * Catálogo fictício de conquistas.
 *
 * As tabelas `Conquista` e `GanhaConquista` não existem, nem o motor de
 * concessão que leria o critério — ver `docs/todo/admin/achievements.md`.
 * `obtencoes` e `raridade` seriam agregados sobre `GanhaConquista`.
 *
 * **Sem pontuação e sem nível**: decisão de 2026-08-12 no `CLAUDE.md`.
 * Conquista não vale XP; o que substitui o nível é um título derivado da
 * contagem de conquistas do usuário.
 */

import type {
  AchievementEventKey,
  AchievementIconKey,
  AchievementTargetKind,
} from "@/constants/achievements";

export interface AchievementMock {
  id: string;
  nome: string;
  /** Frase curta que o jogador lê no app. */
  descricao: string;

  evento: AchievementEventKey;
  quantidade: number;
  tipoAlvo: AchievementTargetKind | null;
  alvo: string | null;

  /** Quantos usuários já ganharam. Zero = calibragem errada. */
  obtencoes: number;
  /** Percentil de quem tem a conquista. */
  raridade: number;

  ativa: boolean;
  icone: AchievementIconKey;
  cor: string;
}

export const achievementsMock: AchievementMock[] = [
  {
    id: "a1",
    nome: "Explorador Iniciante",
    descricao: "O primeiro lugar do mapa é o mais difícil",
    evento: "visitar",
    quantidade: 1,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 1204,
    raridade: 78,
    ativa: true,
    icone: "footprints",
    cor: "#1447e6",
  },
  {
    id: "a2",
    nome: "Caçador de Cafés",
    descricao: "Para quem conhece o café de cada esquina",
    evento: "visitar",
    quantidade: 5,
    tipoAlvo: "categoria",
    alvo: "Cafeteria",
    obtencoes: 312,
    raridade: 20,
    ativa: true,
    icone: "coffee",
    cor: "#78350f",
  },
  {
    id: "a3",
    nome: "Crítico de Plantão",
    descricao: "Sua opinião move a comunidade",
    evento: "avaliar",
    quantidade: 10,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 268,
    raridade: 17,
    ativa: true,
    icone: "pen-line",
    cor: "#0891b2",
  },
  {
    id: "a4",
    nome: "Pé na Estrada",
    descricao: "Vinte lugares e nenhuma pressa",
    evento: "visitar",
    quantidade: 20,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 141,
    raridade: 9,
    ativa: true,
    icone: "compass",
    cor: "#0f766e",
  },
  {
    id: "a5",
    nome: "Conhecido do Centro",
    descricao: "O Centro inteiro na palma da mão",
    evento: "visitar",
    quantidade: 8,
    tipoAlvo: "bairro",
    alvo: "Centro",
    obtencoes: 97,
    raridade: 6,
    ativa: true,
    icone: "landmark",
    cor: "#db2777",
  },
  {
    id: "a6",
    nome: "Boa Companhia",
    descricao: "Descobrir junto rende mais",
    evento: "seguir",
    quantidade: 15,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 74,
    raridade: 5,
    ativa: true,
    icone: "users",
    cor: "#7c3aed",
  },
  {
    id: "a7",
    nome: "Guia Local",
    descricao: "Você colocou Sorocaba no mapa",
    evento: "criar",
    quantidade: 10,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 41,
    raridade: 3,
    ativa: true,
    icone: "map",
    cor: "#4d7c0f",
  },
  {
    id: "a8",
    nome: "Fotógrafo do Bairro",
    descricao: "Cinco pontos novos com foto decente",
    evento: "criar",
    quantidade: 5,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 186,
    raridade: 12,
    ativa: true,
    icone: "camera",
    cor: "#8b5cf6",
  },
  {
    id: "a9",
    nome: "Paladar Local",
    descricao: "A cozinha da cidade não tem segredo",
    evento: "visitar",
    quantidade: 10,
    tipoAlvo: "categoria",
    alvo: "Gastronomia",
    obtencoes: 132,
    raridade: 9,
    ativa: true,
    icone: "utensils",
    cor: "#ea580c",
  },
  {
    id: "a10",
    nome: "Vizinho Ilustre",
    descricao: "Santa Rosália conhece você",
    evento: "visitar",
    quantidade: 5,
    tipoAlvo: "bairro",
    alvo: "Santa Rosália",
    obtencoes: 118,
    raridade: 8,
    ativa: true,
    icone: "map-pin",
    cor: "#16a34a",
  },
  {
    id: "a11",
    nome: "Favorito Fiel",
    descricao: "Dez lugares que você sempre volta",
    evento: "favoritar",
    quantidade: 10,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 96,
    raridade: 6,
    ativa: true,
    icone: "heart",
    cor: "#db2777",
  },
  {
    id: "a12",
    nome: "Sequência de Sete",
    descricao: "Uma semana sem repetir lugar",
    evento: "sequencia",
    quantidade: 7,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 74,
    raridade: 5,
    ativa: true,
    icone: "flame",
    cor: "#ea580c",
  },
  {
    id: "a13",
    nome: "Voz da Comunidade",
    descricao: "Vinte e cinco avaliações escritas",
    evento: "avaliar",
    quantidade: 25,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 58,
    raridade: 4,
    ativa: true,
    icone: "message-square",
    cor: "#0891b2",
  },
  {
    // Zerada de propósito: doze bares é meta alta demais para a base de hoje.
    id: "a14",
    nome: "Noite Sorocabana",
    descricao: "Doze bares e ainda de pé",
    evento: "visitar",
    quantidade: 12,
    tipoAlvo: "categoria",
    alvo: "Bar",
    obtencoes: 0,
    raridade: 0,
    ativa: true,
    icone: "beer",
    cor: "#7c3aed",
  },
  {
    id: "a15",
    nome: "Colecionador de Parques",
    descricao: "Trinta parques é quase um censo",
    evento: "visitar",
    quantidade: 30,
    tipoAlvo: "categoria",
    alvo: "Parque",
    obtencoes: 0,
    raridade: 0,
    ativa: true,
    icone: "trees",
    cor: "#16a34a",
  },
  {
    id: "a16",
    nome: "Padrinho",
    descricao: "Trinta pessoas na sua rede",
    evento: "seguir",
    quantidade: 30,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 31,
    raridade: 2,
    ativa: false,
    icone: "crown",
    cor: "#eab308",
  },
  {
    id: "a17",
    nome: "Mapa Cheio",
    descricao: "Cinquenta lugares visitados",
    evento: "visitar",
    quantidade: 50,
    tipoAlvo: null,
    alvo: null,
    obtencoes: 15,
    raridade: 1,
    ativa: false,
    icone: "mountain",
    cor: "#475569",
  },
  {
    id: "a18",
    nome: "Inverno em Sorocaba",
    descricao: "Cultura também é passeio de rua",
    evento: "visitar",
    quantidade: 5,
    tipoAlvo: "categoria",
    alvo: "Cultura",
    obtencoes: 0,
    raridade: 0,
    ativa: false,
    icone: "book-open",
    cor: "#0f766e",
  },
];

/** Bairros oferecidos como alvo — os mesmos de `src/mocks/markers.ts`. */
export const ACHIEVEMENT_TARGET_NEIGHBORHOODS = [
  "Centro",
  "Santa Rosália",
  "Vila Haro",
  "Vila Hortência",
  "Jardim Abaeté",
  "Ipanema das Pedras",
  "Vila Barcelona",
];
