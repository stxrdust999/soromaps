import { BadgeCheckIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { explorerCredential } from "@/constants/explorer-titles";
import { cn } from "@/lib/utils";
import type { FeedAuthorMock } from "@/mocks/feed";

interface FeedAuthorAvatarProps {
  author: FeedAuthorMock;
  className?: string;
}

/** Avatar do autor, com a inicial como reserva quando não há foto. */
export function FeedAuthorAvatar({ author, className }: FeedAuthorAvatarProps) {
  return (
    <Avatar className={cn("size-10 shrink-0", className)}>
      {author.avatarUrl && (
        <AvatarImage src={author.avatarUrl} alt={author.nome} />
      )}
      <AvatarFallback className="text-xs">{author.iniciais}</AvatarFallback>
    </Avatar>
  );
}

interface FeedAuthorNameProps {
  author: FeedAuthorMock;
  /** O que o autor fez, ex.: "avaliou". Fecha a frase do cabeçalho. */
  action?: ReactNode;
}

/**
 * Nome do autor com o selo de verificado e o título de explorador.
 *
 * O título vem da contagem de conquistas (`explorerCredential`) — não existe
 * nível nem pontuação, decisão de 2026-08-12.
 */
export function FeedAuthorName({ author, action }: FeedAuthorNameProps) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      <span className="inline-flex items-center gap-1 font-semibold">
        {author.nome}
        {author.verificado && (
          <BadgeCheckIcon
            className="size-3.5 fill-sky-500 text-white"
            aria-label="Explorador verificado"
          />
        )}
      </span>

      <span className="text-muted-foreground text-xs">
        {explorerCredential(author.conquistas)}
      </span>

      {action}
    </span>
  );
}
