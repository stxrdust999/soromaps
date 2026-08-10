"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { placeSegmentsMock } from "@/mocks/admin-dashboard";

import { InfoHint } from "./info-hint";

const chartConfig = Object.fromEntries(
  placeSegmentsMock.map((segment, index) => [
    segment.key,
    { label: segment.categoria, color: `var(--chart-${index + 1})` },
  ]),
) satisfies ChartConfig;

/** Rosca de pontos por categoria, com a legenda como lista de valores ao lado. */
export function PlaceSegmentationCard() {
  return (
    <Card className="justify-between gap-4">
      <CardHeader>
        <CardTitle>Segmentação de pontos</CardTitle>

        <CardAction>
          <InfoHint>
            Categoria ainda é constante no front, não entidade — o corte muda
            quando a tabela `Categoria` existir.
          </InfoHint>
        </CardAction>
      </CardHeader>

      <CardContent className="flex items-center gap-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-28 shrink-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="key" hideLabel />}
            />

            <Pie
              data={placeSegmentsMock}
              dataKey="total"
              nameKey="key"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {placeSegmentsMock.map((segment) => (
                <Cell key={segment.key} fill={`var(--color-${segment.key})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex flex-1 flex-col gap-1.5">
          {placeSegmentsMock.map((segment) => (
            <li
              key={segment.key}
              className="flex items-center gap-2 text-sm leading-none"
            >
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-${segment.key})` }}
              />
              <span className="text-muted-foreground">{segment.categoria}</span>
              <span className="ml-auto font-medium tabular-nums">
                {segment.total.toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <CardDescription className="text-xs">
          Distribuição da quantidade de pontos cadastrados por categoria
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
