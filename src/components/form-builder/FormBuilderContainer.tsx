"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FormBuilderHeader,
  FormFieldTypes,
  FormFieldEditor,
  FormPreview,
  FormSettings,
  FIELD_TYPES,
  createNewField,
  type FormField,
  type FieldType,
} from "@/components/form-builder";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { FormsService } from "@/lib/services/forms.service";

interface FormBuilderContainerProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    name: string;
    description: string;
    password?: string;
    fields: FormField[];
    // Configurações avançadas
    expiresAt?: Date | null;
    maxResponses?: number | null;
    allowMultipleSubmissions?: boolean;
    successMessage?: string;
    isActive?: boolean;
  };
}

export function FormBuilderContainer({
  mode,
  initialData,
}: FormBuilderContainerProps) {
  const router = useRouter();
  const [formName, setFormName] = useState(initialData?.name || "");
  const [formDescription, setFormDescription] = useState(
    initialData?.description || ""
  );
  const [formPassword, setFormPassword] = useState(initialData?.password || "");
  const [showPassword, setShowPassword] = useState(!!initialData?.password);
  const [selectedFields, setSelectedFields] = useState<FormField[]>(
    initialData?.fields || []
  );
  const [activeTab, setActiveTab] = useState<
    "builder" | "preview" | "settings"
  >("builder");
  const [isLoading, setIsLoading] = useState(false);

  // Configurações avançadas
  const [expiresAt, setExpiresAt] = useState<Date | null>(
    initialData?.expiresAt || null
  );
  const [maxResponses, setMaxResponses] = useState<number | null>(
    initialData?.maxResponses || null
  );
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(
    initialData?.allowMultipleSubmissions ?? true
  );
  const [successMessage, setSuccessMessage] = useState(
    initialData?.successMessage || ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Atualizar estado quando initialData mudar (para modo de edição)
  useEffect(() => {
    if (initialData) {
      setFormName(initialData.name);
      setFormDescription(initialData.description);
      setFormPassword(initialData.password || "");
      setShowPassword(!!initialData.password);
      setSelectedFields(initialData.fields);
    }
  }, [initialData]);

  // Hook customizado para drag-and-drop
  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleFieldTypeDragStart,
    handleCanvasDragOver,
    handleCanvasDrop,
  } = useDragAndDrop(selectedFields, setSelectedFields);

  const addField = (type: FieldType) => {
    const newField = createNewField(type);
    setSelectedFields([...selectedFields, newField]);
  };

  const removeField = (id: string) => {
    setSelectedFields(selectedFields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setSelectedFields(
      selectedFields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleCancel = () => {
    router.push("/dashboard/forms");
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error("O nome do formulário é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && initialData?.id) {
        // Atualizar formulário existente
        await FormsService.updateForm(initialData.id, {
          name: formName,
          description: formDescription,
          password: formPassword,
          fields: FormsService.mapFieldsToBackend(selectedFields),
          expiresAt: expiresAt || undefined,
          maxResponses: maxResponses || undefined,
          allowMultipleSubmissions,
          successMessage: successMessage,
        });
        toast.success("Formulário atualizado com sucesso");
        router.push("/dashboard/forms");
      } else {
        // Criar novo formulário
        await FormsService.createForm({
          name: formName,
          description: formDescription,
          password: formPassword,
          fields: FormsService.mapFieldsToBackend(selectedFields),
          expiresAt: expiresAt || undefined,
          maxResponses: maxResponses || undefined,
          allowMultipleSubmissions,
          successMessage: successMessage,
        });
        toast.success("Formulário criado com sucesso");
        router.push("/dashboard/forms");
      }
    } catch (error) {
      toast.error("Erro ao salvar formulário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FormBuilderHeader
        formName={formName}
        formDescription={formDescription}
        formPassword={formPassword}
        showPassword={showPassword}
        formLink={initialData?.id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${initialData.id}` : ""}
        activeTab={activeTab}
        onFormNameChange={setFormName}
        onFormDescriptionChange={setFormDescription}
        onFormPasswordChange={setFormPassword}
        onShowPasswordToggle={() => setShowPassword(!showPassword)}
        onClearPassword={() => setFormPassword("")}
        onCopyLink={() => {
          if (initialData?.id) {
            navigator.clipboard.writeText(`${window.location.origin}/f/${initialData.id}`);
          }
        }}
        onTabChange={setActiveTab}
        onBack={() => router.back()}
        onCancel={handleCancel}
        onSave={handleSave}
        isLoading={isLoading}
      />

      {/* Conteúdo */}
      <div className="flex-1 bg-muted/30">
        {activeTab === "builder" && (
          <div className="flex">
            <FormFieldTypes
              fieldTypes={FIELD_TYPES}
              onFieldTypeClick={addField}
              onFieldTypeDragStart={handleFieldTypeDragStart}
            />

            {/* Área de construção */}
            <div
              className="flex-1 bg-background"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              <div className="p-6 max-w-4xl mx-auto">
                {selectedFields.length === 0 && (
                  <div className="border-2 border-dashed border-muted-foreground/30 bg-muted/20 rounded-lg p-12 text-center">
                    <p className="text-muted-foreground font-medium">
                      Arraste campos da barra lateral ou clique neles para
                      adicionar
                    </p>
                  </div>
                )}

                {/* Lista de campos */}
                <div className="space-y-4">
                  {selectedFields.map((field, index) => (
                    <FormFieldEditor
                      key={field.id}
                      field={field}
                      fieldTypes={FIELD_TYPES}
                      isDragging={draggedIndex === index}
                      isDragOver={dragOverIndex === index}
                      onUpdate={(updates) => updateField(field.id, updates)}
                      onRemove={() => removeField(field.id)}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <FormPreview
            formName={formName}
            formDescription={formDescription}
            fields={selectedFields}
            hasPassword={!!formPassword}
          />
        )}

        {activeTab === "settings" && (
          <FormSettings
            expiresAt={expiresAt}
            setExpiresAt={setExpiresAt}
            maxResponses={maxResponses}
            setMaxResponses={setMaxResponses}
            allowMultipleSubmissions={allowMultipleSubmissions}
            setAllowMultipleSubmissions={setAllowMultipleSubmissions}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        )}
      </div>
    </div>
  );
}
