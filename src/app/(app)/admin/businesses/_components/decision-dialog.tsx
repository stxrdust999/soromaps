"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  CLAIM_REJECTION_REASONS,
  CLAIM_REVOCATION_REASONS,
  type ClaimReason,
} from "@/mocks/admin-businesses";

export type DecisionMode = "recusa" | "revogacao";

const COPY = {
  recusa: {
    reasons: CLAIM_REJECTION_REASONS,
    description:
      "O motivo vira métrica da fila e, se você avisar, vira a mensagem enviada ao solicitante.",
    notify: "Avisar o solicitante",
    confirm: "Recusar pedido",
  },
  revogacao: {
    reasons: CLAIM_REVOCATION_REASONS,
    description:
      "O ponto volta a ficar sem dono e o painel do comércio é desativado na hora.",
    notify: "Avisar o dono por e-mail",
    confirm: "Revogar vínculo",
  },
} as const;

interface DecisionDialogProps {
  mode: DecisionMode;
  /** Nome do ponto ou do comércio, para o título. */
  subject: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: ClaimReason) => void;
}

/**
 * Recusa e revogação no mesmo diálogo.
 *
 * São ações diferentes com a mesma forma — motivo de lista fechada, observação
 * livre e aviso opcional — e o que muda entre elas é texto, não estrutura.
 */
export function DecisionDialog({
  mode,
  subject,
  onOpenChange,
  onConfirm,
}: DecisionDialogProps) {
  const copy = COPY[mode];

  const [reason, setReason] = useState<ClaimReason>(copy.reasons[0]);
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    setReason(copy.reasons[0]);
  }, [copy.reasons]);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {mode === "recusa"
              ? `Recusar pedido · ${subject}`
              : `Revogar vínculo · ${subject}`}
          </DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">Motivo</span>

            <RadioGroup
              value={reason}
              onValueChange={(value) => setReason(value as ClaimReason)}
            >
              {copy.reasons.map((option) => (
                <Label
                  key={option}
                  className="hover:bg-accent flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 font-normal"
                >
                  <RadioGroupItem value={option} />
                  {option}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="decision-note" className="text-muted-foreground">
              Observação (opcional)
            </Label>
            <Textarea
              id="decision-note"
              placeholder="Contexto para o solicitante ou para o registro interno."
              className="min-h-17"
            />
          </div>

          <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked === true)}
            />
            {copy.notify}
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)}>
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
