"use client";

import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { isVerifiedExplorer } from "@/constants/verification";
import { explorersMock } from "@/mocks/community";
import { publishedStoriesMock } from "@/mocks/stories";

import { ContributionRanking } from "./contribution-ranking";
import { ExplorerCard } from "./explorer-card";
import { StoryGeneratorDialog } from "./story-generator-dialog";
import { StoryShowcase } from "./story-showcase";
import { VerificationCard } from "./verification-card";

/** Alinha cabeçalho e conteúdo no mesmo eixo largo das outras telas de leitura. */
const CONTENT_WIDTH = "mx-auto flex w-full max-w-6xl";

/**
 * Comunidade.
 *
 * **Sem seguir ninguém** — decisão de 2026-08-17, a mesma do feed. Sem grafo,
 * a tela precisa responder de outro jeito à pergunta "quem é essa pessoa que
 * avaliou?": contribuição registrada, título derivado das conquistas e o selo
 * de verificado, cujo critério fica publicado ao lado.
 *
 * As pautas abrem a tela porque atividade de gente tem dia fraco: em base
 * nova, há semana sem avaliação nenhuma. O conteúdo editorial é o que o
 * produto controla.
 *
 * Client porque `Analise`, `Visita` e a tabela de pauta não existem: busca e
 * ranking recortam os arrays de `src/mocks/community.ts` e `stories.ts`.
 */
export function CommunityWorkspace() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return explorersMock;

    return explorersMock.filter(
      (person) =>
        person.nome.toLowerCase().includes(query) ||
        person.bairro.toLowerCase().includes(query),
    );
  }, [search]);

  const verifiedCount = explorersMock.filter(isVerifiedExplorer).length;

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Comunidade"
        description="Quem explora Sorocaba, o que anda contribuindo e as pautas da cidade"
        className="gap-6"
        actions={<StoryGeneratorDialog />}
        subitems={
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{explorersMock.length} exploradores</Badge>
            <Badge variant="outline">{verifiedCount} verificados</Badge>
            <Badge variant="outline">
              {publishedStoriesMock.length} pautas publicadas
            </Badge>
          </div>
        }
      >
        <div className={`${CONTENT_WIDTH} flex-col gap-8`}>
          <StoryShowcase stories={publishedStoriesMock} />

          <div className="flex gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-lg">Exploradores</h2>

                <div className="relative w-full sm:w-72">
                  <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por nome ou bairro..."
                    className="pl-9"
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground text-sm">
                  Ninguém encontrado com esse termo.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filtered.map((person) => (
                    <ExplorerCard key={person.id} explorer={person} />
                  ))}
                </div>
              )}
            </div>

            <aside className="hidden w-80 shrink-0 flex-col gap-4 xl:flex">
              <ContributionRanking />
              <VerificationCard />
            </aside>
          </div>
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
