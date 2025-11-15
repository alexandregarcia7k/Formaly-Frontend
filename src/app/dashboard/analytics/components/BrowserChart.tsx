"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Globe, Lightbulb } from "lucide-react";

interface BrowserChartProps {
  data: { name: string; value: number; color: string }[];
}

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

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name.toLowerCase()] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const topBrowser = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);

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
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
