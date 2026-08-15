"use client";

import { useState } from "react";

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
  REJECTION_REASONS,
  type RejectionReason,
} from "@/mocks/admin-moderation";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pointName: string;
  onConfirm: (reason: RejectionReason) => void;
}

/**
 * Rejeição com motivo de lista fechada. Texto livre não vira métrica de fila
 * nem mensagem decente para quem enviou — a observação existe só para o que a
 * lista não cobre.
 */
export function RejectDialog({
  open,
  onOpenChange,
  pointName,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState<RejectionReason>(REJECTION_REASONS[0]);
  const [notify, setNotify] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Rejeitar “{pointName}”</DialogTitle>
          <DialogDescription>
            O motivo vira métrica da fila e, se você avisar, vira a mensagem
            enviada ao autor.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">Motivo</span>

            <RadioGroup
              value={reason}
              onValueChange={(value) => setReason(value as RejectionReason)}
            >
              {REJECTION_REASONS.map((option) => (
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
            <Label htmlFor="rejection-note" className="text-muted-foreground">
              Observação (opcional)
            </Label>
            <Textarea
              id="rejection-note"
              placeholder="Contexto para o autor ou para o histórico interno."
              className="min-h-17"
            />
          </div>

          <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked === true)}
            />
            Avisar o autor por notificação
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)}>
            Rejeitar ponto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
