import { InfoIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoHintProps {
  children: string;
}

/** Ícone de ajuda no canto do card, explicando de onde o número sai. */
export function InfoHint({ children }: InfoHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Sobre este número"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <InfoIcon size={16} />
      </TooltipTrigger>

      <TooltipContent side="left">{children}</TooltipContent>
    </Tooltip>
  );
}
