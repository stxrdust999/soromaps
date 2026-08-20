import { Badge } from "@/components/ui/badge";
import { FEED_REASONS, type FeedReason } from "@/constants/feed";
import { cn } from "@/lib/utils";

interface FeedReasonBadgeProps {
  reason: FeedReason;
  /** O que casou: bairro com distância, categoria ou nome do lugar salvo. */
  detail?: string;
  className?: string;
}

/**
 * Selo de "por que isto está aqui".
 *
 * É o item que sustenta a decisão de não ter grafo social: sem seguir
 * ninguém, o usuário precisa entender o critério de entrada de cada card —
 * e é o mesmo texto que o menu de "menos disso" usa para deixar corrigir.
 */
export function FeedReasonBadge({
  reason,
  detail,
  className,
}: FeedReasonBadgeProps) {
  const definition = FEED_REASONS[reason];
  const Icon = definition.icon;
  const label = detail ? `${definition.hint} · ${detail}` : definition.hint;

  return (
    <Badge
      title={label}
      className={cn("max-w-56", definition.className, className)}
    >
      <Icon className="size-3" />
      <span className="truncate">{label}</span>
    </Badge>
  );
}
