/**
 * Selo de explorador verificado.
 *
 * O critério é **objetivo e checável**, não chancela manual do admin: o selo
 * responde "dá para confiar nesta opinião?", e uma decisão caso a caso não
 * escala nem se explica para quem não recebeu. Como é função pura sobre
 * contadores que o produto já vai ter, mudar a régua é mexer aqui — nenhuma
 * coluna migra junto.
 *
 * Ver `docs/todo/user/community.md`.
 */

/** Visitas registradas mínimas — mostra que a pessoa anda pela cidade. */
export const MIN_VISITS = 5;

/** Avaliações publicadas mínimas — mostra que ela devolve o que consumiu. */
export const MIN_REVIEWS = 3;

/** Meses de conta mínimos — filtra o perfil criado para inflar uma nota. */
export const MIN_MONTHS = 1;

export interface ExplorerStats {
  visitas: number;
  avaliacoes: number;
  /** Qualquer avaliação removida pela moderação derruba o selo. */
  avaliacoesRemovidas: number;
  mesesNaPlataforma: number;
}

/**
 * Se o explorador tem o selo de verificado.
 *
 * @param stats Contadores do explorador.
 * @returns `true` quando todos os critérios batem.
 */
export function isVerifiedExplorer(stats: ExplorerStats): boolean {
  return (
    stats.visitas >= MIN_VISITS &&
    stats.avaliacoes >= MIN_REVIEWS &&
    stats.avaliacoesRemovidas === 0 &&
    stats.mesesNaPlataforma >= MIN_MONTHS
  );
}

/**
 * O que falta para o selo, na ordem em que o perfil deve cobrar.
 *
 * Existe para o perfil de quem **não** tem o selo não virar uma negativa sem
 * saída: a lista é o roteiro do que fazer.
 *
 * @param stats Contadores do explorador.
 * @returns Frases do que falta; vazio quando já é verificado.
 */
export function missingForVerification(stats: ExplorerStats): string[] {
  const missing: string[] = [];

  if (stats.visitas < MIN_VISITS) {
    missing.push(`registrar ${MIN_VISITS - stats.visitas} visitas`);
  }

  if (stats.avaliacoes < MIN_REVIEWS) {
    missing.push(`escrever ${MIN_REVIEWS - stats.avaliacoes} avaliações`);
  }

  if (stats.avaliacoesRemovidas > 0) {
    missing.push("ter avaliação removida derruba o selo");
  }

  if (stats.mesesNaPlataforma < MIN_MONTHS) {
    missing.push("completar 1 mês de conta");
  }

  return missing;
}
