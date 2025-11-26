"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Smartphone, Lightbulb } from "lucide-react";

interface DeviceChartProps {
  data: { name: string; value: number; count: number }[];
}

const DEVICE_COLORS: Record<string, string> = {
  mobile: "hsl(var(--chart-1))",
  desktop: "hsl(var(--chart-2))",
  tablet: "hsl(var(--chart-3))",
};

export function DeviceChart({ data }: DeviceChartProps) {
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
            </div>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de dispositivo disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    color: DEVICE_COLORS[item.name.toLowerCase()] || "hsl(var(--chart-4))",
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name.toLowerCase()] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const topDevice = chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
          </div>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
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
        {topDevice && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            {topDevice.name} domina ({topDevice.value}%)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
