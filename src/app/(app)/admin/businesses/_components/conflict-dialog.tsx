"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  type BusinessClaimMock,
  CLAIM_EVIDENCE_LABEL,
  claimantsMock,
} from "@/mocks/admin-businesses";
import { formatDistance } from "@/utils/formatters/format-distance";
import { formatWaitingDays } from "@/utils/formatters/format-waiting-days";

interface ConflictDialogProps {
  claim: BusinessClaimMock;
  competitor: BusinessClaimMock;
  onOpenChange: (open: boolean) => void;
  /** Aprova o vencedor e recusa o outro na mesma ação. */
  onResolve: (winner: BusinessClaimMock, loser: BusinessClaimMock) => void;
}

/**
 * Comparação dos dois pedidos concorrentes, campo a campo.
 *
 * A decisão fecha os dois lados de uma vez: aprovar um e deixar o outro na
 * fila devolveria o ponto ao perdedor no dia seguinte.
 */
export function ConflictDialog({
  claim,
  competitor,
  onOpenChange,
  onResolve,
}: ConflictDialogProps) {
  const pair = [claim, competitor];

  const rows = [
    {
      label: "Evidência anexada",
      values: pair.map((item) =>
        item.evidencias.length
          ? item.evidencias.map((e) => CLAIM_EVIDENCE_LABEL[e]).join(" · ")
          : "sem evidência",
      ),
      weak: pair.map((item) => item.evidencias.length === 0),
    },
    {
      label: "CNPJ",
      values: pair.map((item) => item.cnpj ?? "não informado"),
      weak: pair.map((item) => !item.cnpj),
    },
    {
      label: "Razão social",
      values: pair.map((item) => item.razaoSocial ?? "não informado"),
      weak: pair.map((item) => !item.razaoSocial),
    },
    {
      label: "Distância do CNPJ",
      values: pair.map((item) =>
        item.distanciaCnpjKm === null
          ? "—"
          : formatDistance(item.distanciaCnpjKm),
      ),
      weak: pair.map(
        (item) => item.distanciaCnpjKm !== null && item.distanciaCnpjKm > 1,
      ),
    },
    {
      label: "Membro desde",
      values: pair.map((item) => claimantsMock[item.claimantId].membroDesde),
      weak: [false, false],
    },
    {
      label: "Pedidos anteriores",
      values: pair.map((item) => {
        const claimant = claimantsMock[item.claimantId];
        return `${claimant.aprovados} aprovado(s), ${claimant.recusados} recusado(s)`;
      }),
      weak: pair.map((item) => claimantsMock[item.claimantId].recusados > 0),
    },
    {
      label: "Aguardando",
      values: pair.map((item) => formatWaitingDays(item.diasNaFila)),
      weak: pair.map((item) => item.diasNaFila > 7),
    },
  ];

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-220">
        <DialogHeader>
          <DialogTitle>Dois pedidos para {claim.ponto}</DialogTitle>
          <DialogDescription>
            Aprovar um recusa o outro automaticamente, com o motivo registrado.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] overflow-auto">
          <div className="grid grid-cols-[150px_1fr_1fr] items-end gap-4 border-b px-2.5 pb-3">
            <span />

            {pair.map((item, index) => {
              const claimant = claimantsMock[item.claimantId];

              return (
                <div key={item.id}>
                  <p
                    className={cn(
                      "text-xs",
                      index === 0 ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {index === 0 ? "Pedido em análise" : "Pedido concorrente"}
                  </p>
                  <p className="font-semibold">{claimant.nome}</p>
                  <p className="text-muted-foreground text-xs">
                    {claimant.email}
                  </p>
                </div>
              );
            })}
          </div>

          {rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-[150px_1fr_1fr] items-baseline gap-4 rounded-md px-2.5 py-2.5",
                index % 2 === 1 && "bg-muted/40",
              )}
            >
              <span className="text-muted-foreground text-sm">{row.label}</span>

              {row.values.map((value, column) => (
                <span
                  key={pair[column].id}
                  className={cn(
                    "text-sm",
                    row.weak[column] && "text-warning font-semibold",
                  )}
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[150px_1fr_1fr] items-center gap-4 border-t pt-4">
          <span className="text-muted-foreground text-xs">Decisão</span>

          {pair.map((winner, index) => (
            <Button
              key={winner.id}
              variant={index === 0 ? "default" : "outline"}
              onClick={() => onResolve(winner, pair[index === 0 ? 1 : 0])}
            >
              Aprovar este e recusar o outro
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
