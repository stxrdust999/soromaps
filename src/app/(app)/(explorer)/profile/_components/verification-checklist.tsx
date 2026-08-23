import { BadgeCheckIcon, CheckIcon, CircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ExplorerStats,
  isVerifiedExplorer,
  MIN_MONTHS,
  MIN_REVIEWS,
  MIN_VISITS,
  missingForVerification,
} from "@/constants/verification";
import { cn } from "@/lib/utils";

interface VerificationChecklistProps {
  stats: ExplorerStats;
}

/**
 * A régua do selo, item a item, com o que já está cumprido.
 *
 * É a peça que só existe no perfil privado: `/community/[id]` mostra o
 * resultado ("tem selo" / "não tem"), aqui o usuário vê a régua inteira e o
 * que falta. Selo cujo critério não se lê vira fofoca, e negativa sem roteiro
 * não dá o que fazer a seguir.
 */
export function VerificationChecklist({ stats }: VerificationChecklistProps) {
  const verified = isVerifiedExplorer(stats);
  const missing = missingForVerification(stats);

  const rules = [
    {
      label: `Registrar ${MIN_VISITS} visitas`,
      progresso: `${stats.visitas} de ${MIN_VISITS}`,
      cumprida: stats.visitas >= MIN_VISITS,
    },
    {
      label: `Publicar ${MIN_REVIEWS} avaliações`,
      progresso: `${stats.avaliacoes} de ${MIN_REVIEWS}`,
      cumprida: stats.avaliacoes >= MIN_REVIEWS,
    },
    {
      label: "Nenhuma avaliação removida pela moderação",
      progresso: `${stats.avaliacoesRemovidas} removida(s)`,
      cumprida: stats.avaliacoesRemovidas === 0,
    },
    {
      label: `Completar ${MIN_MONTHS} mês de conta`,
      progresso: `${stats.mesesNaPlataforma} de ${MIN_MONTHS}`,
      cumprida: stats.mesesNaPlataforma >= MIN_MONTHS,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheckIcon
            className={cn("size-4", verified && "text-sky-500")}
            aria-hidden
          />
          Explorador verificado
        </CardTitle>

        <CardDescription>
          {verified
            ? "Você cumpre os quatro critérios. O selo aparece ao lado do seu nome nas avaliações."
            : `Falta ${missing.join(", ")}. O critério é o mesmo para todo mundo — ninguém dá nem tira o selo na mão.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 border-t pt-6">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center gap-3 text-sm">
            {rule.cumprida ? (
              <CheckIcon className="size-4 shrink-0 text-success" aria-hidden />
            ) : (
              <CircleIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            )}

            <span
              className={cn(
                "flex-1",
                !rule.cumprida && "text-muted-foreground",
              )}
            >
              {rule.label}
            </span>

            <span className="text-muted-foreground text-xs tabular-nums">
              {rule.progresso}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
