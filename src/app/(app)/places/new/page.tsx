"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Map as MapComponent, MapControls } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import DraggableDraftMarker from "../../home/_components/drag-marker";
import { Card } from "@/components/ui/card";

export default function NewPlacePage() {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [viewport, setViewport] = useState({
    center: [-47.44623758514884, -23.47205863818757] as [number, number],
    zoom: 15.5,
    bearing: 0,
    pitch: 0,
  });

  const [draftCoords, setDraftCoords] = useState({
    lat: -23.47205863818757,
    lng: -47.44623758514884,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/markers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Novo Ponto",
          lat: draftCoords.lat,
          lng: draftCoords.lng,
        }),
      });

      if (response.ok) {
        alert("salvo c sucesso");
        router.push("/home");
      } else {
        alert("Erro ao salvar o ponto.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/home");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <MapComponent viewport={viewport} onViewportChange={setViewport}>
        <MapControls position="top-right" showLocate showCompass />

        <DraggableDraftMarker
          isCreating={true}
          draftCoords={draftCoords}
          setDraftCoords={setDraftCoords}
        />
      </MapComponent>

      <div className="absolute bottom-4 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4 md:bottom-8">
        <Card className="flex flex-col gap-4 p-5 shadow-2xl backdrop-blur-md bg-background/95">
          <div>
            <h1 className="text-lg font-bold">Adicionar Novo Local</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Arraste o pin vermelho para o local correto no mapa.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Confirmar Local"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
