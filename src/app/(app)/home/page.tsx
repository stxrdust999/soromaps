"use client";

import { useState, useEffect } from "react";
import {
  Map as MapComponent,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { BookImageIcon, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewPost from "./_components/review-post";

// Importando nossos novos componentes abstraídos
import DraggableDraftMarker from "./_components/drag-marker";
import CreateMarkerControls from "./_components/create-marker-controls";

interface Location {
  id: number;
  nome: string;
  lat: number;
  lng: number;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [snap, setSnap] = useState<number | string | null>(0.3);

  const [viewport, setViewport] = useState({
    center: [-47.44623758514884, -23.47205863818757] as [number, number],
    zoom: 15.5,
    bearing: 0,
    pitch: 0,
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [draftCoords, setDraftCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    setMounted(true);

    // Verifica se o zoom é 14 ou maior
    if (viewport.zoom >= 14) {
      // Faz o GET para a rota que retorna a lista de markers
      fetch("http://localhost:5068/api/markers")
        .then((response) => response.json())
        .then((dados) => {
          setLocations(Array.isArray(dados) ? dados : [dados]);
        })
        .catch((error) => console.error("Erro ao buscar locais:", error));
    } else {
      // Limpa os marcadores da tela se o zoom for menor que 14
      // Isso melhora a performance e evita um mapa poluído de longe
      setLocations([]);
    }
  }, [viewport.zoom]); // <--- A dependência chave: o React roda esse bloco sempre que o zoom mudar

  const isFullyExpanded = snap === 1;

  const handleStartCreating = () => {
    setIsCreating(true);
    setDraftCoords({
      lat: viewport.center[1],
      lng: viewport.center[0],
    });
    setSnap(0.3);
  };

  const handleSaveMarker = async () => {
    try {
      const response = await fetch("http://localhost:5068/api/markers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Novo Ponto",
          lat: draftCoords.lat,
          lng: draftCoords.lng,
        }),
      });

      if (response.ok) {
        const novoMarker = await response.json();
        setLocations((prev) => [...prev, novoMarker]);
        setIsCreating(false);
        alert("Ponto salvo com sucesso no banco!");
      } else {
        alert("Erro ao salvar o ponto na API.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  if (!mounted) {
    return <div className="h-screen w-full bg-background" />;
  }

  return (
    <div
      ref={setContainer}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      {/* 1. CAMADA DO MAPA */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-500",
          isFullyExpanded ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        {!isFullyExpanded && (
          <MapComponent viewport={viewport} onViewportChange={setViewport}>
            <MapControls position="top-right" />

            {/* Renderização dos pontos já existentes na API */}
            {locations.map((location) => (
              <MapMarker
                key={location.id}
                longitude={location.lng}
                latitude={location.lat}
              >
                <MarkerContent>
                  <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg cursor-pointer" />
                </MarkerContent>
                <MarkerTooltip>{location.nome}</MarkerTooltip>
                <MarkerPopup>
                  <div className="p-1">
                    <p className="text-sm font-bold">{location.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Ponto de interesse
                    </p>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}

            {/* Renderização do pino de criação (Lógica extraída) */}
            <DraggableDraftMarker
              isCreating={isCreating}
              draftCoords={draftCoords}
              setDraftCoords={setDraftCoords}
            />
          </MapComponent>
        )}
      </div>

      {/* 2. COMPONENTE DE DRAWER */}
      {container && (
        <Drawer
          open={true}
          modal={false}
          snapPoints={[0.3, 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          dismissible={false}
        >
          <DrawerContent
            container={container}
            className={cn(
              "absolute z-50 transition-all duration-500 ease-in-out border-t shadow-none h-full",
              isFullyExpanded
                ? "rounded-t-none border-t-0"
                : "rounded-t-[32px]",
            )}
          >
            <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300" />

            <DrawerHeader className="pb-2">
              <div className="flex flex-col gap-2 px-4">
                <div className="flex items-center justify-between">
                  <DrawerTitle className="text-2xl font-bold tracking-tight">
                    Explorar Sorocaba
                  </DrawerTitle>

                  {isFullyExpanded ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSnap(0.3)}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <MapIcon size={14} />
                      Ver Mapa
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSnap(1)}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <BookImageIcon size={14} />
                      Ver Feed
                    </Button>
                  )}
                </div>

                {/* Controles de Criação de Marcador (Lógica extraída) */}
                <CreateMarkerControls
                  isCreating={isCreating}
                  onStartCreating={handleStartCreating}
                  onCancel={() => setIsCreating(false)}
                  onSave={handleSaveMarker}
                />
              </div>
            </DrawerHeader>

            {/* Área de Conteúdo */}
            <section className="overflow-y-auto px-8 py-4">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold tracking-tight">
                  Últimas Avaliações
                </span>

                <ReviewPost
                  review={{
                    userId: "1",
                    username: "Arthur Pimenta",
                    content:
                      "Experiência incrível! O ambiente é super agradável e o prato principal estava impecável.",
                    rating: 5,
                  }}
                />

                <ReviewPost
                  review={{
                    userId: "2",
                    username: "João Silva",
                    content: "Muito bom o atendimento, voltarei com certeza!",
                    rating: 4,
                  }}
                />
              </div>
            </section>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
