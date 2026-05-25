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

  /**
   *  Sets the default coordinates  visibility of the map
   */
  const [viewport, setViewport] = useState({
    center: [-47.463448773593726, -23.533653509871126] as [number, number],
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch("http://localhost:5068/api/markers/")
      .then((response) => response.json())
      .then((dados) => {
        // O nome "dados" nasce aqui dentro
        // Se a API retorna um objeto único, coloque entre [ ]
        // Se já retorna um array, use apenas setLocations(dados)
        setLocations(Array.isArray(dados) ? dados : [dados]);
      })
      .catch((error) => console.error("Erro ao buscar locais:", error));
  }, []);

  const isFullyExpanded = snap === 1;

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
            <MapControls position="top-right" showLocate />

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
            {/* Handle visual */}
            <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300" />

            <DrawerHeader className="pb-2">
              <div className="flex items-center justify-between px-4">
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
            </DrawerHeader>

            {/* Área de Conteúdo */}
            <section className="overflow-y-auto px-8 py-4">
              {/* reviews list */}
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold tracking-tight">
                  Últimas Avaliações
                </span>

                <ReviewPost
                  review={{
                    userId: "1",
                    username: "Arthur Pimenta",
                    content:
                      "Experiência incrível! O ambiente é super agradável e o prato principal estava impecável. Recomendo muito o risoto de cogumelos.",
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
