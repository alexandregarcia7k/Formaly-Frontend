"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hammer } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormBuilderHeader,
  FormFieldTypes,
  FormFieldEditor,
  FormPreview,
  FIELD_TYPES,
  createNewField,
  type FormField,
  type FieldType,
} from "@/components/form-builder";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { FormsService } from "@/lib/services/forms.service";

export default function FormsPage() {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFields, setSelectedFields] = useState<FormField[]>([]);
  const [activeTab, setActiveTab] = useState<
    "builder" | "preview" | "responses"
  >("builder");
  const [isLoading, setIsLoading] = useState(false);

  // Hook customizado para drag-and-drop
  const {
    draggedIndex,
    dragOverIndex,
    draggedFieldType,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleFieldTypeDragStart,
    handleFieldTypeDragOver,
    handleFieldTypeDrop,
    handleCanvasDragOver,
    handleCanvasDrop,
  } = useDragAndDrop(selectedFields, setSelectedFields);

  // Link público (será retornado pelo backend após salvar)
  const [formLink, setFormLink] = useState("");

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
    router.push("/dashboard");
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      // TODO: Adicionar toast de validação
      console.warn("Nome do formulário é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      // Enviar dados para API NestJS/Fastify
      const response = await FormsService.createForm({
        name: formName,
        description: formDescription || undefined,
        password: formPassword || undefined,
        fields: selectedFields,
      });

      // Backend retorna o link público gerado
      setFormLink(response.publicLink);

      console.log("✅ Formulário criado com sucesso:", response);

      // TODO: Adicionar toast de sucesso
      // TODO: Redirecionar ou mostrar modal com link
    } catch (error) {
      console.error("❌ Erro ao criar formulário:", error);
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
      <div className="flex-1">
        {activeTab === "builder" && (
          <div className="flex">
            <FormFieldTypes
              fieldTypes={FIELD_TYPES}
              onFieldTypeClick={addField}
              onFieldTypeDragStart={handleFieldTypeDragStart}
            />

            {/* Área de construção */}
            <div
              className="flex-1"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              <div className="max-w-3xl mx-auto p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-1">
                    Campos do Formulário ({selectedFields.length})
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Arraste um tipo de campo ou clique para adicionar
                  </p>
                </div>

                {selectedFields.length === 0 ? (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Hammer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">
                        Comece a construir seu formulário
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Arraste um tipo de campo ou clique para adicionar
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedFields.map((field, index) => (
                      <div key={field.id}>
                        {/* Drop zone antes do campo */}
                        {draggedFieldType && (
                          <div
                            onDragOver={(e) =>
                              handleFieldTypeDragOver(e, index)
                            }
                            onDrop={(e) => handleFieldTypeDrop(e, index)}
                            className={cn(
                              "transition-all duration-200 rounded",
                              dragOverIndex === index
                                ? "bg-primary/20 h-12 border-2 border-dashed border-primary"
                                : "h-2"
                            )}
                          />
                        )}
                        <FormFieldEditor
                          field={field}
                          fieldTypes={FIELD_TYPES}
                          isDragging={draggedIndex === index}
                          isDragOver={
                            dragOverIndex === index &&
                            draggedIndex !== index &&
                            !draggedFieldType
                          }
                          onUpdate={(updates) => updateField(field.id, updates)}
                          onRemove={() => removeField(field.id)}
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e: React.DragEvent) =>
                            handleDragOver(e, index)
                          }
                          onDragEnd={handleDragEnd}
                        />
                      </div>
                    ))}
                    {/* Drop zone no final */}
                    {draggedFieldType && (
                      <div
                        onDragOver={(e) =>
                          handleFieldTypeDragOver(e, selectedFields.length)
                        }
                        onDrop={(e) =>
                          handleFieldTypeDrop(e, selectedFields.length)
                        }
                        className={cn(
                          "transition-all duration-200 rounded",
                          dragOverIndex === selectedFields.length
                            ? "bg-primary/20 h-12 border-2 border-dashed border-primary"
                            : "h-2"
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="h-full overflow-y-auto">
            <FormPreview
              formName={formName}
              formDescription={formDescription}
              fields={selectedFields}
              hasPassword={formPassword.length > 0}
            />
          </div>
        )}

        {activeTab === "responses" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground">Respostas recebidas...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
