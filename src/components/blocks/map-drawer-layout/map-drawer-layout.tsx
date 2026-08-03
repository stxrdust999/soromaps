"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Map as MapCanvas,
  MapControls,
  type MapViewport,
} from "@/components/ui/map";
import { SOROCABA_VIEWPORT } from "@/constants/map";
import { cn } from "@/lib/utils";

import {
  MapDrawerLayoutContext,
  type SnapPoint,
} from "./map-drawer-layout-context";

const DEFAULT_SNAP_POINTS: SnapPoint[] = [0.3, 1];

/**
 * Espelha a moldura do painel recolhido enquanto o vaul não pode renderizar.
 * Sem ele a primeira pintura é um fundo vazio.
 */
function PanelSkeleton({
  className,
  snap,
}: {
  className: string;
  snap: SnapPoint;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        className,
        "inset-x-0 bottom-0 flex flex-col bg-popover text-popover-foreground",
      )}
      style={
        typeof snap === "number"
          ? { transform: `translateY(${(1 - snap) * 100}%)` }
          : undefined
      }
    >
      <div className="mx-auto mt-4 h-1.5 w-25 shrink-0 rounded-full bg-muted" />
    </div>
  );
}

type MapDrawerLayoutProps = {
  map?: ReactNode;
  /** Posição de abertura do mapa. Só é lida na montagem. */
  initialViewport?: Partial<MapViewport>;
  snapPoints?: SnapPoint[];
  className?: string;
  children: ReactNode;
};

/**
 * Mapa em tela cheia com um painel arrastável por cima: recolhido revela o
 * mapa, arrastado até o último snap point vira a página inteira.
 *
 * `map` é renderizado dentro do `<Map>` — markers, rotas, pin de rascunho.
 * `children` é o conteúdo do painel e precisa incluir um `DrawerTitle`, exigido
 * pelo Radix. `snapPoints` default: `[0.3, 1]`.
 */
export function MapDrawerLayout({
  map,
  initialViewport = SOROCABA_VIEWPORT,
  snapPoints = DEFAULT_SNAP_POINTS,
  className,
  children,
}: MapDrawerLayoutProps) {
  const [snap, setSnap] = useState<SnapPoint | null>(snapPoints[0]);
  const [isMounted, setIsMounted] = useState(false);

  const collapsedSnap = snapPoints[0];
  const expandedSnap = snapPoints[snapPoints.length - 1];
  const isExpanded = snap === expandedSnap;

  // O vaul lê document.body no render, então só entra depois da hidratação
  useEffect(() => setIsMounted(true), []);

  const expand = useCallback(() => setSnap(expandedSnap), [expandedSnap]);
  const collapse = useCallback(() => setSnap(collapsedSnap), [collapsedSnap]);

  const context = useMemo(
    () => ({ snap, setSnap, isExpanded, expand, collapse }),
    [snap, isExpanded, expand, collapse],
  );

  const panelClassName = cn(
    "absolute z-50 h-full border-t shadow-none transition-[border-radius] duration-500 ease-in-out",
    isExpanded ? "rounded-t-none border-t-0" : "rounded-t-[32px]",
  );

  const panel = (
    <section className={cn("flex flex-1 flex-col overflow-y-auto", className)}>
      {children}
    </section>
  );

  return (
    <MapDrawerLayoutContext.Provider value={context}>
      <div className="relative h-screen w-full overflow-hidden bg-background">
        <div
          aria-hidden={isExpanded}
          className={cn(
            "absolute inset-0 z-0 transition-opacity duration-500",
            isExpanded && "pointer-events-none opacity-0",
          )}
        >
          {/* viewport sem onViewportChange: o Map só usa na inicialização */}
          <MapCanvas viewport={initialViewport}>
            <MapControls position="top-right" showLocate showCompass />
            {map}
          </MapCanvas>
        </div>

        {isMounted ? (
          <Drawer
            open
            modal={false}
            dismissible={false}
            snapPoints={snapPoints}
            activeSnapPoint={snap}
            setActiveSnapPoint={setSnap}
          >
            {/* transition-all brigaria com o transform que o vaul anima no arrasto */}
            <DrawerContent
              noPortal
              overlay={false}
              aria-describedby={undefined}
              className={panelClassName}
            >
              {panel}
            </DrawerContent>
          </Drawer>
        ) : (
          <PanelSkeleton className={panelClassName} snap={collapsedSnap} />
        )}
      </div>
    </MapDrawerLayoutContext.Provider>
  );
}
