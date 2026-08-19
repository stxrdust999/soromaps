import { redirect } from "next/navigation";

/**
 * Virou aba de `/profile` em 2026-08-19.
 *
 * A rota sobrevive só para a URL já divulgada não dar 404 — mesmo arranjo de
 * `/places`, que virou `/discover` em 2026-08-17.
 */
export default function StatsPage() {
  redirect("/profile/stats");
}
