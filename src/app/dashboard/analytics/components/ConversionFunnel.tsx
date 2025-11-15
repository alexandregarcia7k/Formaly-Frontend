"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Play, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoff: number;
}

interface ConversionFunnelProps {
  data: FunnelStage[];
}

const stageIcons = [Eye, Play, FileText, CheckCircle2];

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do usuário do acesso até o envio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de funil disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>Jornada do usuário do acesso até o envio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((stage, index) => {
          const Icon = stageIcons[index] || FileText;
          const width = stage.percentage;
          const nextStage = data[index + 1];
          // Proteção contra divisão por zero
          const conversionRate = nextStage && stage.count > 0
            ? Math.round((nextStage.count / stage.count) * 100)
            : 100;

          return (
            <div key={`${stage.stage}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
              </div>
              
              <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                <div
                  className={cn(
                    "h-full flex items-center justify-center text-sm font-medium transition-all",
                    index === 0 ? "bg-primary/20" : "bg-primary/40"
                  )}
                  style={{ width: `${width}%` }}
                >
                  {width > 20 && (
                    <span className="text-primary-foreground mix-blend-difference">
                      {stage.count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {nextStage && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    ↓ {conversionRate}% continuaram
                  </span>
                  {stage.dropoff > 0 && (
                    <span className="text-destructive">
                      ({stage.dropoff}% abandonaram)
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 space-y-2 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Pontos Críticos de Abandono
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• 22% abandonam sem abrir (problema: título/descrição?)</li>
            <li>• 15% abandonam durante preenchimento (problema: UX/campos?)</li>
            <li>• 8% abandonam antes de enviar (problema: validação/confiança?)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
