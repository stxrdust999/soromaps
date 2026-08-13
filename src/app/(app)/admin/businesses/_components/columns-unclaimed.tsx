"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ImageIcon, SendIcon, StarIcon } from "lucide-react";

import { ColumnSortFilter } from "@/components/table/column-sort-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnclaimedPlaceMock } from "@/mocks/admin-businesses";
import { textSortingFn } from "@/utils/sorts/sort-by-text";

export const unclaimedColumnsNames = {
  nome: "Ponto",
  bairro: "Bairro",
  categoria: "Categoria",
  avaliacoes: "Avaliações",
  nota: "Nota",
  visitasNoMes: "Visitas no mês",
  actions: "Ações",
};

interface CreateUnclaimedColumnsOptions {
  places: UnclaimedPlaceMock[];
  onInvite: (place: UnclaimedPlaceMock) => void;
}

/**
 * Colunas dos pontos comerciais sem dono. Não é fila de decisão: é lista de
 * prospecção, e por isso a barra proporcional fica em "Avaliações" — é o
 * número que diz onde vale gastar o convite.
 */
export function createUnclaimedColumns({
  places,
  onInvite,
}: CreateUnclaimedColumnsOptions): ColumnDef<UnclaimedPlaceMock>[] {
  const maxAvaliacoes = Math.max(...places.map((place) => place.avaliacoes), 1);

  return [
    /* nome - column */
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={unclaimedColumnsNames.nome}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
            <ImageIcon size={14} />
          </div>

          <span className="truncate font-medium">{row.original.nome}</span>
        </div>
      ),

      sortingFn: textSortingFn((place: UnclaimedPlaceMock) => place.nome),

      enableHiding: false,

      meta: {
        headerClassName: "min-w-64",
        cellClassName: "min-w-64",
      },
    },

    /* bairro - column */
    {
      accessorKey: "bairro",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={unclaimedColumnsNames.bairro}
          className="w-full justify-between text-foreground"
        />
      ),

      sortingFn: textSortingFn((place: UnclaimedPlaceMock) => place.bairro),

      meta: {
        visibilityDisplayName: unclaimedColumnsNames.bairro,
        headerClassName: "w-48",
        cellClassName: "w-48 text-muted-foreground",
      },
    },

    /* categoria - column */
    {
      accessorKey: "categoria",
      header: () => unclaimedColumnsNames.categoria,

      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.categoria}</Badge>
      ),

      enableSorting: false,

      meta: {
        visibilityDisplayName: unclaimedColumnsNames.categoria,
        headerClassName: "w-40",
        cellClassName: "w-40",
      },
    },

    /* avaliacoes - column */
    {
      accessorKey: "avaliacoes",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={unclaimedColumnsNames.avaliacoes}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5">
          <span className="font-medium tabular-nums">
            {row.original.avaliacoes}
          </span>

          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${(row.original.avaliacoes / maxAvaliacoes) * 100}%`,
              }}
            />
          </div>
        </div>
      ),

      meta: {
        visibilityDisplayName: unclaimedColumnsNames.avaliacoes,
        headerClassName: "w-36",
        cellClassName: "w-36",
      },
    },

    /* nota - column */
    {
      accessorKey: "nota",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={unclaimedColumnsNames.nota}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 tabular-nums">
          <StarIcon size={13} className="fill-current" />
          {row.original.nota.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
          })}
        </span>
      ),

      meta: {
        visibilityDisplayName: unclaimedColumnsNames.nota,
        headerClassName: "w-28",
        cellClassName: "w-28",
      },
    },

    /* visitasNoMes - column */
    {
      accessorKey: "visitasNoMes",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={unclaimedColumnsNames.visitasNoMes}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => row.original.visitasNoMes.toLocaleString("pt-BR"),

      meta: {
        visibilityDisplayName: unclaimedColumnsNames.visitasNoMes,
        headerClassName: "w-36",
        cellClassName: "w-36 tabular-nums text-muted-foreground",
      },
    },

    /* actions - column */
    {
      id: "actions",
      header: () => unclaimedColumnsNames.actions,

      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInvite(row.original)}
        >
          <SendIcon />
          Convidar dono
        </Button>
      ),

      enableSorting: false,
      enableHiding: false,

      meta: {
        headerClassName: "w-40",
        cellClassName: "w-40 pr-4 pl-2",
      },
    },
  ];
}
