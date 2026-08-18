import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  isVerifiedExplorer,
  MIN_MONTHS,
  MIN_REVIEWS,
  MIN_VISITS,
  missingForVerification,
} from "@/constants/verification";
import { currentExplorerMock } from "@/mocks/community";

/**
 * O que é o selo e onde o usuário está em relação a ele.
 *
 * O critério aparece inteiro de propósito: selo cujo critério não se lê vira
 * fofoca — quem não tem acha que é escolha da equipe. Como a régua é função
 * pura sobre contadores, dá para publicá-la sem ressalva.
 */
export function VerificationCard() {
  const verified = isVerifiedExplorer(currentExplorerMock);
  const missing = missingForVerification(currentExplorerMock);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheckIcon className="size-4 fill-sky-500 text-white" />
          Explorador verificado
        </CardTitle>
        <CardDescription>
          O selo que aparece ao lado do nome em avaliação, ranking e feed
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ul className="flex flex-col gap-1 text-muted-foreground text-xs">
          <li>· {MIN_VISITS} visitas registradas</li>
          <li>· {MIN_REVIEWS} avaliações publicadas</li>
          <li>· nenhuma avaliação removida pela moderação</li>
          <li>· {MIN_MONTHS} mês de conta</li>
        </ul>

        {verified ? (
          <Badge variant="success">Você tem o selo</Badge>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Badge variant="warning">Falta pouco</Badge>
            <span className="text-muted-foreground text-xs">
              Para conseguir: {missing.join(", ")}.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
