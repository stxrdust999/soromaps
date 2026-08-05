import { CatIcon, MapPinIcon, StarIcon, WifiIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/blocks/page-section";
import { PlaceLeaderboard } from "@/components/blocks/place-leaderboard";
import { VerifiedCommentCard } from "@/components/blocks/verified-comment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { markerShowTag } from "@/constants/markers";
import { getMarker } from "@/http/markers/markers";
import {
  getMarkerDetailsMock,
  getPlaceCommentMock,
  getPlaceLeaderboardMock,
} from "@/mocks/markers";
import { MarkerDeleteDialog } from "./_components/marker-delete-dialog";

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Detalhe de um local. Server Component: `getMarker` lê `API_URL`, que é
 * server-only — a interatividade fica nas folhas (`MarkerEditForm`,
 * `MarkerDeleteDialog`).
 *
 * A tela nasce com a visão de administrador; quando existir papel de usuário,
 * as ações passam por um gate e o explorador ganha o fluxo de sugestão.
 */
export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  const { id } = await params;
  const markerId = Number(id);

  if (Number.isNaN(markerId)) notFound();

  const response = await getMarker(markerId, {
    next: { tags: [markerShowTag(markerId)] },
  });

  if (response.status !== 200) notFound();

  const marker = response.data;
  const details = getMarkerDetailsMock(marker.id);
  const leaderboard = getPlaceLeaderboardMock(marker.id);
  const comment = getPlaceCommentMock(marker.id);

  const placeSubItem = (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Badge variant="default" className="bg-foreground text-background">
        <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
        {details.nota} · {details.totalAvaliacoes} avaliações
      </Badge>

      {details.temWifi && (
        <Badge variant="default">
          <WifiIcon className="size-3" />
          Tem wifi
        </Badge>
      )}

      {details.petFriendly && (
        <Badge variant="default" className="bg-amber-500">
          <CatIcon className="size-3" />
          Pet friendly
        </Badge>
      )}
    </div>
  );

  return (
    <div>
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted sm:h-72 lg:h-80">
        <Image
          src={details.fotoUrl}
          alt={`Foto de ${marker.nome}`}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <PageSection
        title={marker.nome}
        description={`${details.bairro} · ${details.categoria}`}
        actions={
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/home">
                <MapPinIcon className="size-4" />
                Ver no mapa
              </Link>
            </Button>

            <MarkerDeleteDialog markerId={marker.id} markerName={marker.nome} />
          </div>
        }
        subitems={placeSubItem}
      >
        <div className="flex flex-row gap-4">
          {/* mainzao */}
          <div className="flex flex-col gap-4">
            <div className="rounded-md w-full">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold">Descrição</span>

                <Separator />

                <span className="text-sm">{details.descricao}</span>
              </div>
            </div>

            {/* carousel */}
            <div className="flex flex-col gap-2 overflow-hidden">
              <span className="text-xl font-semibold">Fotos</span>

              <Separator />

              <div className="pt-2 pb-16">
                <Carousel
                  slides={details.fotos.map((src, index) => ({
                    src,
                    title: index === 0 ? marker.nome : details.bairro,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* aside */}
          <aside className="flex w-fit flex-col gap-4">
            <PlaceLeaderboard
              visitors={leaderboard}
              fullRankingHref={`/places/${marker.id}/leaderboard`}
            />

            <VerifiedCommentCard
              author={comment}
              comment={comment.comentario}
            />
          </aside>
        </div>
      </PageSection>
    </div>
  );
}
