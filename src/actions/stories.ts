"use server";

import { type GeminiSchema, geminiModel, generateJson } from "@/lib/gemini";
import { getMarkerDetailsMock } from "@/mocks/markers";
import type { FormState } from "@/types/form";
import {
  generateStorySchema,
  type StoryDraftSchema,
  storyDraftSchema,
} from "@/validations/stories";

/**
 * Geração de pauta.
 *
 * **A geração é etapa de autoria, não de render.** Nada aqui roda durante a
 * navegação do leitor: alguém pede o rascunho, o modelo escreve, e um humano
 * decide se aquilo vira pauta publicada. O motivo é direto — texto sobre
 * comércio de verdade que inventa preço, horário ou qualidade vira prejuízo
 * para um negócio real, e um guia local vive de não fazer isso.
 *
 * Três defesas, nesta ordem:
 * 1. **Os lugares vêm da tela, não do modelo.** Ele recebe uma lista fechada e
 *    os fatos de cada um; não escolhe sobre o que falar.
 * 2. **A instrução de sistema proíbe fato fora da lista**, com os campos
 *    permitidos enumerados.
 * 3. **A saída é revalidada com Zod.** `responseSchema` da API não garante
 *    conteúdo — saída de modelo é entrada não confiável como qualquer outra.
 *
 * O rascunho **não é persistido**: não existe tabela de pauta. A action
 * devolve o texto para a tela mostrar e o revisor copiar. Quando a entidade
 * nascer, é aqui que entram o `insert` com `status: "rascunho"` e o
 * `updateTag`.
 */

const INVALID_PAYLOAD_MESSAGE =
  "Confira o tema e os lugares escolhidos antes de gerar.";
const MISSING_KEY_MESSAGE =
  "Sem `GEMINI_API_KEY` configurada no servidor — a geração está desligada.";
const REQUEST_FAILED_MESSAGE =
  "O modelo não respondeu. Tente de novo em alguns instantes.";
const MALFORMED_MESSAGE =
  "O modelo devolveu um texto fora do formato esperado. Gere de novo.";

const SYSTEM_INSTRUCTION = `Você é editor de um guia local da cidade de Sorocaba (SP), escrevendo em português do Brasil.

REGRAS INEGOCIÁVEIS:
- Use SOMENTE os fatos listados no prompt. É proibido inventar preço, horário de funcionamento, endereço, telefone, nome de prato, nome de pessoa, prêmio, história do estabelecimento ou qualquer dado que não esteja na lista.
- Se um fato não estiver na lista, não mencione o assunto. Silêncio é melhor que suposição.
- Não prometa nada em nome do estabelecimento e não use superlativo publicitário ("imperdível", "incrível", "o melhor da cidade") a menos que seja citação de uma avaliação fornecida.
- Não invente número: se a lista traz "4,8 de nota com 21 avaliações", use exatamente isso.

ESTILO:
- Tom direto e útil, de quem já foi ao lugar. Frase curta.
- Cada parágrafo entre 300 e 600 caracteres, sem título interno nem marcador.
- O primeiro parágrafo apresenta o recorte do roteiro; os seguintes tratam dos lugares, na ordem dada.
- O chapéu é uma palavra ou duas (ex.: "Roteiro", "Comparativo", "Spotlight").`;

const DRAFT_SCHEMA: GeminiSchema = {
  type: "object",
  properties: {
    chapeu: { type: "string" },
    titulo: { type: "string" },
    chamada: { type: "string" },
    corpo: { type: "array", items: { type: "string" } },
  },
  required: ["chapeu", "titulo", "chamada", "corpo"],
};

/**
 * Ficha de fatos de um lugar, do jeito que o modelo recebe.
 *
 * Só entra o que o produto realmente sabe. Hoje isso vem de
 * `src/mocks/markers.ts`; quando o modelo do ponto crescer, vem da API — e
 * este é o único ponto que muda.
 *
 * @param id Id do lugar no catálogo.
 * @returns Bloco de texto com os fatos, ou `null` se o id não existe.
 */
function placeFacts(id: number): string | null {
  const details = getMarkerDetailsMock(id);

  if (!details) return null;

  const lines = [
    `- Nome: ${details.nome}`,
    `- Bairro: ${details.bairro}`,
    `- Categoria: ${details.categoria}`,
    `- Características: ${details.tags.join(", ")}`,
    `- Wi-fi: ${details.temWifi ? "tem" : "não tem"}`,
    `- Aceita pet: ${details.petFriendly ? "sim" : "não"}`,
    `- Nota: ${details.nota} em ${details.totalAvaliacoes} avaliações`,
    `- Resumo: ${details.sobre}`,
    `- Descrição: ${details.descricao}`,
  ];

  if (details.melhorHorario) {
    lines.push(`- Melhor horário: ${details.melhorHorario}`);
  }

  if (details.segredoLocal) {
    lines.push(`- Dica de quem frequenta: ${details.segredoLocal}`);
  }

  return lines.join("\n");
}

export interface StoryDraftState extends FormState {
  draft?: StoryDraftSchema;
  /** Modelo que redigiu — vai junto no rótulo da pauta. */
  modelo?: string;
}

/**
 * Gera o rascunho de uma pauta a partir de um tema e de lugares do mapa.
 *
 * @param data Form data com `tema` e um `localIds` por lugar marcado.
 * @returns Estado com o rascunho, ou a mensagem do que impediu.
 */
export async function generateStoryDraftAction(
  data: FormData,
): Promise<StoryDraftState> {
  const result = generateStorySchema.safeParse({
    tema: data.get("tema"),
    localIds: data.getAll("localIds").map(Number),
  });

  if (!result.success) {
    return {
      success: false,
      message: INVALID_PAYLOAD_MESSAGE,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const facts = result.data.localIds
    .map(placeFacts)
    .filter((block): block is string => block !== null);

  if (facts.length < result.data.localIds.length) {
    return { success: false, message: INVALID_PAYLOAD_MESSAGE, errors: null };
  }

  const response = await generateJson({
    system: SYSTEM_INSTRUCTION,
    schema: DRAFT_SCHEMA,
    prompt: `Tema pedido pela redação: ${result.data.tema}

Escreva a pauta usando apenas os lugares abaixo, nesta ordem.

${facts.join("\n\n")}`,
  });

  if (!response.ok) {
    return {
      success: false,
      message:
        response.reason === "sem-chave"
          ? MISSING_KEY_MESSAGE
          : (response.detail ?? REQUEST_FAILED_MESSAGE),
      errors: null,
    };
  }

  const draft = storyDraftSchema.safeParse(response.data);

  if (!draft.success) {
    return { success: false, message: MALFORMED_MESSAGE, errors: null };
  }

  return {
    success: true,
    message: "Rascunho gerado. Revise antes de publicar.",
    errors: null,
    draft: draft.data,
    modelo: geminiModel(),
  };
}
