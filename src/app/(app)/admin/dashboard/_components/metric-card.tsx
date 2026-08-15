import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricCardMock } from "@/mocks/admin-dashboard";

import { InfoHint } from "./info-hint";

interface MetricCardProps {
  metric: MetricCardMock;
}

/** Número seco da semana, com a variação sobre a anterior no rodapé. */
export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className="justify-between gap-4">
      <CardHeader>
        <CardTitle>{metric.label}</CardTitle>

        <CardAction>
          <InfoHint>{metric.hint}</InfoHint>
        </CardAction>
      </CardHeader>

      <CardContent>
        <span className="text-4xl font-medium tabular-nums">
          {metric.valor.toLocaleString("pt-BR")}
        </span>
      </CardContent>

      <CardFooter>
        <CardDescription className="text-xs">
          {metric.variacaoSemanal}% a mais que na semana anterior
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
