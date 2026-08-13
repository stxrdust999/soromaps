/**
 * Distância em texto, trocando de unidade no limiar de 1 km.
 *
 * Abaixo disso o metro é a unidade que responde a pergunta ("é aqui mesmo?");
 * acima, "8,1 km" comunica melhor que "8100 m".
 *
 * @param km Distância em quilômetros.
 * @returns Rótulo em pt-BR, ex.: "120 m" ou "8,1 km".
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;

  return `${km.toFixed(1).replace(".", ",")} km`;
}
