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

  const handlePasswordSubmit = () => {
    // TODO: Validar senha com backend
    setShowPasswordPrompt(false);
  };

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const handleSubmit = () => {
    // TODO: Implementar envio real do formulário
    alert("Preview: Formulário enviado!");
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
