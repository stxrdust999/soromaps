"use client";

import { FlameIcon, GemIcon, NavigationIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { PlaceCard } from "@/components/blocks/place-card";
import { PlaceRail } from "@/components/blocks/place-rail";
import { Badge } from "@/components/ui/badge";
import { PET_FRIENDLY_FILTER, PLACE_VIBES } from "@/constants/places";
import { getMarkerDetailsMock, type MarkerDetailsMock } from "@/mocks/markers";
import type { MarkerResource } from "@/types/marker";

import { ALL_FILTER, CategoryChips } from "./category-chips";
import { CategoryTiles } from "./category-tiles";
import { PlacesHeader } from "./places-header";
import { RecentlyAddedRail } from "./recently-added-rail";
import { TopRatedList } from "./top-rated-list";
import { VibeChips } from "./vibe-chips";

const NEARBY_LIMIT = 8;
const TRENDING_LIMIT = 6;
const RECENT_LIMIT = 6;
const TOP_RATED_LIMIT = 4;
const HIDDEN_GEMS_LIMIT = 5;

/** Acima disso o lugar já é conhecido demais para contar como joia escondida. */
const HIDDEN_GEM_MAX_REVIEWS = 70;

function matchesVibe(details: MarkerDetailsMock, vibe: string | null) {
  if (!vibe) return true;

  const definition = PLACE_VIBES.find((item) => item.label === vibe);
  if (!definition) return true;

  if (definition.wifi && !details.temWifi) return false;
  if (definition.petFriendly && !details.petFriendly) return false;

  if (definition.anyTags) {
    return definition.anyTags.some((tag) => details.tags.includes(tag));
  }

  return true;
}

interface PlacesExplorerProps {
  markers: MarkerResource[];
}

/**
 * Feed de locais: trilhas de descoberta sobre a mesma lista, recortada pelos
 * chips e pela busca. Client porque filtro e busca são a tela inteira — a
 * lista chega pronta do servidor e não volta a ser buscada.
 */
export function PlacesExplorer({ markers }: PlacesExplorerProps) {
  const [filter, setFilter] = useState(ALL_FILTER);
  const [vibe, setVibe] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return markers.filter((marker) => {
      const details = getMarkerDetailsMock(marker.id);

      const matchesFilter =
        filter === ALL_FILTER ||
        (filter === PET_FRIENDLY_FILTER
          ? details.petFriendly
          : details.categoria === filter);

      const matchesSearch =
        query.length === 0 || marker.nome.toLowerCase().includes(query);

      return matchesFilter && matchesSearch && matchesVibe(details, vibe);
    });
  }, [markers, filter, search, vibe]);

  const counts = useMemo(() => {
    return markers.reduce<Record<string, number>>((accumulator, marker) => {
      const { categoria } = getMarkerDetailsMock(marker.id);
      accumulator[categoria] = (accumulator[categoria] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [markers]);

  const nearby = useMemo(
    () =>
      [...filtered]
        .sort(
          (a, b) =>
            getMarkerDetailsMock(a.id).distancia -
            getMarkerDetailsMock(b.id).distancia,
        )
        .slice(0, NEARBY_LIMIT),
    [filtered],
  );

  const trending = useMemo(
    () =>
      [...filtered]
        .sort(
          (a, b) =>
            getMarkerDetailsMock(b.id).nota - getMarkerDetailsMock(a.id).nota,
        )
        .slice(0, TRENDING_LIMIT),
    [filtered],
  );

  const topRated = useMemo(
    () =>
      [...filtered]
        .sort(
          (a, b) =>
            getMarkerDetailsMock(b.id).nota - getMarkerDetailsMock(a.id).nota,
        )
        .slice(0, TOP_RATED_LIMIT),
    [filtered],
  );

  const hiddenGems = useMemo(
    () =>
      filtered
        .filter(
          (marker) =>
            getMarkerDetailsMock(marker.id).totalAvaliacoes <=
            HIDDEN_GEM_MAX_REVIEWS,
        )
        .sort(
          (a, b) =>
            getMarkerDetailsMock(a.id).totalAvaliacoes -
            getMarkerDetailsMock(b.id).totalAvaliacoes,
        )
        .slice(0, HIDDEN_GEMS_LIMIT),
    [filtered],
  );

  // Sem coluna de data no marker, id decrescente é o que existe de "recente".
  const recent = useMemo(
    () => [...filtered].sort((a, b) => b.id - a.id).slice(0, RECENT_LIMIT),
    [filtered],
  );

  const isFiltering =
    filter !== ALL_FILTER || vibe !== null || search.trim().length > 0;

  return (
    <div className="flex flex-col gap-6 p-8">
      <PlacesHeader search={search} onSearchChange={setSearch} />

      <CategoryChips active={filter} onChange={setFilter} />

      <VibeChips active={vibe} onChange={setVibe} />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground text-sm">
          Nenhum lugar encontrado com esses filtros.
        </p>
      ) : (
        <>
          <PlaceRail
            title="Perto de você"
            icon={<NavigationIcon className="size-4 text-blue-500" />}
          >
            {nearby.map((marker) => (
              <PlaceCard key={marker.id} marker={marker} size="sm" />
            ))}
          </PlaceRail>

          <PlaceRail
            title="Em alta"
            icon={<FlameIcon className="size-4 text-orange-500" />}
          >
            {trending.map((marker) => (
              <PlaceCard
                key={marker.id}
                marker={marker}
                showTags
                badge={
                  <Badge className="bg-orange-500 text-white">
                    <FlameIcon className="size-3" />
                    Em alta
                  </Badge>
                }
              />
            ))}
          </PlaceRail>

          {!isFiltering && (
            <CategoryTiles onSelect={setFilter} counts={counts} />
          )}

          <TopRatedList markers={topRated} />

          {hiddenGems.length > 0 && (
            <PlaceRail
              title="Joias escondidas"
              icon={<GemIcon className="size-4 text-teal-500" />}
              hint="poucas pessoas conhecem"
            >
              {hiddenGems.map((marker) => (
                <PlaceCard
                  key={marker.id}
                  marker={marker}
                  size="sm"
                  badge={
                    <Badge className="bg-teal-600 text-white">
                      só {getMarkerDetailsMock(marker.id).totalAvaliacoes}{" "}
                      avaliações
                    </Badge>
                  }
                />
              ))}
            </PlaceRail>
          )}

          <RecentlyAddedRail markers={recent} />
        </>
      )}
    </div>
  );
}
