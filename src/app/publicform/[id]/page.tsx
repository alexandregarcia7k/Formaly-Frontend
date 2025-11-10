"use client";

import { use, useEffect, useState } from "react";
import { FormRenderer, PasswordProtection } from "@/components/form-renderer";
import { PublicFormsService } from "@/lib/services/public-forms.service";
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
    fields: Array<{
      id: string;
      type: any;
      label: string;
      required: boolean;
      placeholder?: string;
      options?: string[];
      fieldType: string;
    }>;
    hasPassword: boolean;
  } | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [submissionData, setSubmissionData] = useState<Record<string, unknown>>({});

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
        fields: response.fields.map((field) => ({
          id: field.id,
          type: field.type as any,
          label: field.label,
          required: field.required,
          placeholder: field.config.placeholder || "",
          options: field.config.options,
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
    try {
      await PublicFormsService.submitForm(id, {
        values: submissionData,
      });
      // TODO: Mostrar mensagem de sucesso
      alert("Formulário enviado com sucesso!");
    } catch {
      // TODO: Mostrar mensagem de erro
      alert("Erro ao enviar formulário. Tente novamente.");
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
    return <PasswordProtection onPasswordSubmit={handlePasswordSubmit} />;
  }

  return (
    <FormRenderer
      formName={formData.name}
      formDescription={formData.description}
      fields={formData.fields}
      formData={submissionData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      showPreviewHeader={false}
    />
  );
}
