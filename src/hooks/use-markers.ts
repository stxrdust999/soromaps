"use client";

import { useCallback, useEffect, useState } from "react";

import { useMap } from "@/components/ui/map";
import type { MarkerResource } from "@/types/marker";

// TODO: trocar por /api/proxy — NEXT_PUBLIC_API_URL não é definida em produção
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Carrega os markers da API enquanto o zoom estiver em `minZoom` ou acima, e
 * limpa a lista abaixo disso. Precisa ser chamado dentro de um `<Map>`.
 */
export function useMarkers({ minZoom = 14 }: { minZoom?: number } = {}) {
  const { map } = useMap();
  const [isAboveMinZoom, setIsAboveMinZoom] = useState(false);
  const [markers, setMarkers] = useState<MarkerResource[]>([]);

  useEffect(() => {
    if (!map) return;

    // moveend, não move: move dispara a cada frame durante o gesto
    const handleMoveEnd = () => setIsAboveMinZoom(map.getZoom() >= minZoom);

    handleMoveEnd();
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, minZoom]);

  useEffect(() => {
    if (!isAboveMinZoom) {
      setMarkers([]);
      return;
    }

    const controller = new AbortController();

    fetch(`${API_URL}/api/markers`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setMarkers(Array.isArray(data) ? data : [data]))
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          console.error("Erro ao buscar locais:", error);
        }
      });

    return () => controller.abort();
  }, [isAboveMinZoom]);

  const updateMarker = useCallback((updated: MarkerResource) => {
    setMarkers((current) =>
      current.map((marker) => (marker.id === updated.id ? updated : marker)),
    );
  }, []);

  const removeMarker = useCallback((id: number) => {
    setMarkers((current) => current.filter((marker) => marker.id !== id));
  }, []);

  return { markers, updateMarker, removeMarker };
}
