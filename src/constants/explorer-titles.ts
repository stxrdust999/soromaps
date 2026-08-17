/**
 * Título do explorador, derivado da contagem de conquistas.
 *
 * Decisão de 2026-08-12: a gamificação fica só com conquista — não existe XP,
 * curva nem coluna `nivel`. O título é função pura sobre
 * `COUNT(GanhaConquista)`, então não há nada para manter sincronizado: quem
 * mostra o título só precisa saber quantas conquistas a pessoa tem.
 */

interface ExplorerTitle {
  label: string;
  /** Conquistas mínimas para o título valer. */
  minimo: number;
}

/** Do mais alto para o mais baixo — a primeira faixa que casa vence. */
export const EXPLORER_TITLES: ExplorerTitle[] = [
  { label: "Veterano", minimo: 13 },
  { label: "Guia local", minimo: 7 },
  { label: "Explorador", minimo: 3 },
  { label: "Novato", minimo: 0 },
];

/**
 * Título correspondente à contagem de conquistas.
 *
 * @param conquistas Total de conquistas obtidas.
 * @returns Rótulo da faixa, ex.: "Guia local".
 */
export function explorerTitle(conquistas: number): string {
  const faixa = EXPLORER_TITLES.find((item) => conquistas >= item.minimo);
  return faixa?.label ?? "Novato";
}

/**
 * Título com a contagem, no formato usado ao lado do nome do autor.
 *
 * @param conquistas Total de conquistas obtidas.
 * @returns Ex.: "Guia local · 9 conquistas".
 */
export function explorerCredential(conquistas: number): string {
  const sufixo = conquistas === 1 ? "1 conquista" : `${conquistas} conquistas`;
  return `${explorerTitle(conquistas)} · ${sufixo}`;
}
