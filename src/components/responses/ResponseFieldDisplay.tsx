"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FieldType } from "@/types/field-types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResponseFieldDisplayProps {
  label: string;
  value: unknown;
  type: FieldType;
}

function formatValue(value: unknown, type: FieldType): string {
  if (value === null || value === undefined || value === "") {
    return "Não respondido";
  }

  if (type === "date" && value instanceof Date) {
    return format(value, "PPP", { locale: ptBR });
  }

  if (type === "checkbox" && Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

export function ResponseFieldDisplay({ label, value, type }: ResponseFieldDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = formatValue(value, type);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copiado para área de transferência");
  };

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{label}</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="h-7 w-7 p-0"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <p className="text-sm text-foreground">
        {formatValue(value, type)}
      </p>
    </div>
  );
}
