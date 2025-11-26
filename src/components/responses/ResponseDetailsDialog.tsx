"use client";

import { useState, useCallback, useEffect } from "react";
import { Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/form-builder/FormFieldEditor";
import { FormFieldRenderer } from "@/components/form-renderer/FormFieldRenderer";
import { ResponseMetadata } from "./ResponseMetadata";

interface ResponseData {
  id: string;
  formId: string;
  formName: string;
  respondentName?: string;
  respondentEmail?: string;
  status: "COMPLETE" | "INCOMPLETE";
  submittedAt: Date;
  updatedAt: Date;
  data: Record<string, unknown>;
  device?: "mobile" | "desktop";
  userAgent?: string;
}

interface ResponseDetailsDialogProps {
  response: ResponseData | null;
  formFields: FormField[];
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: Record<string, unknown>) => void;
}

export function ResponseDetailsDialog({
  response,
  formFields,
  isOpen,
  onClose,
  onSave,
}: ResponseDetailsDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Atualizar formData quando response mudar
  useEffect(() => {
    if (response?.data) {
      setFormData(response.data);
    }
  }, [response]);

  // Resetar estado ao abrir/fechar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditMode(false);
      setFormData(response?.data || {});
      onClose();
    }
  };

  const handleToggleMode = () => {
    if (isEditMode) {
      // Cancelar edição - restaurar dados originais
      setFormData(response?.data || {});
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    onSave?.(formData);
    toast.success("Resposta atualizada com sucesso");
    setIsEditMode(false);
  };

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  if (!response) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between pr-10">
            <DialogTitle className="flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Edit className="h-5 w-5 text-primary" />
                  Editar Resposta
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 text-primary" />
                  Visualizar Resposta
                </>
              )}
            </DialogTitle>
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button variant="outline" onClick={handleToggleMode}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    Salvar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={handleToggleMode}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modo de Edição
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Card do Formulário */}
            <Card>
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl">
                  {response.formName}
                </CardTitle>
                <CardDescription className="text-sm">
                  {isEditMode ? "Editando resposta" : "Resposta recebida"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <FormFieldRenderer
                        field={field}
                        value={formData[field.id]}
                        onChange={(value) => handleFieldChange(field.id, value)}
                        readOnly={!isEditMode}
                      />
                    </div>
                  ))}
                </form>
              </CardContent>
            </Card>

            {/* Metadados */}
            <ResponseMetadata
              formName={response.formName}
              submittedAt={response.submittedAt}
              updatedAt={response.updatedAt}
              device={response.device}
              userAgent={response.userAgent}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
