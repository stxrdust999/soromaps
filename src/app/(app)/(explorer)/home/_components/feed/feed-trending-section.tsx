import { FlameIcon, NavigationIcon, StarIcon } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { markerDetailsMocks } from "@/mocks/markers";

export default function FeedTrendingSection() {
  return (
    <section>
      <div className="flex items-center gap-1 w-fit mb-4">
        <FlameIcon size={20} className="text-orange-500" />
        <span className="font-semibold text-sm">Em Alta</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {markerDetailsMocks.map((place) => (
          <div
            key={place.nome}
            className="flex flex-col gap-0 border border-border rounded-2xl overflow-hidden w-56 flex-none bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-36 w-full bg-muted">
              <Image
                src={place.fotoUrl}
                alt={`Foto de ${place.nome}`}
                fill
                className="object-cover"
                sizes="174px"
              />

              <Badge
                variant="default"
                className="absolute top-2 left-2 bg-orange-400 text-white"
              >
                <FlameIcon size={12} />
                <span className="text-xs">Em Alta</span>
              </Badge>

              <Badge variant="secondary" className="absolute bottom-2 left-2">
                {place.categoria}
              </Badge>

              <Badge
                variant="secondary"
                className="absolute bottom-2 right-2 bg-black/75 text-white"
              >
                <StarIcon
                  className="text-yellow-500 fill-yellow-500"
                  size={12}
                />
                <span>{place.nota}</span>
              </Badge>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">{place.nome}</span>
                <span className="text-xs text-muted-foreground">
                  {place.bairro}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <NavigationIcon size={12} className="text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    {place.distancia}km
                  </span>
                </div>
                <div className="rounded-full bg-muted-foreground/30 w-1 h-1" />
                <span className="text-xs text-muted-foreground">
                  {place.totalAvaliacoes} Avaliações
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
