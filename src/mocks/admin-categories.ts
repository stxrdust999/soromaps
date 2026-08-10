/**
 * Catálogo fictício de categorias de ponto.
 *
 * A tabela `Categoria` não existe: hoje categoria é string solta em
 * `src/mocks/markers.ts` e constante no front. Ícone, cor e ordem — que são a
 * razão desta tela existir — não têm coluna nenhuma para morar.
 * Ver `docs/todo/admin/categories.md`.
 *
 * As contagens de `pontos` batem com a rosca "Segmentação de pontos" do
 * dashboard (`src/mocks/admin-dashboard.ts`); mexer numa exige mexer na outra
 * enquanto as duas forem mock.
 */

import type { CategoryIconKey } from "@/constants/categories";

export interface CategoryMock {
  id: string;
  nome: string;
  /** Deriva do nome e vira o filtro `/discover?categoria=...`. */
  slug: string;
  pontos: number;
  novosNaSemana: number;
  /** Inativa some dos filtros do app, mas mantém os pontos vinculados. */
  ativa: boolean;
  /** Posição nos filtros do app. Sempre 1..n, sem buraco. */
  ordem: number;
  cor: string;
  icone: CategoryIconKey;
}

export const categoriesMock: CategoryMock[] = [
  {
    id: "gastronomia",
    nome: "Gastronomia",
    slug: "gastronomia",
    pontos: 1411,
    novosNaSemana: 37,
    ativa: true,
    ordem: 1,
    cor: "#ea580c",
    icone: "utensils",
  },
  {
    id: "parque",
    nome: "Parque",
    slug: "parque",
    pontos: 670,
    novosNaSemana: 9,
    ativa: true,
    ordem: 2,
    cor: "#16a34a",
    icone: "trees",
  },
  {
    id: "bar",
    nome: "Bar",
    slug: "bar",
    pontos: 512,
    novosNaSemana: 12,
    ativa: true,
    ordem: 3,
    cor: "#7c3aed",
    icone: "beer",
  },
  {
    id: "cafeteria",
    nome: "Cafeteria",
    slug: "cafeteria",
    pontos: 280,
    novosNaSemana: 12,
    ativa: true,
    ordem: 4,
    cor: "#78350f",
    icone: "coffee",
  },
  {
    id: "cultura",
    nome: "Cultura",
    slug: "cultura",
    pontos: 96,
    novosNaSemana: 3,
    ativa: true,
    ordem: 5,
    cor: "#db2777",
    icone: "landmark",
  },
  {
    id: "compras",
    nome: "Compras",
    slug: "compras",
    pontos: 58,
    novosNaSemana: 1,
    ativa: true,
    ordem: 6,
    cor: "#0891b2",
    icone: "shopping-bag",
  },
  {
    id: "lazer",
    nome: "Lazer",
    slug: "lazer",
    pontos: 40,
    novosNaSemana: 0,
    ativa: true,
    ordem: 7,
    cor: "#eab308",
    icone: "ferris-wheel",
  },
  {
    id: "esporte",
    nome: "Esporte",
    slug: "esporte",
    pontos: 0,
    novosNaSemana: 0,
    ativa: true,
    ordem: 8,
    cor: "#4d7c0f",
    icone: "dumbbell",
  },
  {
    id: "hospedagem",
    nome: "Hospedagem",
    slug: "hospedagem",
    pontos: 0,
    novosNaSemana: 0,
    ativa: false,
    ordem: 9,
    cor: "#475569",
    icone: "bed-double",
  },
  {
    // Colide de propósito com "Bar" (#7c3aed): é o caso que a tela precisa
    // deixar óbvio antes de o mapa ficar ilegível.
    id: "vida-noturna",
    nome: "Vida noturna",
    slug: "vida-noturna",
    pontos: 0,
    novosNaSemana: 0,
    ativa: false,
    ordem: 10,
    cor: "#8b5cf6",
    icone: "wine",
  },
];
