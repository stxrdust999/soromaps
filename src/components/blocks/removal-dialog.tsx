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
  REMOVAL_REASONS,
  type RemovalReason,
} from "@/constants/content-removal";

interface RemovalDialogProps {
  /** O que sai do ar — "avaliação de Bar do Zeca". Ignorado quando `count > 1`. */
  subject: string;

  /**
   * Quantos itens a decisão cobre. Acima de 1 o diálogo vira remoção em lote:
   * um motivo só, aplicado a todos. É o par natural de uma tela que encontra
   * padrão — achar dez avaliações fraudulentas e remover uma a uma é castigo.
   */
  count?: number;

  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: RemovalReason) => void;
}

/**
 * Remoção de conteúdo público, com motivo obrigatório.
 *
 * Compartilhado entre `/admin/reports` e `/admin/reviews` de propósito: as
 * duas telas removem a mesma coisa por caminhos diferentes, e
 * `docs/todo/admin/reviews.md` avisa que duas implementações divergem no
 * primeiro ajuste de regra. Quando a Server Action existir, ela nasce igual —
 * é esta peça que garante que o vocabulário já é o mesmo hoje.
 *
 * @param props Alvo, quantidade coberta e callbacks.
 */
export function RemovalDialog({
  subject,
  count = 1,
  onOpenChange,
  onConfirm,
}: RemovalDialogProps) {
  const [reason, setReason] = useState<RemovalReason>(REMOVAL_REASONS[0]);
  const [notify, setNotify] = useState(true);

  const isBulk = count > 1;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isBulk ? `Remover ${count} avaliações` : `Remover ${subject}`}
          </DialogTitle>

          <DialogDescription>
            {isBulk
              ? "O mesmo motivo vale para todas as selecionadas. Elas saem do ar de uma vez e continuam auditáveis."
              : "O conteúdo sai do ar e o caso é encerrado. O motivo vira métrica e, se você avisar, vira a mensagem enviada ao autor."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">Motivo</span>

            <RadioGroup
              value={reason}
              onValueChange={(value) => setReason(value as RemovalReason)}
            >
              {REMOVAL_REASONS.map((option) => (
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
            <Label htmlFor="removal-note" className="text-muted-foreground">
              Observação (opcional)
            </Label>
            <Textarea
              id="removal-note"
              placeholder="Contexto para o autor ou para o registro interno."
              className="min-h-17"
            />
          </div>

          <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked === true)}
            />
            {isBulk ? "Avisar os autores" : "Avisar o autor do conteúdo"}
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)}>
            {isBulk ? `Remover ${count} avaliações` : "Remover conteúdo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
