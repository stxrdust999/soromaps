"use client";

import { OctagonAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { RemovalDialog } from "@/components/blocks/removal-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { reportsSummaryMock, TARGET_LABEL } from "@/mocks/admin-reports";

import { FeedbackTable } from "./feedback-table";
import { ReportDetail } from "./report-detail";
import { ReportQueue } from "./report-queue";
import { useReports } from "./use-reports";

type WorkspaceTab = "denuncias" | "feedback";

const TABS: { value: WorkspaceTab; label: string }[] = [
  { value: "denuncias", label: "Denúncias" },
  { value: "feedback", label: "Feedback" },
];

/**
 * A caixa de entrada inteira. As duas abas dividem a rota porque compartilham
 * a forma de trabalho — fila que chega sozinha e precisa ser despachada — mas
 * **não compartilham modelo**: denúncia tem alvo polimórfico e se resolve
 * decidindo sobre conteúdo de terceiro; feedback não tem alvo e se resolve com
 * triagem de status. Por isso cada aba tem forma de tela própria.
 *
 * É client porque nem `Denuncia` nem `Feedback` existem no banco — encerrar um
 * caso mexe só no array de `src/mocks/admin-reports.ts`.
 */
export function ReportsWorkspace() {
  const {
    visible,
    selected,
    selectedId,
    setSelectedId,
    filters,
    updateFilters,
    clearFilters,
    stats,
    closeCase,
    feedback,
    setFeedbackStatus,
  } = useReports();

  const [tab, setTab] = useState<WorkspaceTab>("denuncias");
  const [removing, setRemoving] = useState(false);

  const hasFilters = Object.values(filters).some(Boolean);
  const isReports = tab === "denuncias";

  function discard() {
    const report = closeCase();
    if (!report) return;

    toast.success("Denúncias descartadas", {
      description: "O conteúdo permanece no ar e o caso foi encerrado.",
    });
  }

  function remove(reason: string) {
    const report = closeCase();
    setRemoving(false);
    if (!report) return;

    toast.success(`Conteúdo removido (${reason})`, {
      description: "O caso foi encerrado e o autor avisado.",
    });
  }

  const removalSubject = selected
    ? `${TARGET_LABEL[selected.alvoTipo].label.toLowerCase()}${
        selected.conteudo.local ? ` de ${selected.conteudo.local}` : ""
      }`
    : "";

  return (
    <>
      <PageSection
        title="Denúncias e Feedback"
        description={
          isReports
            ? "Casos abertos pela comunidade, agrupados pelo conteúdo denunciado"
            : "O que os usuários dizem sobre o produto, para triagem"
        }
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
          <div className="mt-3 flex flex-wrap gap-2">
            {isReports ? (
              <>
                <Badge>
                  {stats.casos === 1
                    ? "1 caso aberto"
                    : `${stats.casos} casos abertos`}
                </Badge>

                {stats.coordenadas > 0 && (
                  <Badge variant="destructive">
                    <OctagonAlertIcon size={12} />
                    <span className="text-xs font-light">
                      {stats.coordenadas} com denúncia coordenada
                    </span>
                  </Badge>
                )}

                <Badge>{stats.denuncias} denúncias no total</Badge>
                <Badge>
                  {reportsSummaryMock.resolvidosNaSemana} resolvidos esta semana
                </Badge>
              </>
            ) : (
              <>
                <Badge>{stats.naoLidos} não lidos</Badge>
                <Badge>{stats.bugs} bugs</Badge>
                <Badge>{stats.sugestoes} sugestões</Badge>
                <Badge>{stats.elogios} elogios</Badge>
              </>
            )}
          </div>
        }
      />

      {isReports ? (
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1 border-t"
        >
          <ResizablePanel defaultSize="26%" minSize="300px" maxSize="40%">
            <ReportQueue
              reports={visible}
              selectedId={selectedId}
              filters={filters}
              hasFilters={hasFilters}
              onSelect={setSelectedId}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize="480px">
            <section className="flex h-full min-w-0 flex-col">
              {selected ? (
                <ReportDetail
                  report={selected}
                  onDiscard={discard}
                  onRemove={() => setRemoving(true)}
                />
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-1.5 p-12 text-center">
                  <p className="font-semibold">Nada para revisar</p>
                  <p className="text-muted-foreground text-sm">
                    Todos os casos foram encerrados. Tempo médio nesta semana:{" "}
                    {reportsSummaryMock.tempoMedioResolucao}.
                  </p>
                </div>
              )}
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto border-t pt-4">
          <FeedbackTable
            feedback={feedback}
            onMarkRead={(item) => {
              setFeedbackStatus(item.id, "lido");
              toast.success("Marcado como lido");
            }}
            onMarkAnswered={(item) => {
              setFeedbackStatus(item.id, "respondido");
              toast.success("Marcado como respondido");
            }}
          />
        </div>
      )}

      {removing && selected && (
        <RemovalDialog
          subject={removalSubject}
          onOpenChange={setRemoving}
          onConfirm={remove}
        />
      )}
    </>
  );
}
