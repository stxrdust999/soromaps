"use client";

import { CopyIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UnclaimedPlaceMock } from "@/mocks/admin-businesses";
import { slugify } from "@/utils/formatters/slugify";

interface InviteDialogProps {
  place: UnclaimedPlaceMock;
  onOpenChange: (open: boolean) => void;
  onCopy: (link: string) => void;
}

/**
 * Link de reivindicação de um ponto sem dono. O admin repassa pelo canal que
 * já usa com o estabelecimento — não há envio automático porque não existe
 * contato do negócio em lugar nenhum.
 */
export function InviteDialog({
  place,
  onOpenChange,
  onCopy,
}: InviteDialogProps) {
  const link = `soromaps.app/reivindicar/${slugify(place.nome)}`;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Convidar dono de “{place.nome}”</DialogTitle>
          <DialogDescription>
            Link de reivindicação válido por 30 dias. Repasse pelo canal que
            você já usa com o estabelecimento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2.5">
            <LinkIcon size={14} className="text-muted-foreground shrink-0" />
            <span className="truncate font-mono text-xs">{link}</span>
          </div>

          <p className="text-muted-foreground text-xs">
            {place.avaliacoes} avaliações · nota{" "}
            {place.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} ·{" "}
            {place.visitasNoMes.toLocaleString("pt-BR")} visitas no mês
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={() => onCopy(link)}>
            <CopyIcon />
            Copiar link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
