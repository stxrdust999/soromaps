"use client";

import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Map as MapCanvas, MapControls } from "@/components/ui/map";
import { SOROCABA_VIEWPORT } from "@/constants/map";
import DraggableDraftMarker from "../../home/_components/drag-marker";
import { CreateMarkerForm } from "./_components/create-marker-form";

/** `picking` posiciona o pin; `form` coleta os dados do local. */
type Stage = "picking" | "form";

const [initialLng, initialLat] = SOROCABA_VIEWPORT.center ?? [0, 0];

/**
 * Criação de local em dois estágios sobre o mapa. O painel é um card
 * flutuante, não um dialog: nada escurece o mapa, então a posição escolhida
 * continua visível enquanto o formulário é preenchido.
 */
export default function NewPlacePage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("picking");
  const [draftCoords, setDraftCoords] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <MapCanvas viewport={SOROCABA_VIEWPORT}>
        <MapControls position="top-right" showLocate showCompass />

        <DraggableDraftMarker
          isCreating
          isDraggable={stage === "picking"}
          draftCoords={draftCoords}
          setDraftCoords={setDraftCoords}
        />
      </MapCanvas>

      <div className="absolute bottom-4 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4 md:bottom-8">
        <Card className="gap-4 bg-background/95 p-5 shadow-2xl backdrop-blur-md">
          <div>
            <h1 className="font-bold text-lg">
              {stage === "picking" ? "Adicionar novo local" : "Sobre o local"}
            </h1>
            <p className="mt-0.5 text-muted-foreground text-xs">
              {stage === "picking"
                ? "Arraste o pin para o local correto no mapa."
                : "Conta pra gente o que tem de bom nesse lugar."}
            </p>
          </div>

          {stage === "picking" ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/home")}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => setStage("form")}>
                <CheckIcon className="size-4" />
                Confirmar local
              </Button>
            </div>
          ) : (
            <CreateMarkerForm
              coords={draftCoords}
              onChangeLocation={() => setStage("picking")}
              onSuccess={() => router.push("/home")}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
