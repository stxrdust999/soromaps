import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { feedItemDate, feedItemsMock } from "@/mocks/feed";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

/** Cartões visíveis antes de a fita virar rolagem. */
const VISIBLE_LIMIT = 6;

/**
 * Conquistas recentes da comunidade.
 *
 * A tela tinha três blocos editoriais e uma busca de usuário — nada mostrava
 * gente *fazendo* algo agora. Reusa os eventos `kind: "conquista"` do feed
 * (`src/mocks/feed.ts`) em vez de inventar um novo dado: é o mesmo motor que
 * já teria a lista quando `GanhaConquista` existir.
 */
export function RecentAchievements() {
  const recent = feedItemsMock
    .filter((item) => item.kind === "conquista")
    .sort((a, b) => a.diasAtras - b.diasAtras)
    .slice(0, VISIBLE_LIMIT);

  if (recent.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-lg">Conquistas recentes</h2>
        <span className="text-muted-foreground text-xs">
          quem desbloqueou o quê pela cidade
        </span>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {recent.map((item) => (
          <div
            key={item.id}
            className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <AchievementBadge
              layout="icon"
              badgeSize="sm"
              achievement={{
                id: item.id,
                name: item.conquista.nome,
                trigger: "metric",
                icon: item.conquista.icon,
                color: item.conquista.cor,
                achievedAt: feedItemDate(item.diasAtras),
              }}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Avatar className="size-4">
                  {item.autor.avatarUrl && (
                    <AvatarImage
                      src={item.autor.avatarUrl}
                      alt={item.autor.nome}
                    />
                  )}
                  <AvatarFallback className="text-[8px]">
                    {item.autor.iniciais}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium text-xs">
                  {item.autor.nome}
                </span>
              </div>

              <span className="truncate font-semibold text-sm">
                {item.conquista.nome}
              </span>

              <span className="truncate text-muted-foreground text-xs">
                {formatWaitingDays(item.diasAtras)}
                {item.local && ` · ${item.local.nome}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
