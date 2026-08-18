"use client";

import { HeartIcon, MapPinIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedPlaceLinkProps {
  placeId: number;
  label?: string;
}

/** Leva ao detalhe do lugar — o destino padrão de qualquer item do feed. */
export function FeedPlaceLink({
  placeId,
  label = "Ver local",
}: FeedPlaceLinkProps) {
  return (
    <Button asChild size="sm" variant="ghost">
      <Link href={`/places/${placeId}`}>
        <MapPinIcon />
        {label}
      </Link>
    </Button>
  );
}

interface FeedSaveButtonProps {
  saved: boolean;
  onToggle: () => void;
}

/**
 * Salvar o lugar.
 *
 * É a única "assinatura" que o feed oferece, e ela é de lugar, não de pessoa:
 * salvar aqui é o que faz o próximo movimento daquele ponto voltar pelo motivo
 * `salvo`. Vira `Favorita` quando a tabela existir.
 */
export function FeedSaveButton({ saved, onToggle }: FeedSaveButtonProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onToggle}
      aria-pressed={saved}
      className={cn(saved && "text-rose-600 dark:text-rose-400")}
    >
      <HeartIcon className={cn(saved && "fill-current")} />
      {saved ? "Acompanhando" : "Acompanhar lugar"}
    </Button>
  );
}

interface FeedUsefulButtonProps {
  count: number;
  marked: boolean;
  onToggle: () => void;
}

/**
 * Reação de utilidade.
 *
 * "Útil" em vez de "curtir" de propósito: a pergunta que o produto quer
 * responder é se a dica ajudou alguém a decidir, e é esse contador que pode
 * ordenar avaliação na página do lugar. Curtida mede simpatia pelo autor —
 * exatamente o eixo social que este feed não tem.
 */
export function FeedUsefulButton({
  count,
  marked,
  onToggle,
}: FeedUsefulButtonProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onToggle}
      aria-pressed={marked}
      className={cn(marked && "text-primary")}
    >
      <ThumbsUpIcon className={cn(marked && "fill-current")} />
      Útil
      <span className="tabular-nums">{count + (marked ? 1 : 0)}</span>
    </Button>
  );
}
