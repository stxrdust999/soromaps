import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

interface StarRatingProps {
  nota: number;
  size?: number;
  /** Mostra o número ao lado das estrelas. */
  showValue?: boolean;
  className?: string;
}

/**
 * Nota em estrelas, como o usuário vê na avaliação.
 *
 * Renderizar a nota de verdade importa nas telas de moderação: uma avaliação
 * 1 estrela com texto agressivo lê diferente de uma 5 estrelas com o mesmo
 * texto, e é isso que separa crítica dura de ataque.
 *
 * @param props Nota de 1 a 5, tamanho do ícone e se o número aparece.
 */
export function StarRating({
  nota,
  size = 14,
  showValue = false,
  className,
}: StarRatingProps) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {STARS.map((star) => (
        <StarIcon
          key={star}
          size={size}
          strokeWidth={1.6}
          className={cn(
            star <= nota
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40",
          )}
        />
      ))}

      {showValue && (
        <span className="ml-1.5 text-xs font-semibold tabular-nums">
          {nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
        </span>
      )}
    </span>
  );
}
