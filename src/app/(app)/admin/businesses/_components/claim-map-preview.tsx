import { FileTextIcon, StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDistance } from "@/utils/formatters/format-distance";

/** Acima disto o pin do CNPJ é jogado longe para o afastamento ficar visível. */
const DISTANT_CNPJ_KM = 1;

interface ClaimMapPreviewProps {
  ponto: string;
  coordenadas: string;
  cidadeCnpj: string | null;
  /** `null` quando não há CNPJ declarado — não há o que comparar. */
  distanciaKm: number | null;
}

/**
 * Recorte esquemático com dois pinos: o ponto reivindicado e o endereço do
 * CNPJ declarado.
 *
 * A posição horizontal do segundo pino é **ilustrativa**, derivada da
 * distância, não de projeção real — a pergunta aqui é "esses dois endereços
 * são o mesmo lugar?", e para isso perto × longe basta.
 */
export function ClaimMapPreview({
  ponto,
  coordenadas,
  cidadeCnpj,
  distanciaKm,
}: ClaimMapPreviewProps) {
  const distant = distanciaKm !== null && distanciaKm > DISTANT_CNPJ_KM;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-sm">
          Ponto reivindicado × endereço do CNPJ
        </span>

        <span
          className={cn(
            "text-xs font-semibold",
            distant ? "text-warning" : "text-muted-foreground",
          )}
        >
          {distanciaKm === null
            ? "Sem CNPJ para comparar"
            : `${formatDistance(distanciaKm)} entre o pin e o endereço do CNPJ`}
        </span>
      </div>

      <div className="bg-muted/40 relative h-48 overflow-hidden rounded-lg border">
        <svg
          viewBox="0 0 700 190"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <g className="stroke-border/60" strokeWidth={9}>
            <path d="M-10 52 L710 38" />
            <path d="M-10 128 L710 114" />
            <path d="M150 -10 L176 200" />
            <path d="M420 -10 L446 200" />
          </g>

          <g className="stroke-border/40" strokeWidth={3}>
            <path d="M-10 88 L710 76" />
            <path d="M290 -10 L312 200" />
            <path d="M570 -10 L592 200" />
          </g>

          <line
            x1={150}
            y1={86}
            x2={distant ? 500 : 240}
            y2={112}
            strokeWidth={1.2}
            strokeDasharray="5 4"
            className="stroke-muted-foreground/70"
          />
        </svg>

        <div className="absolute top-12 left-[18%] flex flex-col items-center gap-1.5">
          <span className="bg-primary border-background flex size-8 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2">
            <StoreIcon size={14} className="rotate-45 text-white" />
          </span>
          <span className="text-xs whitespace-nowrap">{ponto}</span>
          <span className="text-muted-foreground font-mono text-[10px] whitespace-nowrap">
            {coordenadas}
          </span>
        </div>

        {distanciaKm !== null && (
          <div
            className="absolute top-[92px] flex flex-col items-center gap-1.5"
            style={{ left: distant ? "68%" : "31%" }}
          >
            <span className="bg-muted-foreground/75 border-background flex size-6.5 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2">
              <FileTextIcon size={12} className="text-background rotate-45" />
            </span>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              Endereço do CNPJ
            </span>
            <span className="text-muted-foreground text-[10px] whitespace-nowrap">
              {cidadeCnpj}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
