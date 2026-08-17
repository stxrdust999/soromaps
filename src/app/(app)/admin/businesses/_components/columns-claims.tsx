"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  AtSignIcon,
  BadgeCheckIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
  ImageIcon,
  ImageOffIcon,
  PanelRightOpenIcon,
  XCircleIcon,
} from "lucide-react";

import { ColumnSortFilter } from "@/components/table/column-sort-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COMMERCIAL_CATEGORIES } from "@/constants/categories";
import {
  type BusinessClaimMock,
  CLAIM_EVIDENCE_LABEL,
  type ClaimEvidence,
  claimantsMock,
} from "@/mocks/admin-businesses";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";
import { textSortingFn } from "@/utils/sorts/sort-by-text";

import { RiskSignalBadges } from "./risk-signal-badges";
import { getClaimSignals } from "./use-business-claims";

/** Acima disso a idade deixa de ser informação e vira alerta. */
const OVERDUE_DAYS = 7;

const EVIDENCE_ICON: Record<ClaimEvidence, typeof FileTextIcon> = {
  cnpj: FileTextIcon,
  fachada: ImageIcon,
  email: AtSignIcon,
};

export const claimColumnsNames = {
  claimant: "Solicitante",
  ponto: "Ponto reivindicado",
  cnpj: "CNPJ",
  evidencias: "Evidência",
  diasNaFila: "Aguardando",
  sinais: "Sinais",
  actions: "Ações",
};

export interface ClaimRowActions {
  onOpen: (claim: BusinessClaimMock) => void;
  onApprove: (claim: BusinessClaimMock) => void;
  onReject: (claim: BusinessClaimMock) => void;
  onCompare: (claim: BusinessClaimMock) => void;
}

interface CreateClaimColumnsOptions extends ClaimRowActions {
  claims: BusinessClaimMock[];
}

/**
 * Colunas da fila de pedidos. A ordem das colunas segue a leitura do admin:
 * quem pede, o que pede, com que prova, há quanto tempo e o que cheira mal.
 *
 * @param options Fila completa (o alerta de conflito precisa dela) e ações.
 */
