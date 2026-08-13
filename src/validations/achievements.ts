import z from "zod";

import {
  ACHIEVEMENT_EVENT_KEYS,
  ACHIEVEMENT_ICON_KEYS,
} from "@/constants/achievements";

/**
 * Formulário de conquista.
 *
 * **Não tem campo de pontuação nem de XP.** Decisão de 2026-08-12 no
 * `CLAUDE.md`: conquista é estado idempotente e não carrega valor numérico —
 * o que existia como "nível" virou título derivado da contagem.
 *
 * O `superRefine` cobre a única regra que os campos sozinhos não expressam:
 * escolher um tipo de alvo obriga a escolher o alvo. Sem isso o critério fica
 * "Visitar 5 lugares da categoria …" e o motor não teria o que comparar.
 */
const achievementFormSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome obrigatório"),
    descricao: z.string().trim().min(1, "Descrição obrigatória"),
    icone: z.enum(ACHIEVEMENT_ICON_KEYS),
    cor: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor em hexadecimal, ex.: #1447e6"),

    evento: z.enum(ACHIEVEMENT_EVENT_KEYS),
    quantidade: z
      .number()
      .int("Use um número inteiro")
      .min(1, "A quantidade precisa ser pelo menos 1"),
    tipoAlvo: z.enum(["categoria", "bairro"]).nullable(),
    alvo: z.string().nullable(),

    ativa: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.tipoAlvo && !values.alvo) {
      ctx.addIssue({
        code: "custom",
        path: ["alvo"],
        message: "Escolha o alvo para o critério fechar",
      });
    }
  });

type AchievementFormSchema = z.infer<typeof achievementFormSchema>;

export { achievementFormSchema, type AchievementFormSchema };
