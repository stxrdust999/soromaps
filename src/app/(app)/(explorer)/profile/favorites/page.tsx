import Link from "next/link";

import { PlaceCard } from "@/components/blocks/place-card";
import { Button } from "@/components/ui/button";
import { profileFavoriteIdsMock, profilePlace } from "@/mocks/profile";

/**
 * Lugares salvos.
 *
 * Sem timeline de propósito: `Favorita` é estado, não evento (por isso não
 * leva `data` na PK), então a tela mostra a coleção atual e nada de histórico.
 *
 * Remover ainda não existe — a ação nasce junto com a tabela, como
 * `toggleFavoriteAction`. Botão que não desfaz nada seria pior que botão
 * nenhum.
 */
export default function ProfileFavoritesPage() {
  if (profileFavoriteIdsMock.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Explore o mapa e salve os lugares que você quer revisitar.
        </p>

        <Button asChild>
          <Link href="/discover">Descobrir lugares</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        {profileFavoriteIdsMock.length} lugares salvos
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profileFavoriteIdsMock.map((id) => (
          <PlaceCard
            key={id}
            size="featured"
            showTags
            marker={{ id, nome: profilePlace(id).nome }}
          />
        ))}
      </div>
    </div>
  );
}
