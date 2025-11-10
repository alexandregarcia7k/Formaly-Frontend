"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormBuilderContainer } from "@/components/form-builder";
import { FormField } from "@/components/form-builder";
import { FormsService } from "@/lib/services/forms.service";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    description: string;
    password?: string;
    fields: FormField[];
    expiresAt?: Date | null;
    maxResponses?: number | null;
    allowMultipleSubmissions?: boolean;
    successMessage?: string;
  } | null>(null);

  useEffect(() => {
    // Buscar dados do formulário
    const fetchFormData = async () => {
      try {
        setIsLoading(true);

        // Buscar da API real
        const response = await FormsService.getForm(id);

        // Converter campos do backend para o formato do frontend
        const frontendFields = FormsService.mapFieldsToFrontend(
          response.fields
        );

        setFormData({
          id: response.id,
          name: response.name,
          description: response.description || "",
          password: undefined, // Nunca retornar senha do backend (apenas hash)
          fields: frontendFields,
          // Configurações avançadas
          expiresAt: response.expiresAt ? new Date(response.expiresAt) : null,
          maxResponses: response.maxResponses,
          allowMultipleSubmissions: response.allowMultipleSubmissions,
          successMessage: response.successMessage || "",
        });
      } catch (error) {
        toast.error("Erro ao carregar formulário");
        setFormData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={Loader2}
          title="Carregando formulário..."
          variant="default"
          className="border-0 bg-transparent"
        />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={AlertCircle}
          title="Formulário não encontrado"
          description="O formulário que você está tentando editar não existe."
          variant="default"
          action={
            <Button onClick={() => router.push("/dashboard/forms")}>
              Voltar para Formulários
            </Button>
          }
          className="border-0 bg-transparent"
        />
      </div>
    );
  }

  return <FormBuilderContainer mode="edit" initialData={formData} />;
}
