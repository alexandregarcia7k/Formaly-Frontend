"use client";

import { useState, useCallback } from "react";
import { FormField } from "./FormFieldEditor";
import { FormRenderer, PasswordProtection } from "@/components/form-renderer";

interface FormPreviewProps {
  formName: string;
  formDescription: string;
  fields: FormField[];
  hasPassword: boolean;
}

export function FormPreview({
  formName,
  formDescription,
  fields,
  hasPassword,
}: FormPreviewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(hasPassword);

  const handlePasswordSubmit = (password: string) => {
    // TODO: Validar senha com backend
    console.log("🔐 Preview - Tentativa de acesso com senha:", password);
    setShowPasswordPrompt(false);
  };

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: Record<string, any>) => {
    console.log("📋 Preview - Dados do formulário:", data);
    alert("Preview: Formulário enviado! Veja o console para os dados.");
  };

  if (showPasswordPrompt) {
    return <PasswordProtection onPasswordSubmit={handlePasswordSubmit} />;
  }

  return (
    <FormRenderer
      formName={formName}
      formDescription={formDescription}
      fields={fields}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      showPreviewHeader={true}
    />
  );
}
