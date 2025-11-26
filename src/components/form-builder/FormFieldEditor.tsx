"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GripVertical, Trash2, Type, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldType } from "@/types/field-types";
import { FieldTypeConfig, FIELD_TYPES } from "./FormFieldTypes";
import { FieldTypesService } from "@/lib/services/field-types.service";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  config?: any;
  fieldType?: string; // Tipo pré-definido do backend (ex: "full_name", "email")
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
    name: (fieldConfig?.label || "campo").toLowerCase().replace(/\s+/g, "_"),
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
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
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: FormFieldEditorProps) {
  const fieldType = fieldTypes.find((f) => f.type === field.type);
  const Icon = fieldType?.icon || Type;

  // Derivar presets diretamente - sem useState/useEffect desnecessários
  const predefinedTypes = FieldTypesService.getFieldTypes().filter(
    (t) => t.type === field.type
  );

  // Aplicar preset selecionado
  const handlePredefinedTypeChange = (selectedType: string) => {
    const predefined = predefinedTypes.find((t) => t.name === selectedType);
    if (predefined) {
      onUpdate({
        fieldType: selectedType,
        label: predefined.label,
        placeholder: predefined.placeholder,
      });
    } else if (selectedType === "custom") {
      onUpdate({
        fieldType: "custom",
      });
    }
  };

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "border-border transition-all duration-200 cursor-grab hover:shadow-md",
        isDragging
          ? "opacity-50 scale-95 rotate-1 shadow-lg cursor-grabbing"
          : isDragOver
          ? "border-primary border-2 scale-[1.02] shadow-lg ring-2 ring-primary/20"
          : "hover:border-border"
      )}
    >
      <CardContent className="p-5">
        {/* Header com ícone e botão remover */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab hidden lg:block" />
            <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                {fieldType?.label}
              </span>
            </div>
            {field.fieldType && field.fieldType !== "custom" && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Preset
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Botões de reordenação */}
            <div className="flex gap-1">
              {!isFirst && onMoveUp && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveUp}
                  className="h-7 w-7"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
              )}
              {!isLast && onMoveDown && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveDown}
                  className="h-7 w-7"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="space-y-4">
          {/* Preset Selector - Só exibe se houver presets compatíveis com o tipo HTML atual */}
          {predefinedTypes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                Escolher Preset
              </Label>
              <Select
                value={field.fieldType || "custom"}
                onValueChange={handlePredefinedTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">
                    <span className="flex items-center gap-2">
                      <Type className="h-3.5 w-3.5" />
                      Personalizado
                    </span>
                  </SelectItem>

                  {/* Informações Pessoais */}
                  {predefinedTypes.filter((t) => t.category === "personal")
                    .length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Informações Pessoais</SelectLabel>
                      {predefinedTypes
                        .filter((t) => t.category === "personal")
                        .map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {/* Endereço */}
                  {predefinedTypes.filter((t) => t.category === "address")
                    .length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Endereço</SelectLabel>
                      {predefinedTypes
                        .filter((t) => t.category === "address")
                        .map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {/* Profissional */}
                  {predefinedTypes.filter((t) => t.category === "professional")
                    .length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Profissional</SelectLabel>
                      {predefinedTypes
                        .filter((t) => t.category === "professional")
                        .map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {/* Comunicação */}
                  {predefinedTypes.filter((t) => t.category === "communication")
                    .length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Comunicação</SelectLabel>
                      {predefinedTypes
                        .filter((t) => t.category === "communication")
                        .map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {/* Outros */}
                  {predefinedTypes.filter((t) => t.category === "other")
                    .length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Outros</SelectLabel>
                      {predefinedTypes
                        .filter((t) => t.category === "other")
                        .map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Label e Placeholder lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Rótulo */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                Rótulo do Campo
              </Label>
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Ex: Nome completo"
                className="text-sm h-9"
              />
            </div>

            {/* Placeholder */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                Texto de Exemplo
              </Label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Ex: Digite aqui..."
                className="text-sm h-9"
              />
            </div>
          </div>

          {/* Campo Obrigatório */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Switch
                checked={field.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label
                className="text-sm font-medium cursor-pointer"
                onClick={() => onUpdate({ required: !field.required })}
              >
                Campo obrigatório
              </Label>
            </div>
            {field.required && (
              <Badge variant="default" className="text-xs">
                Obrigatório
              </Badge>
            )}
          </div>

          {/* Opções para select, radio, checkbox */}
          {field.options && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground">
                Opções de Escolha
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
                      className="text-sm h-9"
                    />
                    {field.options!.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          const newOptions = field.options!.filter(
                            (_, i) => i !== idx
                          );
                          onUpdate({ options: newOptions });
                        }}
                        className="shrink-0 h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
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
                  className="w-full text-xs h-8"
                >
                  + Adicionar opção
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
