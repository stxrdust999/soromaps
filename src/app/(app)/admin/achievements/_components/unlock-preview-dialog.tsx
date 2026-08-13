"use client";

import { UsersIcon } from "lucide-react";

import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  AchievementIconKey,
  AchievementTrigger,
} from "@/constants/achievements";

export interface UnlockPreviewSubject {
  id: string;
  nome: string;
  descricao: string;
  icone: AchievementIconKey;
  cor: string;
  trigger: AchievementTrigger;
  obtencoes: number;
  raridade: number;
}

interface UnlockPreviewDialogProps {
  subject: UnlockPreviewSubject;
  onOpenChange: (open: boolean) => void;
}

/**
 * O momento de celebração como o jogador vê.
 *
 * Existe porque o admin define a conquista em três campos secos e não tem como
 * saber, olhando o formulário, se a peça funciona na hora que importa. O
 * rodapé avisa que é ensaio — nada foi concedido a ninguém.
 */
export function UnlockPreviewDialog({
  subject,
  onOpenChange,
}: UnlockPreviewDialogProps) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100" showCloseButton={false}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AchievementBadge
            layout="icon"
            badgeSize="xl"
            achievement={{
              id: subject.id,
              name: subject.nome,
              trigger: subject.trigger,
              icon: subject.icone,
              color: subject.cor,
              achievedAt: "agora",
            }}
          />

          <DialogHeader className="items-center gap-1.5">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: subject.cor }}
            >
              Conquista desbloqueada
            </span>

            <DialogTitle className="text-xl">{subject.nome}</DialogTitle>

            <DialogDescription className="text-center">
              {subject.descricao}
            </DialogDescription>
          </DialogHeader>

          <span className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <UsersIcon size={12} />
            {subject.obtencoes > 0
              ? `${subject.raridade}% dos usuários têm`
              : "Você seria o primeiro a ter"}
          </span>

          <div className="mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Compartilhar
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Continuar
            </Button>
          </div>

          <p className="text-muted-foreground text-[11px]">
            Pré-visualização de admin — nada foi concedido a ninguém.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
