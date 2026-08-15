/**
 * Motivos de remoção de conteúdo público.
 *
 * Vive em `constants` e não no mock de uma tela porque é conhecimento de
 * produto compartilhado: `/admin/reports` remove reagindo a denúncia,
 * `/admin/reviews` remove varrendo por conta própria, e as duas precisam
 * registrar o mesmo vocabulário. Motivo divergente entre as telas quebraria a
 * métrica de moderação e a mensagem enviada ao autor.
 *
 * Lista fechada de propósito: o motivo vira número no relatório e texto no
 * aviso. Campo livre não serve para nenhum dos dois.
 */
export const REMOVAL_REASONS = [
  "Spam",
  "Ofensa ou discurso de ódio",
  "Informação falsa",
  "Conteúdo impróprio",
  "Fora do escopo da plataforma",
] as const;

export type RemovalReason = (typeof REMOVAL_REASONS)[number];
