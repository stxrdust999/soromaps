import { redirect } from "next/navigation";

/**
 * A vitrine de lugares virou `/discover` — as trilhas de descoberta pública e
 * a descoberta pessoal eram a mesma tela com dois nomes.
 *
 * O redirect fica porque `/places` continua existindo como prefixo real
 * (`/places/[id]`, `/places/new`): sem ele, a URL que o produto já publicou
 * responderia 404.
 */
export default function PlacesPage() {
  redirect("/discover");
}
