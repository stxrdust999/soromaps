"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon, UserXIcon } from "lucide-react";

import { ColumnSortFilter } from "@/components/table/column-sort-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VerifiedBusinessMock } from "@/mocks/admin-businesses";
import { textSortingFn } from "@/utils/sorts/sort-by-text";

export const verifiedColumnsNames = {
  dono: "Dono verificado",
  ponto: "Comércio",
  cnpj: "CNPJ",
  verificadoEm: "Verificado em",
  verificadoPor: "Verificado por",
  ativo: "Estado",
  actions: "Ações",
};

interface CreateVerifiedColumnsOptions {
  onRevoke: (business: VerifiedBusinessMock) => void;
}

/**
 * Colunas dos vínculos já concedidos. Aqui não se aprova nada — a única ação
 * é revogar, e `verificadoPor` existe para a decisão ter dono.
 */
export function createVerifiedColumns({
  onRevoke,
}: CreateVerifiedColumnsOptions): ColumnDef<VerifiedBusinessMock>[] {
  return [
    /* dono - column */
    {
      accessorKey: "dono",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={verifiedColumnsNames.dono}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{row.original.iniciais}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.dono}</p>
            <p className="text-muted-foreground truncate text-xs">
              {row.original.email}
            </p>
          </div>
        </div>
      ),

      filterFn: (row, _columnId, value) => {
        const term = String(value).trim().toLowerCase();
        if (!term) return true;

        return `${row.original.dono} ${row.original.email}`
          .toLowerCase()
          .includes(term);
      },

      sortingFn: textSortingFn(
        (business: VerifiedBusinessMock) => business.dono,
      ),

      enableHiding: false,

      meta: {
        headerClassName: "min-w-60",
        cellClassName: "min-w-60",
      },
    },

    /* ponto - column */
    {
      accessorKey: "ponto",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={verifiedColumnsNames.ponto}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.ponto}</p>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">
              {row.original.bairro}
            </span>
            <Badge variant="secondary">{row.original.categoria}</Badge>
          </div>
        </div>
      ),

      sortingFn: textSortingFn(
        (business: VerifiedBusinessMock) => business.ponto,
      ),

      enableHiding: false,

      meta: {
        headerClassName: "min-w-56",
        cellClassName: "min-w-56",
      },
    },

    /* cnpj - column */
    {
      accessorKey: "cnpj",
      header: () => verifiedColumnsNames.cnpj,

      enableSorting: false,

      meta: {
        visibilityDisplayName: verifiedColumnsNames.cnpj,
        headerClassName: "w-48",
        cellClassName: "w-48 font-mono text-xs text-muted-foreground",
      },
    },

    /* verificadoEm - column */
    {
      accessorKey: "verificadoEm",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={verifiedColumnsNames.verificadoEm}
          className="w-full justify-between text-foreground"
        />
      ),

      meta: {
        visibilityDisplayName: verifiedColumnsNames.verificadoEm,
        headerClassName: "w-36",
        cellClassName: "w-36 tabular-nums text-muted-foreground",
      },
    },

    /* verificadoPor - column */
    {
      accessorKey: "verificadoPor",
      header: () => verifiedColumnsNames.verificadoPor,

      enableSorting: false,

      meta: {
        visibilityDisplayName: verifiedColumnsNames.verificadoPor,
        headerClassName: "w-40",
        cellClassName: "w-40 text-muted-foreground",
      },
    },

    /* ativo - column */
    {
      accessorKey: "ativo",
      header: () => verifiedColumnsNames.ativo,

      cell: ({ row }) => (
        <Badge variant={row.original.ativo ? "success" : "warning"}>
          {row.original.ativo ? "Ativo" : "Suspenso"}
        </Badge>
      ),

      enableSorting: false,

      meta: {
        visibilityDisplayName: verifiedColumnsNames.ativo,
        headerClassName: "w-28",
        cellClassName: "w-28",
      },
    },

    /* actions - column */
    {
      id: "actions",
      header: () => verifiedColumnsNames.actions,

      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
            >
              <EllipsisVerticalIcon className="size-4" />
              <span className="sr-only">Abrir ações</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onRevoke(row.original)}
            >
              <UserXIcon className="size-4" />
              Revogar vínculo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),

      enableSorting: false,
      enableHiding: false,

      meta: {
        headerClassName: "w-20",
        cellClassName: "w-20 pr-4 pl-2",
      },
    },
  ];
}
