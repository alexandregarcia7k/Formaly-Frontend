"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/form-builder/FormFieldEditor";

interface FormFieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
}: FormFieldRendererProps) {
  const renderRequiredIndicator = () =>
    field.required ? <span className="text-red-500 ml-1">*</span> : null;

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Input
            id={field.id}
            type={
              field.type === "email"
                ? "email"
                : field.type === "phone"
                ? "tel"
                : "text"
            }
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={4}
          />
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value
                  ? format(value as Date, "PPP", { locale: ptBR })
                  : field.placeholder || "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value as Date | undefined}
                onSelect={(date: Date | undefined) => onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Select
            value={(value as string) || ""}
            onValueChange={(val: string) => onChange(val)}
            required={field.required}
          >
            <SelectTrigger id={field.id}>
              <SelectValue
                placeholder={field.placeholder || "Selecione uma opção"}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              )) || (
                <SelectItem value="" disabled>
                  Nenhuma opção disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      );

    case "radio":
      if (!field.options || field.options.length === 0) {
        return (
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {field.label} (nenhuma opção configurada)
            </Label>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <RadioGroup
            value={(value as string) || ""}
            onValueChange={(val) => onChange(val)}
            required={field.required}
          >
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                <Label
                  htmlFor={`${field.id}-${idx}`}
                  className="font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "checkbox":
      if (!field.options || field.options.length === 0) {
        return (
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {field.label} (nenhuma opção configurada)
            </Label>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <div className="space-y-2">
            {field.options.map((option, idx) => {
              const isChecked = Array.isArray(value) && value.includes(option);
              return (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${idx}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      onChange(newValues);
                    }}
                  />
                  <Label
                    htmlFor={`${field.id}-${idx}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "file":
      const fileValue = value instanceof File ? value : null;
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {renderRequiredIndicator()}
          </Label>
          <Input
            id={field.id}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange(file);
            }}
            required={field.required}
            accept={field.options?.join(",") || "*"}
          />
          {fileValue && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {fileValue.name}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}
