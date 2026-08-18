"use client";

import { FlameIcon, GemIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { PageSection } from "@/components/blocks/page-section";
import { PlaceCard } from "@/components/blocks/place-card";
import { PlaceRail } from "@/components/blocks/place-rail";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MarkerResource } from "@/types/marker";

import { CategoryChips } from "./category-chips";
import { DiscoverHero } from "./discover-hero";
import { DiscoverSearch } from "./discover-search";
import { NearbyList } from "./nearby-list";
import { RecentlyAddedRail } from "./recently-added-rail";
import { TopRatedList } from "./top-rated-list";
import { useDiscover } from "./use-discover";
import { VibeChips } from "./vibe-chips";

/** Mesmo eixo centralizado do feed, para as duas telas de leitura baterem. */
const CONTENT_WIDTH = "mx-auto flex w-full max-w-6xl flex-col gap-10";

interface DiscoverExplorerProps {
  markers: MarkerResource[];
}

/**
 * Descobrir.
 *
 * A página tem **quatro pesos**, de cima para baixo, e é isso que a torna
 * navegável: um destaque grande que convida (carrossel), três cards largos do
 * que está bombando, duas colunas densas para comparar de relance, e as
 * trilhas de garimpo no fim. Antes eram cinco seções de peso igual, todas
 * pedindo o mesmo gesto de rolar na horizontal.
 *
 * Client porque filtro e busca são a tela inteira — a lista chega pronta do
 * servidor e não volta a ser buscada. O que cada trilha significa está em
 * `use-discover.ts`.
 */
export function DiscoverExplorer({ markers }: DiscoverExplorerProps) {
  const {
    filter,
    setFilter,
    vibe,
    setVibe,
    search,
    setSearch,
    counts,
    hasResults,
    rails,
  } = useDiscover(markers);

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Descobrir"
        description="O que você tá a fim de encontrar hoje?"
        className="gap-8"
        actions={
          <Button asChild>
            <Link href="/places/new">
              <PlusIcon />
              Adicionar ponto
            </Link>
          </Button>
        }
        subitems={
          <div className="mt-4 flex flex-col gap-3">
            <DiscoverSearch search={search} onSearchChange={setSearch} />

            <CategoryChips
              active={filter}
              onChange={setFilter}
              counts={counts}
              total={markers.length}
            />

            <VibeChips active={vibe} onChange={setVibe} />
          </div>
        }
      >
        <div className={CONTENT_WIDTH}>
          {!hasResults ? (
            <p className="py-12 text-center text-muted-foreground text-sm">
              Nenhum lugar encontrado com esses filtros.
            </p>
          ) : (
            <>
              <DiscoverHero places={rails.featured} />

              <section className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="flex items-center gap-1.5 font-semibold text-lg">
                    <FlameIcon className="size-4 text-orange-500" />
                    Em alta agora
                  </h2>
                  <span className="text-muted-foreground text-xs">
                    onde a cidade mais avaliou
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rails.trending.map(({ marker, details }) => (
                    <PlaceCard
                      key={marker.id}
                      marker={marker}
                      size="featured"
                      showTags
                      badge={
                        <Badge className="bg-orange-500 text-white">
                          <FlameIcon className="size-3" />
                          {details.totalAvaliacoes} avaliações
                        </Badge>
                      }
                    />
                  ))}
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <NearbyList places={rails.nearby} />
                <TopRatedList places={rails.topRated} />
              </div>

              {rails.hiddenGems.length > 0 && (
                <PlaceRail
                  title="Joias escondidas"
                  icon={<GemIcon className="size-4 text-teal-500" />}
                  hint="nota alta, pouca gente conhece"
                >
                  {rails.hiddenGems.map(({ marker, details }) => (
                    <PlaceCard
                      key={marker.id}
                      marker={marker}
                      badge={
                        <Badge className="bg-teal-600 text-white">
                          só {details.totalAvaliacoes} avaliações
                        </Badge>
                      }
                    />
                  ))}
                </PlaceRail>
              )}

              <RecentlyAddedRail places={rails.recent} />
            </>
          )}
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
