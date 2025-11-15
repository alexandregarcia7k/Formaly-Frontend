"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Monitor, Smartphone, Info } from "lucide-react";

interface ResponseMetadataProps {
  formName: string;
  submittedAt: Date;
  updatedAt: Date;
  device?: "mobile" | "desktop";
  userAgent?: string;
}

export function ResponseMetadata({
  formName,
  submittedAt,
  updatedAt,
  device = "desktop",
  userAgent,
}: ResponseMetadataProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Informações da Submissão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Formulário:</span>
          <span className="font-medium">{formName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Recebido em:</span>
          <span>{formatDateTime(submittedAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Atualizado em:</span>
          <span>{formatDateTime(updatedAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Dispositivo:</span>
          <div className="flex items-center gap-2">
            {device === "mobile" ? (
              <Smartphone className="h-3.5 w-3.5" />
            ) : (
              <Monitor className="h-3.5 w-3.5" />
            )}
            <span className="capitalize">{device}</span>
          </div>
        </div>
        {userAgent && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Navegador:</span>
            <span className="text-xs">{userAgent}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
