"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  type ModerationStatus,
  moderationAuthorsMock,
  moderationSummaryMock,
} from "@/mocks/admin-moderation";

import { DuplicateDialog } from "./duplicate-dialog";
import { HistoryTable } from "./history-table";
import { ModerationStats } from "./moderation-stats";
import { PointReview } from "./point-review";
import { QueuePanel } from "./queue-panel";
import { RejectDialog } from "./reject-dialog";
import { useModerationQueue } from "./use-moderation-queue";

type WorkspaceTab = "fila" | "historico";
type OpenDialog = "rejeicao" | "duplicata" | null;

const TABS: { value: WorkspaceTab; label: string }[] = [
  { value: "fila", label: "Fila" },
  { value: "historico", label: "Histórico" },
];

/**
 * Toda a tela de moderação. É client porque o trabalho é interação pura —
 * seleção, filtro, atalho de teclado — e porque não existe API para decidir:
 * aprovar/devolver/rejeitar só mexem no array local de
 * `src/mocks/admin-moderation.ts`.
 *
 * Quando `markers` ganhar `status`, o estado vira Server Actions e este
 * componente encolhe para o que de fato é local: seleção e filtros.
 */
export function ModerationWorkspace() {
  const queue = useModerationQueue();
  const [tab, setTab] = useState<WorkspaceTab>("fila");
  const [dialog, setDialog] = useState<OpenDialog>(null);

  const { decide, decideMarked, undo, selected } = queue;

  const announce = useCallback(
    (message: string) => {
      toast.success(message, {
        action: { label: "Desfazer", onClick: undo },
      });
    },
    [undo],
  );

  const runDecision = useCallback(
    (status: ModerationStatus, verb: string) => {
      const item = decide(status);
      if (item) announce(`${verb}: ${item.nome}`);
    },
    [decide, announce],
  );

  const runBulkDecision = useCallback(
    (status: ModerationStatus, verb: string) => {
      const count = decideMarked(status);
      if (count)
        announce(`${count} ${count === 1 ? "ponto" : "pontos"} ${verb}`);
    },
    [decideMarked, announce],
  );

  // Fila é trabalho repetitivo: sem teclado o admin volta ao mouse a cada item.
  useEffect(() => {
    if (tab !== "fila" || dialog) return;

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key.toLowerCase()) {
        case "a":
          event.preventDefault();
          runDecision("aprovado", "Ponto aprovado");
          break;
        case "d":
          event.preventDefault();
          runDecision("devolvido", "Devolvido ao autor");
          break;
        case "r":
          event.preventDefault();
          if (selected) setDialog("rejeicao");
          break;
        case "j":
          event.preventDefault();
          queue.moveSelection(1);
          break;
        case "k":
          event.preventDefault();
          queue.moveSelection(-1);
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, dialog, selected, runDecision, queue.moveSelection]);

  return (
    <>
      <PageSection
        title="Moderação"
        description="Fila de aprovação de pontos enviados pela comunidade"
        className="flex-none px-8 py-7"
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
        subitems={
          <ModerationStats
            pendingCount={queue.pendingCount}
            returnedCount={queue.returnedCount}
          />
        }
      />

      {tab === "fila" ? (
        <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1 border-t">
          <ResizablePanel defaultSize="26%" minSize="300px" maxSize="40%">
            <QueuePanel
              items={queue.visible}
              selectedId={queue.selectedId}
              markedIds={queue.markedIds}
              filters={queue.filters}
              onSelect={queue.setSelectedId}
              onToggleMark={queue.toggleMark}
              onFilterChange={queue.updateFilters}
              onClearMarks={queue.clearMarks}
              onApproveMarked={() => runBulkDecision("aprovado", "aprovados")}
              onRejectMarked={() => runBulkDecision("rejeitado", "rejeitados")}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize="480px">
            <section className="flex h-full min-w-0 flex-col">
              {selected ? (
                <PointReview
                  item={selected}
                  author={moderationAuthorsMock[selected.autorId]}
                  onApprove={() => runDecision("aprovado", "Ponto aprovado")}
                  onReturn={() => runDecision("devolvido", "Devolvido ao autor")}
                  onReject={() => setDialog("rejeicao")}
                  onCompare={() => setDialog("duplicata")}
                />
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-1.5 p-12 text-center">
                  <p className="font-semibold">Nada para revisar</p>
                  <p className="text-muted-foreground text-sm">
                    Toda a fila foi decidida. Tempo médio nesta semana:{" "}
                    {moderationSummaryMock.tempoMedio}.
                  </p>
                </div>
              )}
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto border-t pt-4">
          <HistoryTable />
        </div>
      )}

      {selected && (
        <RejectDialog
          open={dialog === "rejeicao"}
          onOpenChange={(open) => setDialog(open ? "rejeicao" : null)}
          pointName={selected.nome}
          onConfirm={(reason) => {
            setDialog(null);
            runDecision("rejeitado", `Ponto rejeitado (${reason})`);
          }}
        />
      )}

      {selected?.duplicata && (
        <DuplicateDialog
          open={dialog === "duplicata"}
          onOpenChange={(open) => setDialog(open ? "duplicata" : null)}
          pointName={selected.nome}
          duplicate={selected.duplicata}
          onMerge={() => {
            setDialog(null);
            runDecision(
              "rejeitado",
              `Mesclado em ${selected.duplicata?.nome ?? "ponto existente"}`,
            );
          }}
          onKeepBoth={() => {
            setDialog(null);
            toast.info("Marcado como lugar diferente");
          }}
        />
      )}
    </>
  );
}
