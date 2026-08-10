import { CATEGORY_ICONS, type CategoryIconKey } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface CategoryPinProps {
  icone: CategoryIconKey;
  cor: string;
  /** Lado do pin em pixels; o ícone acompanha em ~45%. */
  size?: number;
  /** Anel na cor do fundo, para o pin se destacar sobre o mapa. */
  ring?: boolean;
  className?: string;
}

/**
 * O pin da categoria como ele aparece no mapa — gota rotacionada com o ícone
 * dentro, na cor da categoria.
 *
 * Existe como componente porque a tela inteira gira em torno de julgar a peça
 * no formato final: amostra de cor quadrada esconde exatamente o problema que
 * o admin precisa enxergar antes de salvar.
 */
export function CategoryPin({
  icone,
  cor,
  size = 28,
  ring = false,
  className,
}: CategoryPinProps) {
  const Icon = CATEGORY_ICONS[icone] ?? CATEGORY_ICONS["map-pin"];

  return (
    <span
      className={cn(
        "flex shrink-0 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0]",
        ring && "border-background border-2",
        className,
      )}
      style={{ width: size, height: size, backgroundColor: cor }}
    >
      <Icon
        size={Math.round(size * 0.45)}
        strokeWidth={2}
        className="rotate-45 text-white"
      />
    </span>
  );
}
