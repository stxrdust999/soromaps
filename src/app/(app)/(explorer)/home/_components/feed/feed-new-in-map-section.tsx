import { Badge } from "@/components/ui/badge";
import { MapPinIcon, SparklesIcon, StarIcon } from "lucide-react";
import Image from "next/image";

export default function FeedNewInMapSection() {
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
            src={`https://picsum.photos/seed/14/400/300`}
            alt="Foto do Local"
            fill
            className="object-cover rounded-2xl"
            sizes="174px"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className=" flex items-center flex-row gap-2 ">
            <span className="text-sm font-semibold">Cabocafé</span>

            <Badge className="text-xs" variant={"default"}>
              Novo
            </Badge>
          </div>

          <div className=" flex items-center flex-row gap-1 items-center">
            <MapPinIcon size={12} className="text-muted-foreground" />

            <span className="text-xs text-muted-foreground">Santa Rosália</span>
          </div>

          <div className=" flex flex-row gap-2 items-center">
            <Badge>Café</Badge>

            <div className="flex flex-row gap-1 items-center">
              <StarIcon className="text-yellow-500 fill-yellow-500" size={12} />
              <span className="text-sm font-semibold">4.8</span>{" "}
              <span className="text-xs text-muted-foreground">(21)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
