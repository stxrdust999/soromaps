import {
  ActivityIcon,
  CompassIcon,
  HeartIcon,
  type LucideIcon,
  NavigationIcon,
  NewspaperIcon,
} from "lucide-react";

/**
 * Por que um item entrou no seu feed.
 *
 * O feed do Soromaps **não tem grafo social**: nenhum item existe porque
 * "fulano que você segue postou". Toda entrada é ancorada em lugar — bairro,
 * local salvo, categoria que você explora, movimento da cidade ou pauta da
 * equipe. O motivo viaja junto com o item porque ele é exibido no card: feed
 * que não explica por que te mostrou algo não dá ao usuário como corrigi-lo.
 *
 * Ver `docs/todo/user/feed.md`.
 */
export type FeedReason =
  | "perto"
  | "salvo"
  | "categoria"
  | "cidade"
  | "curadoria";

export interface FeedReasonDefinition {
  /** Rótulo do chip de filtro, na voz do usuário. */
  label: string;
  /** Frase do selo dentro do card, completando "por que isto está aqui". */
  hint: string;
  icon: LucideIcon;
  /** Cor do selo — a mesma em toda a aplicação, para virar hábito de leitura. */
  className: string;
}

export const FEED_REASONS: Record<FeedReason, FeedReasonDefinition> = {
  perto: {
    label: "Perto de mim",
    hint: "Perto de você",
    icon: NavigationIcon,
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  },
  salvo: {
    label: "Meus lugares",
    hint: "Lugar que você acompanha",
    icon: HeartIcon,
    className: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  },
  categoria: {
    label: "Minha vibe",
    hint: "Categoria que você explora",
    icon: CompassIcon,
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  },
  cidade: {
    label: "A cidade",
    hint: "Acontecendo em Sorocaba",
    icon: ActivityIcon,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  curadoria: {
    label: "Pauta",
    hint: "Escolha da equipe Soromaps",
    icon: NewspaperIcon,
    className: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  },
};

/**
 * Ordem dos chips. `cidade` vem por último entre as fontes pessoais porque é a
 * mais larga — é ela que resolve o cold start de quem acabou de chegar e ainda
 * não salvou nem visitou nada.
 */
export const FEED_REASON_ORDER: FeedReason[] = [
  "perto",
  "salvo",
  "categoria",
  "cidade",
  "curadoria",
];

/**
 * Como o feed ordena.
 *
 * `recente` é o padrão honesto e é o que o backend consegue entregar com um
 * `ORDER BY created_at`. `relevancia` existe porque o feed mistura fontes de
 * ritmos diferentes: sem ele, um dia movimentado na cidade soterra a única
 * novidade do lugar que a pessoa acompanha.
 */
export type FeedSort = "relevancia" | "recente";

export const FEED_SORT_LABEL: Record<FeedSort, string> = {
  relevancia: "Mais relevantes",
  recente: "Mais recentes",
};

/** Eixo pelo qual o usuário pede menos conteúdo parecido. */
export type FeedMuteScope = "bairro" | "categoria" | "tipo";
