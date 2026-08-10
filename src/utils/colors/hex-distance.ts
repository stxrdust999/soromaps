/**
 * Distância euclidiana entre duas cores no espaço RGB.
 *
 * RGB, e não OKLCH, porque aqui a pergunta é "esses dois pins se confundem no
 * mapa?" — uma aproximação grosseira basta e não vale trazer conversão de
 * espaço de cor para isso.
 *
 * @param a Cor em `#rrggbb`.
 * @param b Cor em `#rrggbb`.
 * @returns Distância; 0 é cor idêntica, ~441 é o máximo (preto × branco).
 */
export function hexDistance(a: string, b: string): number {
  const first = toRgb(a);
  const second = toRgb(b);

  if (!first || !second) return Number.POSITIVE_INFINITY;

  return Math.sqrt(
    (first[0] - second[0]) ** 2 +
      (first[1] - second[1]) ** 2 +
      (first[2] - second[2]) ** 2,
  );
}

function toRgb(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;

  const value = Number.parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
