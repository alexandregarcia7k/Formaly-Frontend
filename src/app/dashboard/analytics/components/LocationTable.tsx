"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Medal, Award, Trophy, Lightbulb } from "lucide-react";

interface LocationData {
  state: string;
  acessos: number;
  respostas: number;
  taxa: number;
}

interface LocationTableProps {
  data: LocationData[];
}

export function LocationTable({ data }: LocationTableProps) {
  const medalIcons = [Trophy, Medal, Award];
  const medalColors = ["text-amber-500", "text-slate-400", "text-amber-700"];
  
  // Validação: array vazio
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>De onde vêm suas respostas?</CardTitle>
              <CardDescription>Distribuição geográfica por estado</CardDescription>
            </div>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum dado de localização disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const bestConversion = data.reduce((max, item) => item.taxa > max.taxa ? item : max, data[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>De onde vêm suas respostas?</CardTitle>
            <CardDescription>Distribuição geográfica por estado</CardDescription>
          </div>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
            <div>Estado</div>
            <div className="text-right">Acessos</div>
            <div className="text-right">Respostas</div>
            <div className="text-right">Taxa Conv.</div>
          </div>

          {data.map((item, index) => {
            const MedalIcon = index < 3 ? medalIcons[index] : null;
            const medalColor = index < 3 ? medalColors[index] : "";
            
            return (
              <div key={`${item.state}-${index}`} className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2">
                  {MedalIcon && <MedalIcon className={`h-4 w-4 ${medalColor}`} />}
                  <span className="font-medium">{item.state}</span>
                </div>
              <div className="text-right text-muted-foreground">
                {item.acessos.toLocaleString()}
              </div>
              <div className="text-right text-muted-foreground">
                {item.respostas.toLocaleString()}
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="flex-1 max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.taxa}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-12 text-right">
                  {item.taxa}%
                </span>
              </div>
              </div>
            );
          })}

          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            {bestConversion.state} tem a melhor taxa de conversão ({bestConversion.taxa}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
