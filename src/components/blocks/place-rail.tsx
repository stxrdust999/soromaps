import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface PlaceRailProps {
  title: string;
  icon?: React.ReactNode;
  /** Destino do "Ver tudo" — omitido, o cabeçalho fica sem ação. */
  seeAllHref?: string;
  /** Legenda à direita, quando o critério da trilha não é óbvio pelo título. */
  hint?: string;
  children: React.ReactNode;
}

/** Faixa horizontal de locais, com cabeçalho e link para a tela cheia. */
export function PlaceRail({
  title,
  icon,
  seeAllHref,
  hint,
  children,
}: PlaceRailProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="font-semibold text-sm">{title}</h2>
        </div>

        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}

        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
          >
            Ver tudo
            <ArrowRightIcon className="size-3" />
          </Link>
        )}
      </div>

      <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {children}
      </div>
    </section>
  );
}
