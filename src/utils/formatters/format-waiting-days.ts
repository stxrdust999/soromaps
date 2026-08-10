/**
 * Idade em texto a partir de dias inteiros.
 *
 * Recebe dias em vez de data porque o texto precisa ser o mesmo no servidor e
 * no cliente — data relativa a `now` daria mismatch de hidratação.
 *
 * @param dias Dias de espera.
 * @returns Rótulo em pt-BR, ex.: "há 9 dias".
 */
export function formatWaitingDays(dias: number): string {
  if (dias <= 0) return "hoje";
  if (dias === 1) return "há 1 dia";
  return `há ${dias} dias`;
}
