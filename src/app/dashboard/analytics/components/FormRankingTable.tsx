"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, AlertTriangle, Star, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormRankingData {
  rank: number;
  nome: string;
  acessos: number;
  respostas: number;
  conversao: number;
  tempo: string;
  score: number;
}

interface FormRankingTableProps {
  data: FormRankingData[];
}

export function FormRankingTable({ data }: FormRankingTableProps) {
  const medalIcons = [Trophy, Medal, Award];
  const medalColors = ["text-amber-500", "text-slate-400", "text-amber-700"];
  
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ranking de Formulários</CardTitle>
              <CardDescription>Comparação de desempenho entre formulários</CardDescription>
            </div>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum formulário disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgConversion = data.reduce((sum, f) => sum + f.conversao, 0) / data.length;
  const problematicForms = data.filter(f => f.conversao < avgConversion - 10);

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < score ? "fill-amber-400 text-amber-400" : "text-muted"
        )}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ranking de Formulários</CardTitle>
            <CardDescription>Comparação de desempenho entre formulários</CardDescription>
          </div>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
            <div className="col-span-2">Formulário</div>
            <div className="text-right">Acessos</div>
            <div className="text-right">Respostas</div>
            <div className="text-right">Conv%</div>
            <div className="text-right">Score</div>
          </div>

          {data.map((form) => {
            const isProblematic = form.conversao < avgConversion - 10;
            const MedalIcon = form.rank <= 3 ? medalIcons[form.rank - 1] : null;
            const medalColor = form.rank <= 3 ? medalColors[form.rank - 1] : "";
            
            return (
              <div
                key={`${form.nome}-${form.rank}`}
                className={cn(
                  "grid grid-cols-6 gap-4 items-center p-3 rounded-lg transition-colors",
                  isProblematic && "bg-destructive/5"
                )}
              >
                <div className="col-span-2 flex items-center gap-2">
                  {MedalIcon && <MedalIcon className={`h-5 w-5 ${medalColor}`} />}
                  {form.rank > 3 && <span className="text-sm text-muted-foreground w-6">{form.rank}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{form.nome}</p>
                    <p className="text-xs text-muted-foreground">{form.tempo}</p>
                  </div>
                </div>
                <div className="text-right text-muted-foreground">
                  {form.acessos.toLocaleString()}
                </div>
                <div className="text-right text-muted-foreground">
                  {form.respostas.toLocaleString()}
                </div>
                <div className="text-right">
                  <span className={cn(
                    "font-semibold",
                    form.conversao >= avgConversion ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {form.conversao}%
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  {renderStars(form.score)}
                </div>
              </div>
            );
          })}

          {problematicForms.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Atenção: Formulários que precisam de otimização
              </div>
              {problematicForms.map((form) => (
                <div key={form.rank} className="text-sm text-muted-foreground pl-6">
                  • <span className="font-medium">{form.nome}</span>: Conversão {Math.round(avgConversion - form.conversao)}pp abaixo da média
                  <br />
                  <span className="text-xs pl-2">→ Sugestão: Reduzir campos ou dividir em etapas</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
