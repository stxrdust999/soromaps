import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  profileCoverage,
  profileTopCategories,
  profileVisitsMock,
  profileWeeklyActivity,
} from "@/mocks/profile";

import { WeeklyActivityChart } from "../_components/weekly-activity-chart";

/**
 * O placar do explorador.
 *
 * Conquista é o prêmio, estatística é o placar — e o número-âncora é a
 * cobertura da cidade, porque completar mapa é a mecânica que faz voltar. O
 * mini-mapa da "mancha" explorada é fase 2: exige camada MapLibre própria.
 */
export default function ProfileStatsPage() {
  const cobertura = profileCoverage();
  const categorias = profileTopCategories();
  const maisVisitada = categorias.at(0)?.visitas ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sorocaba explorada</CardTitle>
          <CardDescription>
            Bairros onde você já registrou pelo menos uma visita, sobre os
            bairros que o mapa conhece hoje
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 border-t pt-6">
          <div className="flex items-end justify-between gap-4">
            <span className="font-semibold text-4xl tabular-nums">
              {cobertura.percentual}%
            </span>

            <span className="text-muted-foreground text-sm tabular-nums">
              {cobertura.visitados} de {cobertura.total} bairros
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${cobertura.percentual}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividade por semana</CardTitle>
          <CardDescription>
            Suas {profileVisitsMock.length} visitas distribuídas nas últimas
            oito semanas
          </CardDescription>
        </CardHeader>

        <CardContent className="border-t pt-6">
          <WeeklyActivityChart data={profileWeeklyActivity()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias que você mais visita</CardTitle>
          <CardDescription>
            O que este recorte diz é onde procurar recomendação sua
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 border-t pt-6">
          {categorias.map((item) => (
            <div key={item.categoria} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span>{item.categoria}</span>

                <span className="text-muted-foreground tabular-nums">
                  {item.visitas}
                </span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${(item.visitas / maisVisitada) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
