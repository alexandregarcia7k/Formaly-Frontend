"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
} from "@/components/form-builder";
import { FieldType } from "@/types/field-types";
import { useDragAndDrop, useFormMutations } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createFormSchema, updateFormSchema, type Field } from "@/schemas";

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
  const { create, update, isCreating, isUpdating } = useFormMutations();
  
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
  
  const isLoading = isCreating || isUpdating;

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
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

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

  // Observar visibilidade do botão "Novo Campo"
  useEffect(() => {
    if (!addButtonRef.current || activeTab !== "builder") {
      setShowFloatingButton(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingButton(!entry.isIntersecting && selectedFields.length > 0);
      },
      { threshold: 0.1 }
    );

    observer.observe(addButtonRef.current);
    return () => observer.disconnect();
  }, [activeTab, selectedFields.length]);

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
    setIsFieldModalOpen(false);
  };

  const removeField = (id: string) => {
    setSelectedFields(selectedFields.filter((f) => f.id !== id));
  };

  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const newFields = [...selectedFields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    setSelectedFields(newFields);
  };

  const moveFieldDown = (index: number) => {
    if (index === selectedFields.length - 1) return;
    const newFields = [...selectedFields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    setSelectedFields(newFields);
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
    // Validar campos obrigatórios
    if (!formName.trim()) {
      toast.error("Nome do formulário é obrigatório");
      return;
    }

    if (selectedFields.length === 0) {
      toast.error("Adicione pelo menos um campo ao formulário");
      return;
    }

    // Mapear campos para formato do backend
    const mappedFields: Field[] = selectedFields.map((field) => ({
      type: field.type,
      label: field.label,
      name: field.name || field.label.toLowerCase().replace(/\s+/g, "_"),
      placeholder: field.placeholder,
      required: field.required,
      config: {
        ...field.config,
        ...(field.options && { options: field.options }),
      },
    }));

    // Preparar dados
    const formData = {
      name: formName,
      description: formDescription || undefined,
      password: formPassword || undefined,
      fields: mappedFields,
      expiresAt: expiresAt || undefined,
      maxResponses: maxResponses || undefined,
      allowMultipleSubmissions,
    };

    // Validar com Zod
    const schema = mode === "edit" ? updateFormSchema : createFormSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    // Salvar
    let savedForm;
    if (mode === "edit" && initialData?.id) {
      savedForm = await update(initialData.id, result.data as any);
    } else {
      savedForm = await create(result.data as any);
    }

    if (savedForm) {
      router.push("/dashboard/forms");
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
      <div className="flex-1">
        {activeTab === "builder" && (
          <div className="flex">
            {/* Sidebar - Oculta em mobile */}
            <div className="hidden lg:block">
              <FormFieldTypes
                fieldTypes={FIELD_TYPES}
                onFieldTypeClick={addField}
                onFieldTypeDragStart={handleFieldTypeDragStart}
              />
            </div>

            {/* Área de construção */}
            <div
              className="flex-1 bg-background"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                {selectedFields.length === 0 && (
                  <div className="border-2 border-dashed border-muted-foreground/30 bg-muted/20 rounded-lg p-8 sm:p-12 text-center space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">
                      <span className="hidden lg:inline">
                        Arraste campos da barra lateral ou clique neles para adicionar
                      </span>
                      <span className="lg:hidden">
                        Clique no botão abaixo para adicionar campos
                      </span>
                    </p>
                    <Button onClick={() => setIsFieldModalOpen(true)} size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Campo
                    </Button>
                  </div>
                )}

                {/* Lista de campos */}
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {selectedFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -100 }}
                        transition={{
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 },
                        }}
                      >
                        <FormFieldEditor
                          field={field}
                          fieldTypes={FIELD_TYPES}
                          isDragging={draggedIndex === index}
                          isDragOver={dragOverIndex === index}
                          onUpdate={(updates) => updateField(field.id, updates)}
                          onRemove={() => removeField(field.id)}
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          onMoveUp={() => moveFieldUp(index)}
                          onMoveDown={() => moveFieldDown(index)}
                          isFirst={index === 0}
                          isLast={index === selectedFields.length - 1}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Botão para adicionar mais campos */}
                  {selectedFields.length > 0 && (
                    <Button 
                      ref={addButtonRef}
                      onClick={() => setIsFieldModalOpen(true)} 
                      variant="outline" 
                      size="lg"
                      className="w-full border-dashed border-2 h-12"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Campo
                    </Button>
                  )}
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
            isActive={isActive}
            setIsActive={setIsActive}
          />
        )}
      </div>

      {/* Botão flutuante - Aparece quando botão principal não está visível */}
      <AnimatePresence>
        {showFloatingButton && activeTab === "builder" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsFieldModalOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de seleção de campos */}
      <Dialog open={isFieldModalOpen} onOpenChange={setIsFieldModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Campo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {FIELD_TYPES.map((field) => (
              <button
                key={field.type}
                onClick={() => addField(field.type)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group border"
              >
                <div className="flex items-start gap-3">
                  <field.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{field.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {field.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
