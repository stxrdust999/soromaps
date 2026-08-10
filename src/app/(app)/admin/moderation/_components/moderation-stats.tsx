import { Badge } from "@/components/ui/badge";
import { moderationSummaryMock } from "@/mocks/admin-moderation";

interface ModerationStatsProps {
  pendingCount: number;
  returnedCount: number;
}

interface StatProps {
  label: string;
  value: string | number;
  trailing?: React.ReactNode;
}

function Stat({ label, value, trailing }: StatProps) {
  return (
    <div className="rounded-lg border px-4 py-3">
      <p className="text-muted-foreground text-sm">{label}</p>

      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {trailing}
      </div>
    </div>
  );
}

/**
 * Os quatro números do topo. O tempo médio é o que denuncia fila represada —
 * os outros três só dizem tamanho.
 */
export function ModerationStats({
  pendingCount,
  returnedCount,
}: ModerationStatsProps) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Pendentes" value={pendingCount} />
      <Stat label="Devolvidos aguardando o autor" value={returnedCount} />
      <Stat
        label="Decididos hoje"
        value={moderationSummaryMock.decididosHoje}
      />
      <Stat
        label="Tempo médio de decisão"
        value={moderationSummaryMock.tempoMedio}
        trailing={
          <Badge variant="warning">
            {moderationSummaryMock.variacaoTempoMedio}
          </Badge>
        }
      />
    </div>
  );
}
