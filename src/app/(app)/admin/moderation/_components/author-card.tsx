import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ModerationAuthorMock } from "@/mocks/admin-moderation";

/** Abaixo desta taxa o autor deixa de ter crédito e o ponto pede lupa. */
const TRUSTED_RATIO = 0.6;

interface AuthorCardProps {
  author: ModerationAuthorMock;
}

/**
 * Contexto de quem enviou. A taxa de aprovação é o que decide o nível de
 * escrutínio antes mesmo de o admin ler a ficha.
 */
export function AuthorCard({ author }: AuthorCardProps) {
  const trusted = author.aprovados / author.enviados >= TRUSTED_RATIO;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback>{author.iniciais}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{author.nome}</p>
          <p className="text-muted-foreground text-xs">{author.nivel}</p>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-1 text-xs">Taxa de aprovação</p>
        <Badge variant={trusted ? "success" : "destructive"}>
          {author.aprovados} de {author.enviados} pontos aprovados
        </Badge>
      </div>

      <dl className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Membro desde</dt>
          <dd>{author.membroDesde}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Avaliações escritas</dt>
          <dd className="tabular-nums">{author.avaliacoesEscritas}</dd>
        </div>
      </dl>

      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium"
      >
        Ver todos os pontos deste autor
        <ArrowRightIcon size={14} />
      </Link>
    </div>
  );
}
