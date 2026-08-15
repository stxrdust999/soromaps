"use client";

import type { ComponentProps, KeyboardEvent } from "react";

import {
  ACHIEVEMENT_ICONS,
  type AchievementIconKey,
  type AchievementTrigger,
} from "@/constants/achievements";
import { cn } from "@/lib/utils";

/**
 * Badge de conquista.
 *
 * Vem do Trophy UI Kit (`ui.trophy.so/achievement-badge`), adaptado — o
 * registry entrega o código, então ele é nosso a partir daqui. Três mudanças
 * sobre o original: os estados travado/desbloqueado estavam **invertidos**
 * (desbloqueado ganhava `bg-muted`, travado ganhava `bg-primary`); o badge só
 * sabia renderizar `Trophy` ou uma imagem, e o nosso catálogo escolhe ícone
 * lucide + cor; e as strings estavam em inglês.
 *
 * O anel de progresso também passou a valer travado. No original ele só
 * aparecia com a conquista já obtida, que é justamente quando progresso não
 * importa mais.
 */
interface Achievement {
  id: string;
  name: string;
  trigger: AchievementTrigger;
  /** Ícone do catálogo. Sem ele o badge cai no troféu genérico. */
  icon?: AchievementIconKey;
  /** Cor de fundo do disco quando desbloqueado, em hex. */
  color?: string;
  progress?: number;
  /** Percentil de quem tem a conquista. */
  rarity?: number;
}

interface UserAchievement extends Achievement {
  /** Data ISO de obtenção, ou `null` quando travada. */
  achievedAt: string | null;
}

interface AchievementBadgeProps extends ComponentProps<"div"> {
  achievement: UserAchievement;
  badgeSize?: "sm" | "default" | "lg" | "xl";
  /**
   * `card` traz raridade e nome embaixo do disco; `icon` é só o disco, para
   * célula de tabela e linha de lista.
   */
  layout?: "card" | "icon";
  onAchievementClick?: (achievement: UserAchievement) => void;
}

const badgeSizeMap = {
  sm: "size-8",
  default: "size-14",
  lg: "size-16",
  xl: "size-22",
} as const;

const iconSizeMap = {
  sm: "size-4",
  default: "size-7",
  lg: "size-8",
  xl: "size-11",
} as const;

const ringSizeMap = {
  sm: 40,
  default: 72,
  lg: 84,
  xl: 108,
} as const;

function AchievementBadge({
  className,
  achievement,
  badgeSize = "default",
  layout = "card",
  onAchievementClick,
  ...props
}: AchievementBadgeProps) {
  const isUnlocked = achievement.achievedAt !== null;
  const Icon = achievement.icon
    ? ACHIEVEMENT_ICONS[achievement.icon]
    : ACHIEVEMENT_ICONS.trophy;

  const hasProgress = typeof achievement.progress === "number";
  const progress = Math.min(100, Math.max(0, achievement.progress ?? 0));

  const rarity =
    typeof achievement.rarity === "number"
      ? Math.min(100, Math.max(0, Math.round(achievement.rarity)))
      : null;

  const ringSize = ringSizeMap[badgeSize];
  const ringStrokeWidth = 4;
  const ringRadius = (ringSize - ringStrokeWidth) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const statusLabel = isUnlocked ? "conquistada" : "bloqueada";
  const interactive = Boolean(onAchievementClick);

  const disc = (
    <div
      className="relative flex items-center justify-center"
      style={hasProgress ? { width: ringSize, height: ringSize } : undefined}
    >
      {hasProgress && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0 size-full"
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={achievement.color ?? "var(--primary)"}
            strokeLinecap="round"
            strokeWidth={ringStrokeWidth}
            strokeDasharray={ringCircumference}
            strokeDashoffset={
              ringCircumference - (progress / 100) * ringCircumference
            }
            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
          />
        </svg>
      )}

      <div
        aria-hidden="true"
        className={cn(
          badgeSizeMap[badgeSize],
          "relative z-10 flex items-center justify-center rounded-full",
          isUnlocked
            ? "text-white"
            : "bg-muted text-muted-foreground border border-dashed",
        )}
        style={isUnlocked ? { backgroundColor: achievement.color } : undefined}
      >
        <Icon className={iconSizeMap[badgeSize]} strokeWidth={1.8} />
      </div>
    </div>
  );

  /**
   * Só vira botão quando há callback. Anexar `onClick`/`tabIndex` a uma `div`
   * decorativa põe no caminho do teclado algo que não faz nada.
   */
  const interactiveProps = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": `${achievement.name}, ${statusLabel}`,
        onClick: () => onAchievementClick?.(achievement),
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          onAchievementClick?.(achievement);
        },
      }
    : {};

  if (layout === "icon") {
    return (
      <div
        {...interactiveProps}
        className={cn("shrink-0", interactive && "cursor-pointer", className)}
        {...props}
      >
        {disc}
      </div>
    );
  }

  return (
    <div
      {...interactiveProps}
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        interactive && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {disc}

      {rarity !== null && (
        <span className="text-muted-foreground text-xs font-medium">
          {rarity}% dos usuários
        </span>
      )}

      <span
        className={cn(
          "text-center text-xs leading-tight",
          isUnlocked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {achievement.name}
      </span>
    </div>
  );
}

export { AchievementBadge };
export type { Achievement, AchievementBadgeProps, UserAchievement };
