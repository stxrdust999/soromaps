import z from "zod";

/** Parágrafos mínimos e máximos de uma pauta — abaixo disso é legenda. */
const MIN_PARAGRAPHS = 3;
const MAX_PARAGRAPHS = 6;

/** Lugares por pauta: menos de dois não é roteiro, mais de quatro não se lê. */
const MIN_PLACES = 2;
const MAX_PLACES = 4;

/**
 * Pedido de rascunho de pauta.
 *
 * O tema é livre, mas os lugares **não**: quem escolhe é a tela, a partir do
 * que existe no mapa. Deixar o modelo escolher o assunto sobre a cidade
 * inteira é o caminho mais curto para ele citar um estabelecimento que não
 * existe.
 */
const generateStorySchema = z.object({
  tema: z
    .string()
    .trim()
    .min(8, "Descreva o tema em pelo menos 8 caracteres")
    .max(160, "Tema muito longo — resuma em uma linha"),
  localIds: z
    .array(z.number().int().positive())
    .min(MIN_PLACES, `Escolha ao menos ${MIN_PLACES} lugares`)
    .max(MAX_PLACES, `No máximo ${MAX_PLACES} lugares por pauta`),
});

/**
 * O que o modelo devolve. Revalidado com o mesmo rigor de entrada de usuário —
 * saída de LLM é entrada não confiável, mesmo com `responseSchema` na API.
 */
const storyDraftSchema = z.object({
  chapeu: z.string().trim().min(3).max(24),
  titulo: z.string().trim().min(10).max(90),
  chamada: z.string().trim().min(30).max(220),
  corpo: z
    .array(z.string().trim().min(80))
    .min(MIN_PARAGRAPHS)
    .max(MAX_PARAGRAPHS),
});

type GenerateStorySchema = z.infer<typeof generateStorySchema>;
type StoryDraftSchema = z.infer<typeof storyDraftSchema>;

export {
  generateStorySchema,
  storyDraftSchema,
  MAX_PLACES,
  MIN_PLACES,
  type GenerateStorySchema,
  type StoryDraftSchema,
};
