import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeedEventIconProps {
  icon: LucideIcon;
  /** Classes de fundo e cor do ícone — uma paleta por tipo de evento. */
  className?: string;
}

/**
 * Disco de ícone no lugar do avatar, para o item que não tem uma pessoa como
 * sujeito: movimento de lugar, marco, ponto novo e pauta.
 *
 * Ocupa exatamente o tamanho do avatar para os cards alinharem em coluna —
 * é o que faz a lista parecer uma lista, e não cards soltos.
 */
export function FeedEventIcon({ icon: Icon, className }: FeedEventIconProps) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.8} />
    </span>
  );
}
