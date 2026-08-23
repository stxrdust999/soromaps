import { ClockIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { StoryMock } from "@/mocks/stories";

interface StoryShowcaseProps {
  stories: StoryMock[];
}

/**
 * Vitrine das pautas: uma em destaque e as seguintes em coluna.
 *
 * A pauta existe porque atividade de usuário tem dia fraco — em base nova, há
 * semana em que ninguém avalia nada. Texto editorial ancorado em lugares do
 * mapa é o conteúdo que o produto controla, e é o que dá à Comunidade um
 * motivo de visita que não depende de terceiros.
 */
export function StoryShowcase({ stories }: StoryShowcaseProps) {
  const [featured, ...rest] = stories;

  if (!featured) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-lg">Pautas da cidade</h2>
        <span className="text-muted-foreground text-xs">
          roteiros ancorados em lugares do mapa
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
        <Link
          href={`/pautas/${featured.slug}`}
          className="card-interactive group relative flex h-96 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-muted lg:row-span-2 lg:h-auto"
        >
          <Image
            src={featured.fotoUrl}
            alt={featured.titulo}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

          <div className="relative flex min-w-0 flex-col gap-2 p-6">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Badge className="bg-orange-500 text-white">
                {featured.chapeu}
              </Badge>
              <StoryOriginBadge story={featured} onPhoto />
            </div>

            <h3 className="text-balance font-semibold text-2xl text-white leading-tight">
              {featured.titulo}
            </h3>

            <p className="max-w-xl text-pretty text-sm text-white/80">
              {featured.chamada}
            </p>

            <span className="flex items-center gap-1.5 text-white/70 text-xs">
              <ClockIcon className="size-3.5" />
              {featured.tempoLeitura} min de leitura · {featured.locais.length}{" "}
              lugares
            </span>
          </div>
        </Link>

        {rest.slice(0, 2).map((story) => (
          <Link
            key={story.slug}
            href={`/pautas/${story.slug}`}
            className="card-interactive flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className="font-semibold text-orange-600 text-xs uppercase tracking-wide dark:text-orange-400">
                  {story.chapeu}
                </span>
                <StoryOriginBadge story={story} />
              </div>

              <h3 className="text-balance font-semibold leading-snug">
                {story.titulo}
              </h3>

              <p className="line-clamp-2 text-muted-foreground text-sm">
                {story.chamada}
              </p>
            </div>

            <div className="relative h-full w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={story.fotoUrl}
                alt={story.titulo}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Rótulo de quem escreveu.
 *
 * Pauta redigida por modelo aparece marcada para o leitor, sempre — quem lê
 * uma recomendação sobre um comércio real tem direito de saber que ela saiu de
 * um gerador ancorado nos dados do mapa, e não de alguém que esteve lá.
 *
 * `onPhoto` troca o outline padrão (ilegível sobre a foto do card em
 * destaque, `text-foreground` escuro sobre imagem escura) por um chip
 * translúcido — mesma família visual do badge laranja ao lado.
 */
function StoryOriginBadge({
  story,
  onPhoto = false,
}: {
  story: StoryMock;
  onPhoto?: boolean;
}) {
  const toneClassName = onPhoto
    ? "border-white/30 bg-white/15 text-white backdrop-blur-sm"
    : undefined;

  if (story.origem !== "ia") {
    return (
      <Badge variant="outline" className={toneClassName}>
        Equipe
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={toneClassName}
      title={`Rascunho de ${story.modelo}, revisado por ${story.revisadoPor ?? "a equipe"}`}
    >
      <SparklesIcon className="size-3" />
      IA revisada
    </Badge>
  );
}
