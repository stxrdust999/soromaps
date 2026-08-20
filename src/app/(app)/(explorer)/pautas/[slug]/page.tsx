import { ClockIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/blocks/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoryMock, publishedStoriesMock } from "@/mocks/stories";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Uma pauta.
 *
 * Rota própria, fora de `/community`, porque a pauta é destino de três lugares
 * diferentes: a vitrine da Comunidade, o card `curadoria` do feed e, no futuro,
 * a página do próprio ponto. Aninhar em comunidade daria a ela uma URL que
 * mente sobre o assunto.
 *
 * Rascunho não abre: enquanto `status` é `rascunho`, a pauta responde 404 para
 * o leitor. Publicar é decisão humana, e a rota respeita isso.
 */
export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryMock(slug);

  if (!story || story.status !== "publicada") notFound();

  const others = publishedStoriesMock.filter(
    (item) => item.slug !== story.slug,
  );

  return (
    <main className="flex flex-1 flex-col">
      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-muted sm:h-80">
        <Image
          src={story.fotoUrl}
          alt={story.titulo}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <PageSection
        title={story.titulo}
        description={story.chapeu}
        className="mx-auto w-full max-w-3xl gap-6"
        subitems={
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {story.origem === "ia" ? (
              <Badge variant="outline">
                <SparklesIcon className="size-3" />
                Rascunho de {story.modelo}, revisado por {story.revisadoPor}
              </Badge>
            ) : (
              <Badge variant="outline">Por {story.revisadoPor}</Badge>
            )}

            <Badge variant="ghost">
              <ClockIcon className="size-3" />
              {story.tempoLeitura} min de leitura
            </Badge>

            <Badge variant="ghost">{formatWaitingDays(story.diasAtras)}</Badge>
          </div>
        }
      >
        <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
          {story.chamada}
        </p>

        <article className="flex flex-col gap-4">
          {story.corpo.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-pretty leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Lugares desta pauta</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {story.locais.map((place) => (
              <Card key={place.id} size="sm" className="card-interactive">
                <CardContent className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 flex-col">
                    <Link
                      href={`/places/${place.id}`}
                      className="truncate font-semibold text-sm hover:underline"
                    >
                      {place.nome}
                    </Link>
                    <span className="truncate text-muted-foreground text-xs">
                      {place.categoria} · {place.bairro}
                    </span>
                  </span>

                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/places/${place.id}`}>Ver</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {others.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Outras pautas</h2>

            <div className="flex flex-col gap-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/pautas/${item.slug}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span className="truncate">{item.titulo}</span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {item.tempoLeitura} min
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </PageSection>
    </main>
  );
}
