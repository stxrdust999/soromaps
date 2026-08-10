"use client";

import { useCallback, useMemo, useState } from "react";

import { type CategoryMock, categoriesMock } from "@/mocks/admin-categories";
import { hexDistance } from "@/utils/colors/hex-distance";
import { slugify } from "@/utils/formatters/slugify";
import type { CategoryFormSchema } from "@/validations/categories";

/**
 * Abaixo desta distância RGB dois pins deixam de se distinguir à distância no
 * mapa. Calibrado no olho sobre a paleta de `CATEGORY_COLORS`, não medido.
 */
const COLLISION_THRESHOLD = 70;

/**
 * Primeira categoria com cor perto demais da informada.
 *
 * @param categories Catálogo inteiro.
 * @param color Cor a testar.
 * @param ignoreId Categoria a ignorar — a própria, ao editar.
 * @returns A categoria conflitante, ou `null`.
 */
export function findColorCollision(
  categories: CategoryMock[],
  color: string,
  ignoreId?: string | null,
): CategoryMock | null {
  return (
    categories.find(
      (category) =>
        category.id !== ignoreId &&
        hexDistance(category.cor, color) < COLLISION_THRESHOLD,
    ) ?? null
  );
}

/**
 * Garante slug único somando sufixo numérico — dois nomes parecidos gerariam
 * o mesmo slug, e slug é chave pública de filtro.
 */
function uniqueSlug(
  categories: CategoryMock[],
  nome: string,
  ignoreId?: string | null,
): string {
  const base = slugify(nome) || "categoria";
  const taken = new Set(
    categories.filter((c) => c.id !== ignoreId).map((c) => c.slug),
  );

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/** Reescreve `ordem` como 1..n para a coluna nunca mostrar buraco. */
function renumber(categories: CategoryMock[]): CategoryMock[] {
  return [...categories]
    .sort((a, b) => a.ordem - b.ordem)
    .map((category, index) => ({ ...category, ordem: index + 1 }));
}

/**
 * Catálogo de categorias em memória. Não há API nem tabela `Categoria`, então
 * criar, editar e excluir mexem apenas neste array.
 *
 * Quando o `CategoriesController` existir, isto vira `src/http/categories` +
 * Server Actions, e o que sobra aqui é só o estado de diálogo.
 */
export function useCategories() {
  const [categories, setCategories] = useState<CategoryMock[]>(categoriesMock);

  const stats = useMemo(
    () => ({
      total: categories.length,
      ativas: categories.filter((c) => c.ativa).length,
      vazias: categories.filter((c) => c.pontos === 0).length,
      pontos: categories.reduce((sum, c) => sum + c.pontos, 0),
    }),
    [categories],
  );

  const save = useCallback((values: CategoryFormSchema, id: string | null) => {
    setCategories((current) => {
      const slug = uniqueSlug(current, values.nome, id);

      if (id) {
        return current.map((category) =>
          category.id === id
            ? { ...category, ...values, slug, icone: values.icone }
            : category,
        );
      }

      return [
        ...current,
        {
          ...values,
          icone: values.icone,
          id: slug,
          slug,
          pontos: 0,
          novosNaSemana: 0,
          ordem: current.length + 1,
        },
      ];
    });
  }, []);

  const duplicate = useCallback((id: string) => {
    setCategories((current) => {
      const source = current.find((category) => category.id === id);
      if (!source) return current;

      const nome = `${source.nome} (cópia)`;
      const slug = uniqueSlug(current, nome);

      return [
        ...current,
        {
          ...source,
          id: slug,
          nome,
          slug,
          pontos: 0,
          novosNaSemana: 0,
          // Cópia nasce inativa: publicá-la antes de trocar cor e ícone é
          // exatamente como se cria a colisão que esta tela denuncia.
          ativa: false,
          ordem: current.length + 1,
        },
      ];
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, ativa: !category.ativa } : category,
      ),
    );
  }, []);

  const move = useCallback((id: string, delta: number) => {
    setCategories((current) => {
      const sorted = [...current].sort((a, b) => a.ordem - b.ordem);
      const index = sorted.findIndex((category) => category.id === id);
      const target = index + delta;

      if (index < 0 || target < 0 || target >= sorted.length) return current;

      [sorted[index], sorted[target]] = [sorted[target], sorted[index]];
      return renumber(sorted);
    });
  }, []);

  /**
   * Exclui reatribuindo os pontos. `targetId` é obrigatório sempre que a
   * categoria tem ponto vinculado — ponto sem categoria some do filtro do app
   * sem deixar rastro.
   */
  const remove = useCallback((id: string, targetId?: string) => {
    setCategories((current) => {
      const victim = current.find((category) => category.id === id);
      if (!victim) return current;
      if (victim.pontos > 0 && !targetId) return current;

      return renumber(
        current
          .filter((category) => category.id !== id)
          .map((category) =>
            category.id === targetId
              ? { ...category, pontos: category.pontos + victim.pontos }
              : category,
          ),
      );
    });
  }, []);

  return {
    categories,
    stats,
    save,
    duplicate,
    toggleActive,
    move,
    remove,
  };
}
