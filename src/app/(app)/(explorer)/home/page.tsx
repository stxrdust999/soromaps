"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Map as MapComponent, MapControls } from "@/components/ui/map";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { BookImageIcon, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationMarker from "./_components/marker";
import FeedTrendingSection from "./_components/feed/feed-trending-section";
import FeedNewInMapSection from "./_components/feed/feed-new-in-map-section";

interface Location {
  id: number;
  nome: string;
  lat: number;
  lng: number;
}

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [snap, setSnap] = useState<number | string | null>(0.3);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [viewport, setViewport] = useState({
    center: [-47.44623758514884, -23.47205863818757] as [number, number],
    zoom: 15.5,
    bearing: 0,
    pitch: 0,
  });

  const [locations, setLocations] = useState<Location[]>([]);

  const handleUpdateLocation = (updatedLocation: Location) => {
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.id === updatedLocation.id ? updatedLocation : loc,
      ),
    );
  };

  const handleDeleteLocation = (id: number) => {
    // Filtra o array, mantendo apenas os pontos onde o id é diferente do id excluído
    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.id !== id),
    );
  };

  useEffect(() => {
    setMounted(true);

    // Verifica se o zoom é 14 ou maior
    if (viewport.zoom >= 14) {
      // Faz o GET para a rota que retorna a lista de markers
      fetch(`${API_URL}/api/markers`)
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
  }, [viewport.zoom, API_URL]); // <--- A dependência chave: o React roda esse bloco sempre que o zoom mudar

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
            <MapControls position="top-right" showLocate showCompass />

            {/* Renderização dos pontos já existentes na API */}
            {/* --- MARKERS DA API (Refatorados) --- */}
            {locations.map((location) => (
              <LocationMarker
                key={location.id}
                location={location}
                onUpdate={handleUpdateLocation}
                onDelete={handleDeleteLocation}
              />
            ))}

            {/* O pino de criação foi movido para a tela dedicada /places/new */}
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
              "absolute z-50 transition-all duration-500 ease-in-out border-t  shadow-none h-full",
              isFullyExpanded
                ? "rounded-t-none border-t-0"
                : "rounded-t-[32px]",
            )}
            aria-describedby={undefined}
          >
            <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-black " />

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

                <Button
                  onClick={() => router.push("/places/new")}
                  className="w-full mt-2"
                >
                  + Adicionar Novo Local
                </Button>
              </div>
            </DrawerHeader>
            {/* Área de Conteúdo */}
            <section className="overflow-y-auto px-8 py-4 flex flex-col gap-4">
              <FeedTrendingSection />

              <FeedNewInMapSection />

              {isFullyExpanded && <SiteFooter />}
            </section>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
