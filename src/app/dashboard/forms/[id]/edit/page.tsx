"use client";

import { use, useEffect, useState } from "react";
import { FormBuilderContainer } from "@/components/form-builder";
import { FormField } from "@/components/form-builder";
import { FormsService } from "@/lib/services/forms.service";

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const { id } = use(params);
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

        // TODO: Substituir por chamada real à API
        // const response = await FormsService.getFormById(id);

        // Mock data temporário
        const mockData = {
          id,
          name: "Cadastro de Clientes",
          description: "Formulário para novos clientes",
          password: "senha123",
          fields: [
            {
              id: "field-1",
              type: "text" as const,
              label: "Nome Completo",
              placeholder: "Digite seu nome",
              required: true,
            },
            {
              id: "field-2",
              type: "email" as const,
              label: "E-mail",
              placeholder: "seu@email.com",
              required: true,
            },
            {
              id: "field-3",
              type: "phone" as const,
              label: "Telefone",
              placeholder: "(00) 00000-0000",
              required: false,
            },
            {
              id: "field-4",
              type: "select" as const,
              label: "Como nos conheceu?",
              placeholder: "Selecione uma opção",
              required: true,
              options: ["Google", "Redes Sociais", "Indicação", "Outro"],
            },
          ] as FormField[],
          // Configurações avançadas
          expiresAt: new Date("2024-12-31T23:59:59"),
          maxResponses: 100,
          allowMultipleSubmissions: false,
          successMessage:
            "Obrigado por se cadastrar! Entraremos em contato em breve.",
        };

        setFormData(mockData);
      } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        // TODO: Adicionar toast de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Formulário não encontrado</h2>
          <p className="text-muted-foreground">
            O formulário que você está tentando editar não existe.
          </p>
        </div>
      </div>
    );
  }

  return <FormBuilderContainer mode="edit" initialData={formData} />;
}
