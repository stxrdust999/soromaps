"use client";

import { useCallback, useMemo, useState } from "react";

import {
  type ModerationItemMock,
  type ModerationStatus,
  moderationQueueMock,
} from "@/mocks/admin-moderation";

/** Filtro de categoria em "todas" — sentinela, porque `Select` não aceita `""`. */
export const ALL_CATEGORIES = "todas";

interface QueueFilters {
  status: ModerationStatus;
  categoria: string;
  soComAlerta: boolean;
}

/**
 * Item merece atenção antes dos outros: duplicata suspeita, ficha incompleta
 * ou autor sem histórico. Sem alerta = candidato a aprovação rápida.
 *
 * @param item Ponto na fila.
 * @returns `true` quando há pelo menos um sinal de risco.
 */
export function hasAlert(item: ModerationItemMock): boolean {
  return Boolean(item.duplicata || isIncomplete(item) || item.autorNovo);
}

/** Ficha abaixo do mínimo publicável — devolve, não rejeita. */
export function isIncomplete(item: ModerationItemMock): boolean {
  return !item.campos.descricao || item.fotos === 0;
}

function matchesFilters(
  item: ModerationItemMock,
  filters: QueueFilters,
): boolean {
  return (
    item.status === filters.status &&
    (filters.categoria === ALL_CATEGORIES ||
      item.categoria === filters.categoria) &&
    (!filters.soComAlerta || hasAlert(item))
  );
}

/**
 * Estado da fila de moderação. Tudo em memória: não há API, então decidir
 * apenas troca o `status` do item no array local.
 *
 * O `snapshot` guarda a lista anterior a cada decisão — é o que sustenta o
 * "Desfazer" do toast, e é por isso que ele é substituído (não empilhado) a
 * cada nova decisão: a janela de arrependimento é a última ação, só.
 */
export function useModerationQueue() {
  const [items, setItems] = useState(moderationQueueMock);
  const [snapshot, setSnapshot] = useState<ModerationItemMock[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>("zeca");
  const [markedIds, setMarkedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<QueueFilters>({
    status: "pendente",
    categoria: ALL_CATEGORIES,
    soComAlerta: false,
  });

  const visible = useMemo(
    () => items.filter((item) => matchesFilters(item, filters)),
    [items, filters],
  );

  const selected = visible.find((item) => item.id === selectedId) ?? null;

  const pendingCount = items.filter((i) => i.status === "pendente").length;
  const returnedCount = items.filter((i) => i.status === "devolvido").length;

  const updateFilters = useCallback(
    (patch: Partial<QueueFilters>) => {
      const next = { ...filters, ...patch };

      // A seleção acompanha o filtro: manter o item anterior deixaria o painel
      // mostrando algo que acabou de sumir da lista.
      const stillVisible = items.filter((item) => matchesFilters(item, next));

      setFilters(next);
      setSelectedId(stillVisible[0]?.id ?? null);
    },
    [filters, items],
  );

  const moveSelection = useCallback(
    (delta: number) => {
      const index = visible.findIndex((item) => item.id === selectedId);
      if (index < 0) return;

      const next =
        visible[Math.min(Math.max(index + delta, 0), visible.length - 1)];
      if (next) setSelectedId(next.id);
    },
    [visible, selectedId],
  );

  const toggleMark = useCallback((id: string) => {
    setMarkedIds((current) =>
      current.includes(id)
        ? current.filter((markedId) => markedId !== id)
        : [...current, id],
    );
  }, []);

  const clearMarks = useCallback(() => setMarkedIds([]), []);

  /**
   * Decide o item selecionado e avança para o próximo da fila — sem isso o
   * admin volta ao mouse a cada item, e os atalhos deixam de valer a pena.
   */
  const decide = useCallback(
    (status: ModerationStatus): ModerationItemMock | null => {
      if (!selected) return null;

      const index = visible.findIndex((item) => item.id === selected.id);
      const remaining = visible.filter((item) => item.id !== selected.id);
      const next = remaining[Math.min(index, remaining.length - 1)];

      setSnapshot(items);
      setItems((current) =>
        current.map((item) =>
          item.id === selected.id ? { ...item, status } : item,
        ),
      );
      setSelectedId(next?.id ?? null);

      return selected;
    },
    [items, visible, selected],
  );

  const decideMarked = useCallback(
    (status: ModerationStatus): number => {
      const count = markedIds.length;
      if (!count) return 0;

      setSnapshot(items);
      setItems((current) =>
        current.map((item) =>
          markedIds.includes(item.id) ? { ...item, status } : item,
        ),
      );
      setMarkedIds([]);

      return count;
    },
    [items, markedIds],
  );

  const undo = useCallback(() => {
    if (!snapshot) return;
    setItems(snapshot);
    setSnapshot(null);
  }, [snapshot]);

  return {
    visible,
    selected,
    selectedId,
    setSelectedId,
    markedIds,
    toggleMark,
    clearMarks,
    filters,
    updateFilters,
    moveSelection,
    decide,
    decideMarked,
    undo,
    pendingCount,
    returnedCount,
  };
}
