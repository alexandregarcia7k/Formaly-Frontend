"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface TemporalChartProps {
  data: { date: string; acessos: number; respostas: number }[];
  timeRange: string;
}

export function TemporalChart({ data }: TemporalChartProps) {
  const chartConfig = {
    acessos: {
      label: "Acessos",
      color: "hsl(var(--chart-1))",
    },
    respostas: {
      label: "Respostas",
      color: "var(--primary)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acessos vs Respostas</CardTitle>
        <CardDescription>
          Comparação entre visualizações e respostas ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillAcessos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRespostas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="acessos"
              type="monotone"
              fill="url(#fillAcessos)"
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
            <Area
              dataKey="respostas"
              type="monotone"
              fill="url(#fillRespostas)"
              stroke="var(--primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
