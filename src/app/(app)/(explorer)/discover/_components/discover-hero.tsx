"use client";

import Carousel from "@/components/ui/carousel";

import type { DiscoverPlace } from "./use-discover";

interface DiscoverHeroProps {
  places: DiscoverPlace[];
}

/**
 * Destaque do topo, no mesmo carrossel da galeria de `/places/[id]`.
 *
 * A tela precisava de **uma** entrada com peso: cinco trilhas de igual
 * tamanho não dizem por onde começar, e foto pequena em card de 240px não
 * convida a sair de casa. Aqui a foto é o argumento — o resto da página é
 * comparação, esta parte é convite.
 */
export function DiscoverHero({ places }: DiscoverHeroProps) {
  if (places.length === 0) return null;

  const slides = places.map(({ marker, details }) => ({
    title: marker.nome,
    subtitle: `${details.categoria} · ${details.bairro} · ${details.nota} ★ · ${details.distancia} km`,
    src: details.fotoUrl,
    button: "Ver lugar",
    href: `/places/${marker.id}`,
  }));

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-lg">Escolhidos pra hoje</h2>
        <span className="text-muted-foreground text-xs">
          nota alta, sem ficar longe
        </span>
      </div>

      {/* pb-12: os controles do carrossel são posicionados fora da moldura. */}
      <div className="pb-12">
        <Carousel
          slides={slides}
          width="min(56rem, 68vw)"
          height="min(22rem, 26vw)"
        />
      </div>
    </section>
  );
}
