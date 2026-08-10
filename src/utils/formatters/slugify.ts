/** Marcas de acento que a decomposição NFD separa da letra base. */
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Converte um texto livre em slug de URL: minúsculas, sem acento, hifenizado.
 *
 * @param value Texto de origem — normalmente o nome da categoria.
 * @returns Slug, ou string vazia quando não sobra nenhum caractere válido.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