export function createClaimColumns({
  claims,
  onOpen,
  onApprove,
  onReject,
  onCompare,
}: CreateClaimColumnsOptions): ColumnDef<BusinessClaimMock>[] {
  return [
    /* select - column */
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas as linhas"
        />
      ),

      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),

      enableSorting: false,
      enableHiding: false,

      meta: {
        headerClassName: "w-12 pr-0",
        cellClassName: "w-12 pr-0",
      },
    },

    /* claimant - column */
    {
      id: "claimant",
      accessorFn: (claim) => claimantsMock[claim.claimantId].nome,

      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={claimColumnsNames.claimant}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => {
        const claimant = claimantsMock[row.original.claimantId];

        return (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>{claimant.iniciais}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">{claimant.nome}</p>
              <p className="text-muted-foreground truncate text-xs">
                {claimant.email}
              </p>
            </div>
          </div>
        );
      },

      /** Busca por nome **ou** e-mail: o domínio do e-mail é meia evidência. */
      filterFn: (row, _columnId, value) => {
        const term = String(value).trim().toLowerCase();
        if (!term) return true;

        const claimant = claimantsMock[row.original.claimantId];
        return `${claimant.nome} ${claimant.email}`
          .toLowerCase()
          .includes(term);
      },

      sortingFn: textSortingFn(
        (claim: BusinessClaimMock) => claimantsMock[claim.claimantId].nome,
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
          title={claimColumnsNames.ponto}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => {
        const claim = row.original;
        const commercial = COMMERCIAL_CATEGORIES.includes(claim.categoria);

        return (
          <div className="flex items-center gap-3">
            {claim.temFoto ? (
              <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                <ImageIcon size={14} />
              </div>
            ) : (
              <div className="text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed">
                <ImageOffIcon size={13} />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate font-medium">{claim.ponto}</p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">
                  {claim.bairro}
                </span>
                <Badge variant={commercial ? "secondary" : "warning"}>
                  {claim.categoria}
                </Badge>
              </div>
            </div>
          </div>
        );
      },

      sortingFn: textSortingFn((claim: BusinessClaimMock) => claim.ponto),

      enableHiding: false,

      meta: {
        headerClassName: "min-w-60",
        cellClassName: "min-w-60",
      },
    },

    /* cnpj - column */
    {
      accessorKey: "cnpj",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={claimColumnsNames.cnpj}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => {
        const { cnpj, razaoSocial } = row.original;

        if (!cnpj) {
          return (
            <span className="text-muted-foreground/80">não informado</span>
          );
        }

        return (
          <div>
            <p className="font-mono text-xs">{cnpj}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {razaoSocial}
            </p>
          </div>
        );
      },

      meta: {
        visibilityDisplayName: claimColumnsNames.cnpj,
        headerClassName: "w-56",
        cellClassName: "w-56",
      },
    },

    /* evidencias - column */
    {
      id: "evidencias",
      accessorFn: (claim) => claim.evidencias.length,

      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={claimColumnsNames.evidencias}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => {
        const { evidencias } = row.original;

        if (!evidencias.length) {
          return (
            <span className="text-muted-foreground/80">sem evidência</span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {evidencias.map((evidence) => {
              const Icon = EVIDENCE_ICON[evidence];

              return (
                <Badge key={evidence} variant="secondary">
                  <Icon size={12} />
                  <span className="text-xs font-light">
                    {CLAIM_EVIDENCE_LABEL[evidence]}
                  </span>
                </Badge>
              );
            })}
          </div>
        );
      },

      /** `nenhuma` é o recorte que importa: pedido sem prova nenhuma. */
      filterFn: (row, _columnId, value) => {
        const { evidencias } = row.original;

        if (value === "nenhuma") return evidencias.length === 0;
        return evidencias.includes(value as ClaimEvidence);
      },

      meta: {
        visibilityDisplayName: claimColumnsNames.evidencias,
        headerClassName: "w-52",
        cellClassName: "w-52",
      },
    },

    /* diasNaFila - column */
    {
      accessorKey: "diasNaFila",
      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={claimColumnsNames.diasNaFila}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => {
        const { diasNaFila } = row.original;
        const age = formatWaitingDays(diasNaFila);

        return diasNaFila > OVERDUE_DAYS ? (
          <Badge variant="warning">
            <ClockIcon size={12} />
            <span className="text-xs font-light">{age}</span>
          </Badge>
        ) : (
          <span className="text-muted-foreground">{age}</span>
        );
      },

      filterFn: (row, _columnId, value) =>
        value === "atrasado"
          ? row.original.diasNaFila > OVERDUE_DAYS
          : row.original.diasNaFila <= OVERDUE_DAYS,

      meta: {
        visibilityDisplayName: claimColumnsNames.diasNaFila,
        headerClassName: "w-36",
        cellClassName: "w-36",
      },
    },

    /* sinais - column */
    {
      id: "sinais",
      accessorFn: (claim) => getClaimSignals(claim, claims).length,

      header: ({ column }) => (
        <ColumnSortFilter
          column={column}
          title={claimColumnsNames.sinais}
          className="w-full justify-between text-foreground"
        />
      ),

      cell: ({ row }) => (
        <RiskSignalBadges
          signals={getClaimSignals(row.original, claims)}
          onConflictClick={() => onCompare(row.original)}
        />
      ),

      filterFn: (row, _columnId, value) => {
        const signals = getClaimSignals(row.original, claims);

        if (value === "nenhum") return signals.length === 0;
        return signals.some((signal) => signal.kind === value);
      },

      meta: {
        visibilityDisplayName: claimColumnsNames.sinais,
        headerClassName: "w-56",
        cellClassName: "w-56",
      },
    },

    /* actions - column */
    {
      id: "actions",
      header: () => claimColumnsNames.actions,

      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={() => onOpen(row.original)}
          >
            <PanelRightOpenIcon className="size-4" />
            <span className="sr-only">Ver detalhes</span>
          </Button>

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
              <DropdownMenuItem onSelect={() => onOpen(row.original)}>
                <PanelRightOpenIcon className="size-4" />
                Ver detalhes
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => onApprove(row.original)}>
                <BadgeCheckIcon className="size-4" />
                Aprovar vínculo
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onReject(row.original)}
              >
                <XCircleIcon className="size-4" />
                Recusar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),

      enableSorting: false,
      enableHiding: false,

      meta: {
        headerClassName: "w-24",
        cellClassName: "w-24 pr-4 pl-2",
      },
    },
  ];
}
