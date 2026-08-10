import z from "zod";

import { CATEGORY_ICON_KEYS } from "@/constants/categories";

/**
 * Formulário de categoria.
 *
 * **Não tem `slug`.** Ele deriva do nome via `slugify` na hora de salvar: slug
 * editável é um identificador público que o admin pode quebrar sem perceber,
 * levando junto todo link `/discover?categoria=...` já compartilhado.
 *
 * Também não há schema de filtro: a listagem filtra pelos chips da toolbar,
 * direto no `ColumnFiltersState`, sem formulário no meio.
 */
const categoryFormSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  cor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor em hexadecimal, ex.: #1447e6"),
  icone: z.enum(CATEGORY_ICON_KEYS),
  ativa: z.boolean(),
});

type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export { categoryFormSchema, type CategoryFormSchema };
