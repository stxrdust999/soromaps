"use client";

import {
  AtSignIcon,
  BadgeCheckIcon,
  CornerUpLeftIcon,
  FileTextIcon,
  FileXIcon,
  ImageIcon,
  OctagonAlertIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { COMMERCIAL_CATEGORIES } from "@/constants/categories";
import { cn } from "@/lib/utils";
import {
  type BusinessClaimMock,
  CLAIM_EVIDENCE_LABEL,
  type ClaimEvidence,
  claimantsMock,
} from "@/mocks/admin-businesses";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

import { ClaimMapPreview } from "./claim-map-preview";
import { RiskSignalBadges } from "./risk-signal-badges";
import { getClaimSignals } from "./use-business-claims";

const EVIDENCE_ICON: Record<ClaimEvidence, typeof FileTextIcon> = {
  cnpj: FileTextIcon,
  fachada: ImageIcon,
  email: AtSignIcon,
};

const EVIDENCE_EXTENSION: Record<ClaimEvidence, string> = {
  cnpj: "pdf",
  fachada: "jpg",
  email: "eml",
};

interface ClaimDetailSheetProps {
  claim: BusinessClaimMock | null;
  claims: BusinessClaimMock[];
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onAskEvidence: () => void;
  onReject: () => void;
  onCompare: () => void;
}

/**
 * Painel de decisão de um pedido.
 *
 * Painel lateral e não página: a listagem é o trabalho principal aqui — ao
 * contrário da moderação, onde a fila *é* a tela — e o admin precisa despachar
 * vários pedidos sem perder a posição na tabela.
 */
export function ClaimDetailSheet({
  claim,
  claims,
  onOpenChange,
  onApprove,
  onAskEvidence,
  onReject,
  onCompare,
}: ClaimDetailSheetProps) {
  if (!claim) return null;

  const claimant = claimantsMock[claim.claimantId];
  const signals = getClaimSignals(claim, claims);

  const distant = claim.distanciaCnpjKm !== null && claim.distanciaCnpjKm > 1;
  const commercial = COMMERCIAL_CATEGORIES.includes(claim.categoria);

  const rows = [
    {
      label: "Razão social declarada",
      declared: claim.razaoSocial ?? "não informado",
      mapLabel: "Nome no mapa",
      mapped: claim.ponto,
      diverges: false,
      mono: false,
    },
    {
      label: "CNPJ",
      declared: claim.cnpj ?? "não informado",
      mapLabel: "Categoria no mapa",
      mapped: commercial
        ? claim.categoria
        : `${claim.categoria} · não comercial`,
      diverges: !commercial,
      mono: false,
    },
    {
      label: "Endereço do CNPJ",
      declared: claim.enderecoCnpj ?? "não informado",
      mapLabel: "Bairro do ponto",
      mapped: `${claim.bairro} · Sorocaba`,
      diverges: distant,
      mono: false,
    },
    {
      label: "Telefone declarado",
      declared: claim.telefone ?? "não informado",
      mapLabel: "Coordenadas do pin",
      mapped: claim.coordenadas,
      diverges: false,
      mono: true,
    },
  ];

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-190">
        <SheetHeader className="border-b p-6">
          <SheetDescription>
            Pedido de posse · aguardando {formatWaitingDays(claim.diasNaFila)}
          </SheetDescription>

          <SheetTitle className="text-2xl tracking-tight">
            {claim.ponto}
          </SheetTitle>

          {signals.length > 0 && (
            <div className="mt-2">
              <RiskSignalBadges signals={signals} onConflictClick={onCompare} />
            </div>
          )}
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-auto p-6">
          {claim.conflitoCom && (
            <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-3.5 rounded-lg border p-3">
              <OctagonAlertIcon size={16} className="shrink-0" />

              <p className="text-sm">
                Outra pessoa também reivindicou este ponto. Decidir um pedido
                sem olhar o outro é como a fraude passa.
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={onCompare}
                className="ml-auto shrink-0"
              >
                Comparar pedidos
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-5">
              <span className="text-muted-foreground text-sm">
                Declarado pelo solicitante
              </span>
              <span className="text-muted-foreground text-sm">
                O que o ponto tem no mapa
              </span>
            </div>

            <div className="divide-y overflow-hidden rounded-lg border">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-2 divide-x",
                    row.diverges && "bg-warning/10 text-warning",
                  )}
                >
                  <div className="px-3.5 py-2.5">
                    <p
                      className={cn(
                        "text-[11.5px]",
                        row.diverges
                          ? "text-warning/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.label}
                    </p>
                    <p className={cn("text-sm", row.mono && "font-mono")}>
                      {row.declared}
                    </p>
                  </div>

                  <div className="px-3.5 py-2.5">
                    <p
                      className={cn(
                        "text-[11.5px]",
                        row.diverges
                          ? "text-warning/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.mapLabel}
                    </p>
                    <p className={cn("text-sm", row.mono && "font-mono")}>
                      {row.mapped}
                    </p>
                  </div>
                </div>
              ))}

              <p className="text-muted-foreground px-3.5 py-2.5 text-xs">
                Linha destacada = o que declararam não corresponde ao que está
                no mapa.
              </p>
            </div>
          </div>

          <ClaimMapPreview
            ponto={claim.ponto}
            coordenadas={claim.coordenadas}
            cidadeCnpj={claim.cidadeCnpj}
            distanciaKm={claim.distanciaCnpjKm}
          />

          <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
            <div className="flex flex-col gap-2.5">
              <span className="text-muted-foreground text-sm">
                Evidências anexadas
              </span>

              {claim.evidencias.length ? (
                <div className="flex flex-wrap gap-3">
                  {claim.evidencias.map((evidence) => {
                    const Icon = EVIDENCE_ICON[evidence];

                    return (
                      <div key={evidence} className="flex flex-col gap-2">
                        <div className="bg-muted text-muted-foreground flex h-23 w-33 items-center justify-center rounded-lg">
                          <Icon size={18} />
                        </div>

                        <div>
                          <p className="text-xs font-medium">
                            {CLAIM_EVIDENCE_LABEL[evidence]}
                          </p>
                          <p className="text-muted-foreground font-mono text-[10.5px]">
                            {evidence}-{claim.id}.{EVIDENCE_EXTENSION[evidence]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground flex h-23 items-center justify-center gap-2 rounded-lg border border-dashed text-sm">
                  <FileXIcon size={16} />
                  Nenhuma evidência anexada
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3.5 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>{claimant.iniciais}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{claimant.nome}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {claimant.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-1 text-xs">
                  Pedidos anteriores
                </p>
                <Badge
                  variant={claimant.recusados > 0 ? "warning" : "secondary"}
                >
                  {claimant.aprovados} aprovado(s), {claimant.recusados}{" "}
                  recusado(s)
                </Badge>
              </div>

              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Membro desde</dt>
                  <dd>{claimant.membroDesde}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Avaliações escritas</dt>
                  <dd className="tabular-nums">
                    {claimant.avaliacoesEscritas}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pontos criados</dt>
                  <dd className="tabular-nums">{claimant.pontosCriados}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t p-4 px-6">
          <Button onClick={onApprove}>
            <BadgeCheckIcon />
            Aprovar vínculo
          </Button>

          <Button variant="outline" onClick={onAskEvidence}>
            <CornerUpLeftIcon />
            Pedir mais evidência
          </Button>

          <Button variant="ghost" onClick={onReject}>
            Recusar
          </Button>

          <p className="text-muted-foreground ml-auto max-w-72 text-xs">
            Aprovar dá a esta pessoa o direito de responder avaliações em nome
            do lugar.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
