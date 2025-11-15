"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeatmapData {
  day: string;
  data: { hour: number; value: number }[];
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const hours = [0, 4, 8, 12, 16, 20];
  
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

  const bestDay = data.reduce((max, d) => {
    const dayTotal = d.data.reduce((sum, h) => sum + h.value, 0);
    const maxTotal = max.data.reduce((sum, h) => sum + h.value, 0);
    return dayTotal > maxTotal ? d : max;
  }, data[0]);

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
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                {hour}h
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
                  {dayData.data
                    .filter((h) => hours.includes(h.hour))
                    .map((hourData) => (
                      <div
                        key={hourData.hour}
                        className={cn(
                          "flex-1 h-8 rounded transition-colors",
                          getIntensityClass(hourData.value)
                        )}
                        title={`${dayData.day} ${hourData.hour}h: ${hourData.value} respostas`}
                      />
                    ))}
                </div>
                <div className="w-16 text-right text-xs text-muted-foreground">
                  {dayData.data.reduce((sum, h) => sum + h.value, 0)} resp.
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
            {bestDay && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Melhor momento: {bestDay.day}, 14h-16h</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
