"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Trash2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldType, FieldTypeConfig, FIELD_TYPES } from "./FormFieldTypes";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

/**
 * Cria um novo campo com configuração padrão baseado no tipo
 */
export function createNewField(type: FieldType): FormField {
  const fieldConfig = FIELD_TYPES.find((f) => f.type === type);
  const needsOptions =
    type === "select" || type === "radio" || type === "checkbox";

  return {
    id: crypto.randomUUID(),
    type,
    label: fieldConfig?.label || "Novo campo",
    placeholder: "",
    required: false,
    options: needsOptions ? ["Opção 1", "Opção 2", "Opção 3"] : undefined,
  };
}

interface FormFieldEditorProps {
  field: FormField;
  fieldTypes: FieldTypeConfig[];
  isDragging: boolean;
  isDragOver: boolean;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export function FormFieldEditor({
  field,
  fieldTypes,
  isDragging,
  isDragOver,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: FormFieldEditorProps) {
  const fieldType = fieldTypes.find((f) => f.type === field.type);
  const Icon = fieldType?.icon || Type;

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "border-border/50 transition-all duration-200 cursor-grab",
        isDragging
          ? "opacity-50 scale-95 rotate-1 shadow-lg cursor-grabbing"
          : isDragOver
          ? "border-primary border-2 scale-[1.02] shadow-lg"
          : "hover:border-border hover:shadow-sm"
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Drag handle + Icon */}
          <div className="flex items-start gap-2 pt-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 space-y-3">
            {/* Rótulo */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Rótulo
              </Label>
              <div className="flex gap-2">
                <Input
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="Nome do campo"
                  className="text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className="shrink-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              </div>
            </div>

            {/* Placeholder */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Placeholder
              </Label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Texto de exemplo"
                className="text-sm"
              />
            </div>

            {/* Obrigatório */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={field.required}
                onClick={() => onUpdate({ required: !field.required })}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center",
                  field.required
                    ? "bg-primary border-primary"
                    : "border-input hover:border-primary/50"
                )}
              >
                {field.required && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </button>
              <Label
                htmlFor={`required-${field.id}`}
                className="text-sm cursor-pointer font-normal"
                onClick={() => onUpdate({ required: !field.required })}
              >
                Campo obrigatório
              </Label>
            </div>

            {/* Opções para select, radio, checkbox */}
            {field.options && (
              <div className="pt-2 border-t">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Opções
                </Label>
                <div className="space-y-2">
                  {field.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...field.options!];
                          newOptions[idx] = e.target.value;
                          onUpdate({ options: newOptions });
                        }}
                        placeholder={`Opção ${idx + 1}`}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOptions = field.options!.filter(
                            (_, i) => i !== idx
                          );
                          onUpdate({ options: newOptions });
                        }}
                        className="shrink-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [
                        ...field.options!,
                        `Opção ${field.options!.length + 1}`,
                      ];
                      onUpdate({ options: newOptions });
                    }}
                    className="w-full text-xs"
                  >
                    + Adicionar opção
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
