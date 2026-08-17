"use client";

import {
  ClockIcon,
  MapPinIcon,
  OctagonAlertIcon,
  PaperclipIcon,
  StoreIcon,
  TagsIcon,
  TriangleAlertIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import {
  SelectFilterChip,
  type SelectFilterChipOption,
  TextFilterChip,
} from "@/components/table/filter-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type BusinessClaimMock,
  businessesSummaryMock,
  type UnclaimedPlaceMock,
  unclaimedPlacesMock,
  type VerifiedBusinessMock,
} from "@/mocks/admin-businesses";

import { BusinessTable } from "./business-table";
import { ClaimDetailSheet } from "./claim-detail-sheet";
import { createClaimColumns } from "./columns-claims";
import { createUnclaimedColumns } from "./columns-unclaimed";
import { createVerifiedColumns } from "./columns-verified";
import { ConflictDialog } from "./conflict-dialog";
import { DecisionDialog, type DecisionMode } from "./decision-dialog";
import { InviteDialog } from "./invite-dialog";
import { useBusinessClaims } from "./use-business-claims";

type WorkspaceTab = "pendentes" | "verificados" | "semdono";

const TABS: { value: WorkspaceTab; label: string }[] = [
  { value: "pendentes", label: "Pedidos pendentes" },
  { value: "verificados", label: "Comércios verificados" },
  { value: "semdono", label: "Pontos sem dono" },
];

const EVIDENCE_OPTIONS: SelectFilterChipOption[] = [
  { value: "cnpj", label: "Com CNPJ" },
  { value: "fachada", label: "Com foto da fachada" },
  { value: "email", label: "Com e-mail do domínio" },
  { value: "nenhuma", label: "Sem evidência" },
];

const SIGNAL_OPTIONS: SelectFilterChipOption[] = [
  { value: "conflito", label: "Conflito" },
  { value: "distancia", label: "CNPJ distante" },
  { value: "dono", label: "Ponto já tem dono" },
  { value: "naoComercial", label: "Categoria não comercial" },
  { value: "novo", label: "Solicitante novo" },
  { value: "nenhum", label: "Sem sinal" },
];

const WAITING_OPTIONS: SelectFilterChipOption[] = [
  { value: "atrasado", label: "Mais de 7 dias" },
  { value: "recente", label: "Até 7 dias" },
];

interface OpenDecision {
  mode: DecisionMode;
  subject: string;
  /** Pedido a recusar, ou vínculo a revogar. */
  claimId?: string;
  businessId?: string;
}

/**
 * Tela de comércios inteira. É client porque não existe vínculo dono↔ponto no
 * schema: aprovar, recusar e revogar mexem só nos arrays de
 * `src/mocks/admin-businesses.ts`.
 *
 * Quando `markers` tiver FK de dono e existir entidade de reivindicação, as
 * listagens voltam a ser Server Components e as decisões viram Server Actions.
 */
