"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Globe, Lightbulb } from "lucide-react";

interface BrowserChartProps {
  data: { name: string; value: number; count: number }[];
}

const BROWSER_COLORS: Record<string, string> = {
  chrome: "hsl(142, 76%, 36%)",    // Verde (cor oficial Chrome)
  safari: "hsl(221, 83%, 53%)",    // Azul royal (Safari)
  firefox: "hsl(14, 100%, 53%)",   // Laranja vibrante (Firefox)
  edge: "hsl(199, 89%, 48%)",      // Azul ciano (Edge)
  opera: "hsl(0, 72%, 51%)",       // Vermelho (Opera)
  brave: "hsl(33, 100%, 50%)",     // Laranja dourado (Brave)
  unknown: "hsl(0, 0%, 60%)",      // Cinza
  outros: "hsl(280, 65%, 60%)",    // Roxo
};

export function BrowserChart({ data }: BrowserChartProps) {
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Navegadores</CardTitle>
              <CardDescription>Distribuição por navegador</CardDescription>
            </div>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de navegador disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    color: BROWSER_COLORS[item.name.toLowerCase()] || "hsl(0, 0%, 60%)",
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name.toLowerCase()] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const topBrowser = chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Navegadores</CardTitle>
            <CardDescription>Distribuição por navegador</CardDescription>
          </div>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ChartContainer>
        {topBrowser && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            {topBrowser.name} domina ({topBrowser.value}%)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
