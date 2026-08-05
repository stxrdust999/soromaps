import { TrophyIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LeaderboardVisitor {
  nome: string;
  nivel: number;
  visitas: number;
  avatarUrl?: string;
}

interface PlaceLeaderboardProps {
  /** Já ordenados: a posição vem do índice, não de um campo. */
  visitors: LeaderboardVisitor[];

  /** Destino do "ver ranking completo"; sem ele o rodapé não aparece. */
  fullRankingHref?: string;

  title?: string;
  className?: string;
}

/**
 * Pódio de quem mais visitou um local. O primeiro colocado ganha destaque
 * (número em cor cheia e anel no avatar) — sem isso os três leem com o mesmo
 * peso e o pódio deixa de comunicar ranking.
 */
export function PlaceLeaderboard({
  visitors,
  fullRankingHref,
  title = "Top visitantes",
  className,
}: PlaceLeaderboardProps) {
  return (
    <Card size="sm" className={className}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-3">
          <span className="bg-amber-500 rounded-full p-2">
            <TrophyIcon size={16} className="text-white" />
          </span>
          <span className="text-balance font-semibold text-base">{title}</span>
        </div>

        <ol className="flex flex-col gap-3">
          {visitors.map((visitor, position) => (
            <li key={visitor.nome} className="flex flex-row items-center gap-3">
              <span
                className={cn(
                  "w-4 text-center font-bold text-lg tabular-nums",
                  position === 0
                    ? "text-foreground"
                    : "text-muted-foreground/50",
                )}
              >
                {position + 1}
              </span>

              <Avatar
                size="lg"
                className={
                  position === 0
                    ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
                    : undefined
                }
              >
                {visitor.avatarUrl && (
                  <AvatarImage src={visitor.avatarUrl} alt={visitor.nome} />
                )}
                <AvatarFallback>{visitor.nome.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col">
                <span className="whitespace-nowrap font-semibold text-sm">
                  {visitor.nome}
                </span>
                <span className="text-muted-foreground text-xs">
                  Nível {visitor.nivel}
                </span>
              </div>

              <Badge variant="secondary" className="whitespace-nowrap">
                {visitor.visitas} visitas
              </Badge>
            </li>
          ))}
        </ol>

        {fullRankingHref && (
          <Button asChild variant="link" size="sm" className="mx-auto">
            <Link href={fullRankingHref}>Ver ranking completo</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
