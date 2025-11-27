"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { FormRenderer, PasswordProtection } from "@/components/form-renderer";
import { FormField } from "@/components/form-builder";
import { PublicFormsService } from "@/lib/services/public-forms.service";
import { isValidFieldType } from "@/types/field-types";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicFormPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicFormPage({ params }: PublicFormPageProps) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    fields: FormField[];
    hasPassword: boolean;
  } | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [formPassword, setFormPassword] = useState<string | undefined>(undefined);
  const [submissionData, setSubmissionData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PublicFormsService.getPublicForm(id);
      
      setFormData({
        name: response.name,
        description: response.description || "",
        fields: response.fields
          .filter((field) => isValidFieldType(field.type))
          .map((field) => ({
            id: field.id,
            type: field.type as FormField["type"],
            label: field.label,
            name: field.name,
            required: field.required,
            placeholder: field.config?.placeholder || "",
            options: field.config?.options as string[] | undefined,
            fieldType: field.type,
          })),
        hasPassword: response.requiresPassword,
      });

      setShowPasswordPrompt(response.requiresPassword);
    } catch {
      setError("Formulário não encontrado ou não está mais disponível.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      await PublicFormsService.validatePassword(id, password);
      setFormPassword(password);
      setShowPasswordPrompt(false);
    } catch {
      throw new Error("Senha incorreta");
    }
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setSubmissionData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData || isSubmitting) return;

    setIsSubmitting(true);

    // Mapear fieldId → fieldName
    const dataByName: Record<string, unknown> = {};
    Object.entries(submissionData).forEach(([fieldId, value]) => {
      const field = formData.fields.find((f) => f.id === fieldId);
      if (field) {
        dataByName[field.name] = value;
      }
    });

    const payload = {
      values: dataByName,
      ...(formPassword && { password: formPassword }),
    };

    try {
      await PublicFormsService.submitForm(id, payload);
      setIsSubmitted(true);
      setSubmissionData({});
      toast.success("Formulário enviado com sucesso!");
    } catch {
      toast.error("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Formulário não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            {error || "O formulário que você está tentando acessar não existe."}
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <PasswordProtection onPasswordSubmit={handlePasswordSubmit} />
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Formulário enviado!</h2>
          <p className="text-muted-foreground mb-6">
            Sua resposta foi registrada com sucesso. Obrigado por participar!
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Enviar outra resposta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormRenderer
      formName={formData.name}
      formDescription={formData.description}
      fields={formData.fields}
      formData={submissionData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      showPreviewHeader={false}
    />
  );
}
