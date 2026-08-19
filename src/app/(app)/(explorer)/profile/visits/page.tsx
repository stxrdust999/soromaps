import Link from "next/link";

import { PlaceRow } from "@/components/blocks/place-row";
import { StarRating } from "@/components/blocks/star-rating";
import { Button } from "@/components/ui/button";
import {
  formatVisitDate,
  profilePlace,
  profileVisitGroups,
  profileVisitSummary,
  visitDaysAgo,
} from "@/mocks/profile";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

/**
 * Timeline de visitas, agrupada por mês.
 *
 * O mesmo lugar aparece quantas vezes foi visitado: `Visita` leva `data` na PK
 * porque é evento repetível, e deduplicar aqui daria uma lista que conta outra
 * história. É também o que sustenta "esteve lá" nas avaliações.
 */
export default function ProfileVisitsPage() {
  const groups = profileVisitGroups();
  const resumo = profileVisitSummary();

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Você ainda não registrou nenhuma visita.
        </p>

        <Button asChild>
          <Link href="/home">Abrir o mapa</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground text-sm">
        {resumo.visitas} visitas · {resumo.lugares} lugares · {resumo.bairros}{" "}
        bairros · {resumo.categorias} categorias
      </p>

      {groups.map((group) => (
        <section key={group.rotulo} className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg capitalize">{group.rotulo}</h2>

          {group.visitas.map((visita) => {
            const lugar = profilePlace(visita.markerId);

            return (
              <PlaceRow
                key={`${visita.markerId}-${visita.data}`}
                marker={{ id: lugar.id, nome: lugar.nome }}
                trailing={
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">
                      {formatVisitDate(visita.data)} ·{" "}
                      {formatWaitingDays(visitDaysAgo(visita))}
                    </span>

                    {visita.nota !== undefined && (
                      <StarRating nota={visita.nota} size={12} />
                    )}
                  </div>
                }
              />
            );
          })}
        </section>
      ))}
    </div>
  );
}
