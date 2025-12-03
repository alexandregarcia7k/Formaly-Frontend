"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
  data: { day: string; hours: { hour: number; count: number }[] }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Intervalos de 4h com 2 blocos cada (0-2h, 2-4h, 4-6h, etc)
  const timeBlocks = [
    { start: 0, end: 2, label: '0h' },
    { start: 2, end: 4, label: '' },
    { start: 4, end: 6, label: '4h' },
    { start: 6, end: 8, label: '' },
    { start: 8, end: 10, label: '8h' },
    { start: 10, end: 12, label: '' },
    { start: 12, end: 14, label: '12h' },
    { start: 14, end: 16, label: '' },
    { start: 16, end: 18, label: '16h' },
    { start: 18, end: 20, label: '' },
    { start: 20, end: 22, label: '20h' },
    { start: 22, end: 24, label: '' },
  ];
  
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quando seus usuários mais respondem?</CardTitle>
              <CardDescription>Distribuição de respostas por dia e horário</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de atividade disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value < 25) return "bg-primary/20";
    if (value < 50) return "bg-primary/40";
    if (value < 75) return "bg-primary/60";
    return "bg-primary/80";
  };

  // Encontrar melhor dia e hora
  let bestMoment = { day: '', hour: 0, count: 0 };
  data.forEach((dayData) => {
    dayData.hours.forEach((hourData) => {
      if (hourData.count > bestMoment.count) {
        bestMoment = { day: dayData.day, hour: hourData.hour, count: hourData.count };
      }
    });
  });

  const formatHourRange = (hour: number) => {
    const nextHour = hour + 1;
    return `${hour}h-${nextHour}h`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quando seus usuários mais respondem?</CardTitle>
            <CardDescription>Distribuição de respostas por dia e horário</CardDescription>
          </div>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header com horários */}
          <div className="flex items-center gap-2">
            <div className="w-12" />
            {timeBlocks.map((block, idx) => (
              <div key={idx} className="flex-1 text-center text-xs text-muted-foreground">
                {block.label}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {data.map((dayData) => (
              <div key={dayData.day} className="flex items-center gap-2">
                <div className="w-12 text-xs font-medium text-muted-foreground">
                  {dayData.day}
                </div>
                <div className="flex flex-1 gap-1">
                  {timeBlocks.map((block, idx) => {
                    // Soma respostas do intervalo (ex: 0-2h)
                    const blockCount = dayData.hours
                      .filter((h) => h.hour >= block.start && h.hour < block.end)
                      .reduce((sum, h) => sum + h.count, 0);
                    
                    // Detalhes para tooltip
                    const details = dayData.hours
                      .filter((h) => h.hour >= block.start && h.hour < block.end)
                      .map((h) => `${h.hour}h: ${h.count}`)
                      .join(', ') || 'Sem respostas';
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex-1 h-8 rounded transition-colors cursor-help",
                          getIntensityClass(blockCount)
                        )}
                        title={`${dayData.day} ${block.start}h-${block.end}h\n${details}\nTotal: ${blockCount} resp.`}
                      />
                    );
                  })}
                </div>
                <div className="w-16 text-right text-xs text-muted-foreground">
                  {dayData.hours.reduce((sum, h) => sum + h.count, 0)} resp.
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-muted" />
                <div className="w-4 h-4 rounded bg-primary/20" />
                <div className="w-4 h-4 rounded bg-primary/40" />
                <div className="w-4 h-4 rounded bg-primary/60" />
                <div className="w-4 h-4 rounded bg-primary/80" />
              </div>
              <span>Mais</span>
            </div>
            {bestMoment.count > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Melhor momento: {bestMoment.day}, {formatHourRange(bestMoment.hour)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
