import { MapPinIcon, SparklesIcon, StarIcon } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { markerDetailsMocks } from "@/mocks/markers";

export default function FeedNewInMapSection() {
  const place = markerDetailsMocks[0];

  return (
    <section>
      <div className="flex items-center gap-1 w-fit mb-4">
        <SparklesIcon size={20} className="text-blue-500" />
        <span className="font-semibold text-sm">Novos no mapa</span>
      </div>

      <div className="border-1 border-border flex rounded-xl overflow-hidden items-center gap-0">
        <div className="relative h-24 w-24 m-0 flex items-center justify-center">
          <span className="font-bold text-2xl text-muted-foreground/50 ">
            1
          </span>
        </div>

        <div className="relative h-24 w-24 mr-4 ml-0 my-4">
          <Image
            src={place.fotoUrl}
            alt={`Foto de ${place.nome}`}
            fill
            className="object-cover rounded-2xl"
            sizes="174px"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className=" flex items-center flex-row gap-2 ">
            <span className="text-sm font-semibold">{place.nome}</span>

            <Badge className="text-xs" variant={"default"}>
              Novo
            </Badge>
          </div>

          <div className=" flex items-center flex-row gap-1 items-center">
            <MapPinIcon size={12} className="text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              {place.bairro}
            </span>
          </div>

          <div className=" flex flex-row gap-2 items-center">
            <Badge>{place.categoria}</Badge>

            <div className="flex flex-row gap-1 items-center">
              <StarIcon className="text-yellow-500 fill-yellow-500" size={12} />
              <span className="text-sm font-semibold">{place.nota}</span>{" "}
              <span className="text-xs text-muted-foreground">
                ({place.totalAvaliacoes})
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
