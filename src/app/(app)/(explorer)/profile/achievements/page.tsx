import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatVisitDate,
  profileLockedAchievements,
  profileUnlockedAchievements,
} from "@/mocks/profile";

import { AchievementProgressCard } from "../_components/achievement-progress-card";

/**
 * Galeria de conquistas: as obtidas com a data, as travadas com o critério e o
 * progresso.
 *
 * Não há pontuação nem nível — decisão de 2026-08-12. O que aparece ao lado do
 * nome é o título derivado da contagem, em `@/constants/explorer-titles`.
 */
export default function ProfileAchievementsPage() {
  const desbloqueadas = profileUnlockedAchievements();
  const emProgresso = profileLockedAchievements();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">
          Desbloqueadas ({desbloqueadas.length})
        </h2>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {desbloqueadas.map((item) => (
            <Card key={item.badge.id} size="sm">
              <CardContent className="flex flex-col items-center gap-2 text-center">
                <AchievementBadge achievement={item.badge} badgeSize="xl" />

                <span className="text-muted-foreground text-xs">
                  {item.descricao}
                </span>

                <span className="text-muted-foreground text-xs">
                  Obtida em {formatVisitDate(item.badge.achievedAt ?? "")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">
          Em progresso ({emProgresso.length})
        </h2>

        <div className="grid gap-3 lg:grid-cols-2">
          {emProgresso.map((item) => (
            <AchievementProgressCard key={item.badge.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
