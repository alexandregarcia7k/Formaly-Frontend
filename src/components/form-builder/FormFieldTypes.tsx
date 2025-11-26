"use client";

import {
  LucideIcon,
  Mail,
  Phone,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  CheckCheck,
  Calendar,
  Hash,
  FileUp,
} from "lucide-react";
import { FieldType } from "@/types/field-types";

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  description: string;
  icon: LucideIcon;
}

// Configuração dos tipos de campos disponíveis
export const FIELD_TYPES: FieldTypeConfig[] = [
  {
    type: "text",
    label: "Texto",
    description: "Campo de texto personalizados",
    icon: Type,
  },
  {
    type: "email",
    label: "Email",
    description: "Campo de email com validação",
    icon: Mail,
  },
  {
    type: "phone",
    label: "Telefone",
    description: "Campo de telefone",
    icon: Phone,
  },
  {
    type: "textarea",
    label: "Texto Longo",
    description: "Área de texto multilinha",
    icon: AlignLeft,
  },
  {
    type: "select",
    label: "Seleção",
    description: "Lista suspensa de opções",
    icon: List,
  },
  {
    type: "radio",
    label: "Múltipla Escolha",
    description: "Botões de opção (uma escolha)",
    icon: CheckSquare,
  },
  {
    type: "checkbox",
    label: "Caixas de Seleção",
    description: "Múltiplas seleções",
    icon: CheckCheck,
  },
  {
    type: "number",
    label: "Número",
    description: "Campo numérico",
    icon: Hash,
  },
  {
    type: "date",
    label: "Data",
    description: "Seletor de data",
    icon: Calendar,
  },
  {
    type: "file",
    label: "Arquivo",
    description: "Upload de arquivo",
    icon: FileUp,
  },
];

interface FormFieldTypesProps {
  fieldTypes: FieldTypeConfig[];
  onFieldTypeClick: (type: FieldType) => void;
  onFieldTypeDragStart: (e: React.DragEvent, type: FieldType) => void;
}

export function FormFieldTypes({
  fieldTypes,
  onFieldTypeClick,
  onFieldTypeDragStart,
}: FormFieldTypesProps) {
  return (
    <div className="w-64 border-r bg-muted/20 p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Tipos de Campo
      </h3>
      <div className="space-y-1.5">
        {fieldTypes.map((field) => (
          <button
            key={field.type}
            draggable
            onDragStart={(e) => onFieldTypeDragStart(e, field.type)}
            onClick={() => onFieldTypeClick(field.type)}
            className="w-full text-left p-2.5 rounded-lg hover:bg-accent transition-colors group cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-start gap-2.5">
              <field.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{field.label}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {field.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
