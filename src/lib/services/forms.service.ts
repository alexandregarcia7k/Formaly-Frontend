import { FormField } from "@/components/form-builder";

// TODO: Configurar baseURL quando backend estiver pronto
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateFormDTO {
  name: string;
  description?: string;
  password?: string;
  fields: FormField[];
  // Configurações avançadas
  expiresAt?: Date;
  maxResponses?: number;
  allowMultipleSubmissions?: boolean;
  successMessage?: string;
}

export interface FormResponse {
  id: string;
  name: string;
  description?: string;
  publicLink: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  // Configurações avançadas
  password?: string;
  expiresAt?: string | null;
  maxResponses?: number | null;
  allowMultipleSubmissions?: boolean;
  successMessage?: string;
}

/**
 * Serviço para comunicação com API NestJS do backend
 *
 * Endpoints esperados:
 * - POST   /api/forms          - Criar formulário
 * - GET    /api/forms          - Listar formulários do usuário
 * - GET    /api/forms/:id      - Buscar formulário por ID
 * - PUT    /api/forms/:id      - Atualizar formulário
 * - DELETE /api/forms/:id      - Deletar formulário
 * - GET    /api/forms/:id/responses - Buscar respostas do formulário
 */
export class FormsService {
  /**
   * Cria um novo formulário no backend
   * Backend irá gerar o slug único e retornar o link público
   */
  static async createForm(data: CreateFormDTO): Promise<FormResponse> {
    // TODO: Implementar quando backend estiver pronto
    // const response = await fetch(`${API_URL}/api/forms`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error('Erro ao criar formulário');
    // }
    //
    // return response.json();

    // Mock temporário para desenvolvimento
    console.log("🚀 Dados que serão enviados para backend:", data);

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSlug = data.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        resolve({
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description,
          publicLink: `${window.location.origin}/f/${mockSlug}`,
          fields: data.fields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  }

  /**
   * Atualiza um formulário existente
   */
  static async updateForm(
    id: string,
    data: Partial<CreateFormDTO>
  ): Promise<FormResponse> {
    // TODO: Implementar quando backend estiver pronto
    console.log("🔄 Atualizar formulário:", id, data);
    throw new Error("Not implemented");
  }

  /**
   * Deleta um formulário
   */
  static async deleteForm(id: string): Promise<void> {
    // TODO: Implementar quando backend estiver pronto
    console.log("🗑️ Deletar formulário:", id);
    throw new Error("Not implemented");
  }

  /**
   * Lista todos os formulários do usuário
   */
  static async listForms(): Promise<FormResponse[]> {
    // TODO: Implementar quando backend estiver pronto
    console.log("📋 Listar formulários");
    return [];
  }

  /**
   * Busca um formulário específico
   */
  static async getForm(id: string): Promise<FormResponse> {
    // TODO: Implementar quando backend estiver pronto
    console.log("🔍 Buscar formulário:", id);
    throw new Error("Not implemented");
  }
}
