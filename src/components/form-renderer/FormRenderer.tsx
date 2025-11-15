"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/form-builder/FormFieldEditor";
import { FormFieldRenderer } from "./FormFieldRenderer";
import { createResponseSchema } from "@/schemas";

interface FormRendererProps {
  formName: string;
  formDescription: string;
  fields: FormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  showPreviewHeader?: boolean;
}

export function FormRenderer({
  formName,
  formDescription,
  fields,
  formData,
  onFieldChange,
  onSubmit,
  submitLabel = "Enviar Formulário",
  isSubmitting = false,
  showPreviewHeader = false,
}: FormRendererProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar com Zod
    const schema = createResponseSchema(
      fields.map((f) => ({ id: f.id, type: f.type, required: f.required, label: f.label }))
    );

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center space-y-4">
            {showPreviewHeader ? (
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground">
                    Visualização do Formulário
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Veja como seu formulário aparecerá para os usuários
                  </p>
                </div>
              </div>
            ) : (
              <>
                <CardTitle className="text-2xl">
                  {formName || "Seu Formulário"}
                </CardTitle>
                {formDescription && (
                  <CardDescription className="text-base">
                    {formDescription}
                  </CardDescription>
                )}
              </>
            )}
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium mb-2">
                  Nenhum campo adicionado
                </p>
                <p className="text-sm">
                  Adicione campos no construtor para visualizar o preview
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id}>
                    <FormFieldRenderer
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => {
                        onFieldChange(field.id, value);
                        // Limpar erro ao corrigir campo
                        if (errors[field.id]) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[field.id];
                            return newErrors;
                          });
                        }
                      }}
                    />
                    {errors[field.id] && (
                      <p className="text-xs text-red-600 mt-1">{errors[field.id]}</p>
                    )}
                  </div>
                ))}

                {submitLabel && (
                  <div className="pt-4 border-t">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : submitLabel}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