export function BusinessesWorkspace() {
  const {
    claims,
    verified,
    stats,
    resolve,
    resolveConflict,
    revoke,
    findCompetitor,
  } = useBusinessClaims();

  const [tab, setTab] = useState<WorkspaceTab>("pendentes");
  const [openClaim, setOpenClaim] = useState<BusinessClaimMock | null>(null);
  const [conflictClaim, setConflictClaim] = useState<BusinessClaimMock | null>(
    null,
  );
  const [decision, setDecision] = useState<OpenDecision | null>(null);
  const [invite, setInvite] = useState<UnclaimedPlaceMock | null>(null);

  const approve = useCallback(
    (claim: BusinessClaimMock) => {
      resolve(claim.id);
      setOpenClaim(null);

      toast.success(`Vínculo aprovado: ${claim.ponto}`, {
        description: "O solicitante já pode responder avaliações do lugar.",
      });
    },
    [resolve],
  );

  const askEvidence = useCallback(
    (claim: BusinessClaimMock) => {
      resolve(claim.id);
      setOpenClaim(null);

      toast.success(`Pedido devolvido: ${claim.ponto}`, {
        description: "O solicitante foi avisado do que falta anexar.",
      });
    },
    [resolve],
  );

  const claimActions = useMemo(
    () => ({
      onOpen: setOpenClaim,
      onApprove: approve,
      onReject: (claim: BusinessClaimMock) =>
        setDecision({
          mode: "recusa",
          subject: claim.ponto,
          claimId: claim.id,
        }),
      onCompare: setConflictClaim,
    }),
    [approve],
  );

  const claimColumns = useMemo(
    () => createClaimColumns({ claims, ...claimActions }),
    [claims, claimActions],
  );

  const verifiedColumns = useMemo(
    () =>
      createVerifiedColumns({
        onRevoke: (business: VerifiedBusinessMock) =>
          setDecision({
            mode: "revogacao",
            subject: business.ponto,
            businessId: business.id,
          }),
      }),
    [],
  );

  const unclaimedColumns = useMemo(
    () =>
      createUnclaimedColumns({
        places: unclaimedPlacesMock,
        onInvite: setInvite,
      }),
    [],
  );

  function confirmDecision() {
    if (!decision) return;

    if (decision.mode === "recusa" && decision.claimId) {
      resolve(decision.claimId);
      setOpenClaim(null);
      toast.success(`Pedido recusado: ${decision.subject}`);
    }

    if (decision.mode === "revogacao" && decision.businessId) {
      revoke(decision.businessId);
      toast.success(`Vínculo revogado: ${decision.subject}`, {
        description: "O ponto voltou a ficar sem dono.",
      });
    }

    setDecision(null);
  }

  const competitor = conflictClaim ? findCompetitor(conflictClaim) : null;

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Comércios"
        description="Reivindicações de posse de estabelecimentos no mapa"
        className="gap-6"
        subitems={
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{stats.pendentes} pedidos pendentes</Badge>
            <Badge>{stats.verificados} comércios verificados</Badge>

            {stats.conflitos > 0 && (
              <Badge variant="destructive">
                <OctagonAlertIcon size={12} />
                <span className="text-xs font-light">
                  {stats.conflitos} com conflito
                </span>
              </Badge>
            )}

            <Badge>{unclaimedPlacesMock.length} pontos sem dono</Badge>
          </div>
        }
        actions={
          <div className="bg-muted flex items-center gap-0.5 rounded-lg p-0.5">
            {TABS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant="ghost"
                onClick={() => setTab(option.value)}
                className={cn(
                  "text-muted-foreground",
                  tab === option.value &&
                    "bg-background text-foreground shadow-xs hover:bg-background",
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        }
      >
        {tab === "pendentes" && (
          <BusinessTable
            data={claims}
            columns={claimColumns}
            defaultSorting={[{ id: "diasNaFila", desc: true }]}
            emptyMessage="Nenhum pedido pendente. Nada aguardando decisão de vínculo agora."
            footerNote={`Comércios verificados neste mês: ${businessesSummaryMock.verificadosNoMes}`}
            chips={(table) => (
              <>
                <TextFilterChip
                  table={table}
                  column={
                    table.getColumn("claimant") ?? table.getAllColumns()[0]
                  }
                  icon={<UserIcon className="size-4" />}
                  label="Solicitante"
                  placeholder="Nome ou e-mail..."
                />

                <TextFilterChip
                  table={table}
                  column={table.getColumn("ponto") ?? table.getAllColumns()[0]}
                  icon={<MapPinIcon className="size-4" />}
                  label="Ponto"
                  placeholder="Nome do ponto..."
                />

                <SelectFilterChip
                  table={table}
                  column={
                    table.getColumn("evidencias") ?? table.getAllColumns()[0]
                  }
                  icon={<PaperclipIcon className="size-4" />}
                  label="Evidência"
                  options={EVIDENCE_OPTIONS}
                  menuLabel="Anexado"
                />

                <SelectFilterChip
                  table={table}
                  column={table.getColumn("sinais") ?? table.getAllColumns()[0]}
                  icon={<TriangleAlertIcon className="size-4" />}
                  label="Sinal de risco"
                  options={SIGNAL_OPTIONS}
                  menuLabel="Sinal"
                />

                <SelectFilterChip
                  table={table}
                  column={
                    table.getColumn("diasNaFila") ?? table.getAllColumns()[0]
                  }
                  icon={<ClockIcon className="size-4" />}
                  label="Aguardando"
                  options={WAITING_OPTIONS}
                  menuLabel="Tempo na fila"
                />
              </>
            )}
          />
        )}

        {tab === "verificados" && (
          <BusinessTable
            data={verified}
            columns={verifiedColumns}
            defaultSorting={[{ id: "verificadoEm", desc: true }]}
            emptyMessage="Nenhum comércio verificado com esses filtros."
            hiddenSelectedRows
            chips={(table) => (
              <>
                <TextFilterChip
                  table={table}
                  column={table.getColumn("dono") ?? table.getAllColumns()[0]}
                  icon={<UserIcon className="size-4" />}
                  label="Dono"
                  placeholder="Nome ou e-mail..."
                />

                <TextFilterChip
                  table={table}
                  column={table.getColumn("ponto") ?? table.getAllColumns()[0]}
                  icon={<StoreIcon className="size-4" />}
                  label="Comércio"
                  placeholder="Nome do comércio..."
                />
              </>
            )}
          />
        )}

        {tab === "semdono" && (
          <BusinessTable
            data={unclaimedPlacesMock}
            columns={unclaimedColumns}
            defaultSorting={[{ id: "avaliacoes", desc: true }]}
            emptyMessage="Nenhum ponto sem dono com esses filtros."
            footerNote="Ordenado por número de avaliações — mais movimento, mais vale prospectar."
            hiddenSelectedRows
            chips={(table) => (
              <>
                <TextFilterChip
                  table={table}
                  column={table.getColumn("nome") ?? table.getAllColumns()[0]}
                  icon={<MapPinIcon className="size-4" />}
                  label="Ponto"
                  placeholder="Nome do ponto..."
                />

                <TextFilterChip
                  table={table}
                  column={table.getColumn("bairro") ?? table.getAllColumns()[0]}
                  icon={<TagsIcon className="size-4" />}
                  label="Bairro"
                  placeholder="Ex.: Centro"
                />
              </>
            )}
          />
        )}
      </PageSection>

      <SiteFooter />

      <ClaimDetailSheet
        claim={openClaim}
        claims={claims}
        onOpenChange={(open) => !open && setOpenClaim(null)}
        onApprove={() => openClaim && approve(openClaim)}
        onAskEvidence={() => openClaim && askEvidence(openClaim)}
        onReject={() =>
          openClaim &&
          setDecision({
            mode: "recusa",
            subject: openClaim.ponto,
            claimId: openClaim.id,
          })
        }
        onCompare={() => openClaim && setConflictClaim(openClaim)}
      />

      {conflictClaim && competitor && (
        <ConflictDialog
          claim={conflictClaim}
          competitor={competitor}
          onOpenChange={(open) => !open && setConflictClaim(null)}
          onResolve={(winner, loser) => {
            resolveConflict(winner.id, loser.id);
            setConflictClaim(null);
            setOpenClaim(null);

            toast.success(`Vínculo aprovado para ${winner.ponto}`, {
              description: "O pedido concorrente foi recusado como duplicata.",
            });
          }}
        />
      )}

      {decision && (
        <DecisionDialog
          mode={decision.mode}
          subject={decision.subject}
          onOpenChange={(open) => !open && setDecision(null)}
          onConfirm={confirmDecision}
        />
      )}

      {invite && (
        <InviteDialog
          place={invite}
          onOpenChange={(open) => !open && setInvite(null)}
          onCopy={() => {
            setInvite(null);
            toast.success("Link de reivindicação copiado");
          }}
        />
      )}
    </main>
  );
}
