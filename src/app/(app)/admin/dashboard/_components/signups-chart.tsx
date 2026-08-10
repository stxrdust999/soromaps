"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { weeklySignupsMock } from "@/mocks/admin-dashboard";

const chartConfig = {
  usuarios: { label: "Usuários", color: "var(--chart-2)" },
  pontos: { label: "Pontos", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Cadastros de usuários e de pontos nas últimas 12 semanas, sobrepostos. */
export function SignupsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastros por semana</CardTitle>
        <CardDescription>
          Exibindo o total de cadastros nas últimas 12 semanas de atividade da
          aplicação
        </CardDescription>
      </CardHeader>

      <CardContent className="border-t pt-6">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart data={weeklySignupsMock} margin={{ left: 8, right: 8 }}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="semana"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

            <Area
              dataKey="usuarios"
              type="natural"
              stroke="var(--color-usuarios)"
              fill="url(#fill-usuarios)"
              stackId="cadastros"
            />

            <Area
              dataKey="pontos"
              type="natural"
              stroke="var(--color-pontos)"
              fill="url(#fill-pontos)"
              stackId="cadastros"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
