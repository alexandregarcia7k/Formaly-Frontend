"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, AlertTriangle, Mail, Phone, Type, FileText, Calendar, ChevronDown, CheckSquare, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldData {
  tipo: string;
  quantidade: number;
  taxaPreenchimento: number;
  tempoMedio: string;
  taxaErro: number;
}

interface FieldPerformanceTableProps {
  data: FieldData[];
}

const fieldIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Email: Mail,
  Telefone: Phone,
  Text: Type,
  Textarea: FileText,
  Date: Calendar,
  Select: ChevronDown,
  Checkbox: CheckSquare,
  Radio: Circle,
};

export function FieldPerformanceTable({ data }: FieldPerformanceTableProps) {
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Desempenho por Tipo de Campo</CardTitle>
              <CardDescription>Análise de eficiência dos diferentes tipos de campo</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de performance disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const problematicFields = data.filter(f => f.taxaPreenchimento < 70 || f.taxaErro > 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Desempenho por Tipo de Campo</CardTitle>
            <CardDescription>Análise de eficiência dos diferentes tipos de campo</CardDescription>
          </div>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
            <div>Tipo Campo</div>
            <div className="text-right">Qtd Uso</div>
            <div className="text-right">Taxa Preench.</div>
            <div className="text-right">Tempo Médio</div>
            <div className="text-right">Erros</div>
          </div>

          {data.map((field) => {
            const FieldIcon = fieldIcons[field.tipo] || FileText;
            const isProblematic = problematicFields.includes(field);
            
            return (
              <div
                key={field.tipo}
                className={cn(
                  "grid grid-cols-5 gap-4 items-center p-2 rounded-lg transition-colors",
                  isProblematic && "bg-destructive/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <FieldIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{field.tipo}</span>
                </div>
                <div className="text-right text-muted-foreground">
                  {field.quantidade}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="flex-1 max-w-[60px] h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        field.taxaPreenchimento >= 90 ? "bg-green-500" :
                        field.taxaPreenchimento >= 70 ? "bg-primary" :
                        "bg-destructive"
                      )}
                      style={{ width: `${field.taxaPreenchimento}%` }}
                    />
                  </div>
                  <span className="text-sm w-10 text-right">
                    {field.taxaPreenchimento}%
                  </span>
                </div>
                <div className="text-right text-muted-foreground">
                  {field.tempoMedio}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className={cn(
                    "text-sm",
                    field.taxaErro > 5 ? "text-destructive font-semibold" : "text-muted-foreground"
                  )}>
                    {field.taxaErro}%
                  </span>
                  {field.taxaErro > 5 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                </div>
              </div>
            );
          })}

          {problematicFields.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Insights
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {problematicFields.map((field) => (
                  <li key={field.tipo}>
                    • {field.tipo}: {
                      field.taxaPreenchimento < 70 
                        ? `baixa taxa (${field.taxaPreenchimento}%) - considere simplificar`
                        : `${field.taxaErro}% de erro - adicione validação/máscara`
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
