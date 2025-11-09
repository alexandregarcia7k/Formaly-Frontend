"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Link público (será retornado pelo backend após salvar)
  const [formLink, setFormLink] = useState("");

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

  const handleCopyLink = async () => {
    if (!formLink) return;

    try {
      await navigator.clipboard.writeText(formLink);
      // TODO: Adicionar toast de sucesso
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      // TODO: Adicionar toast de erro
    }
  };

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
      // TODO: Adicionar toast de validação
      console.warn("Nome do formulário é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && initialData?.id) {
        // Atualizar formulário existente
        const response = await FormsService.updateForm(initialData.id, {
          name: formName,
          description: formDescription || undefined,
          password: formPassword || undefined,
          fields: selectedFields,
          // Configurações avançadas
          expiresAt: expiresAt || undefined,
          maxResponses: maxResponses || undefined,
          allowMultipleSubmissions,
          successMessage: successMessage || undefined,
        });

        console.log("✅ Formulário atualizado com sucesso:", response);

        // TODO: Adicionar toast de sucesso
        // Redirecionar para lista de formulários
        router.push("/dashboard/forms");
      } else {
        // Criar novo formulário
        const response = await FormsService.createForm({
          name: formName,
          description: formDescription || undefined,
          password: formPassword || undefined,
          fields: selectedFields,
          // Configurações avançadas
          expiresAt: expiresAt || undefined,
          maxResponses: maxResponses || undefined,
          allowMultipleSubmissions,
          successMessage: successMessage || undefined,
        });

        // Backend retorna o link público gerado
        setFormLink(response.publicLink);

        console.log("✅ Formulário criado com sucesso:", response);

        // TODO: Adicionar toast de sucesso
        // TODO: Redirecionar ou mostrar modal com link
      }
    } catch (error) {
      console.error(
        `❌ Erro ao ${mode === "edit" ? "atualizar" : "criar"} formulário:`,
        error
      );
      // TODO: Adicionar toast de erro
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
        formLink={formLink}
        activeTab={activeTab}
        onFormNameChange={setFormName}
        onFormDescriptionChange={setFormDescription}
        onFormPasswordChange={setFormPassword}
        onShowPasswordToggle={() => setShowPassword(!showPassword)}
        onClearPassword={() => setFormPassword("")}
        onCopyLink={handleCopyLink}
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
