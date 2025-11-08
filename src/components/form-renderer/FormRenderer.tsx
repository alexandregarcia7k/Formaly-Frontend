"use client";

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
}: FormRendererProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-muted/20">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {formName || "Seu Formulário"}
            </CardTitle>
            {formDescription && (
              <CardDescription className="text-base">
                {formDescription}
              </CardDescription>
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
                  <FormFieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => onFieldChange(field.id, value)}
                  />
                ))}

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
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
