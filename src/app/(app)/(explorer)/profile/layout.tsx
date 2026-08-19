import { BadgeCheckIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { PageSection } from "@/components/blocks/page-section";
import { StatCard } from "@/components/blocks/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { explorerCredential } from "@/constants/explorer-titles";
import { isVerifiedExplorer } from "@/constants/verification";
import { getSession } from "@/lib/session";
import { currentExplorerMock, totalContributions } from "@/mocks/community";

import { ProfileTabs } from "./_components/profile-tabs";

/**
 * Iniciais do avatar — duas letras quando o nome tem sobrenome.
 *
 * @param name Nome do usuário da sessão.
 * @returns Iniciais em maiúsculas.
 */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? [parts[0], parts.at(-1)] : [parts[0]];

  return letters
    .map((part) => part?.charAt(0).toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

/**
 * Casca das cinco abas do perfil.
 *
 * Server Component de propósito: lê a sessão uma vez e o cabeçalho não repinta
 * ao trocar de aba. **Identidade é real** (vem do cookie assinado), contadores
 * e atividade são mock — `Visita`, `Favorita`, `Analise` e `GanhaConquista`
 * não existem no banco.
 */
export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  const nome = session?.userName ?? "Explorador";
  const explorer = currentExplorerMock;
  const verified = isVerifiedExplorer(explorer);

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title={nome}
        description={`${explorerCredential(explorer.conquistas)} · desde ${explorer.desde}`}
        className="mx-auto w-full max-w-5xl gap-6"
        actions={
          <Button asChild variant="outline">
            <Link href={`/community/${explorer.id}`}>Ver perfil público</Link>
          </Button>
        }
        subitems={
          <div className="mt-4 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 shrink-0">
                <AvatarFallback>{initialsOf(nome)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-sm">
                  {session?.userEmail}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {verified && (
                    <Badge className="bg-sky-500 text-white">
                      <BadgeCheckIcon className="size-3" />
                      Explorador verificado
                    </Badge>
                  )}

                  <Badge variant="outline">
                    <MapPinIcon className="size-3" />
                    {explorer.bairro}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <StatCard
                label="Contribuições"
                value={totalContributions(explorer)}
              />
              <StatCard label="Visitas" value={explorer.visitas} />
              <StatCard label="Avaliações" value={explorer.avaliacoes} />
              <StatCard label="Conquistas" value={explorer.conquistas} />
            </div>

            <ProfileTabs />
          </div>
        }
      >
        {children}
      </PageSection>
    </main>
  );
}
