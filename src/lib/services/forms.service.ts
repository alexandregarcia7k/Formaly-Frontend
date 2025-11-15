import { FormField } from "@/components/form-builder";

// ===== INTERFACES =====

export interface CreateFormFieldDTO {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  config?: Record<string, unknown>;
}

export interface CreateFormDTO {
  name: string;
  description?: string;
  password?: string;
  maxResponses?: number;
  expiresAt?: Date;
  allowMultipleSubmissions?: boolean;
  successMessage?: string;
  fields: CreateFormFieldDTO[];
}

export interface UpdateFormDTO {
  name?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  password?: string;
  maxResponses?: number;
  expiresAt?: Date;
  allowMultipleSubmissions?: boolean;
  successMessage?: string;
  fields?: CreateFormFieldDTO[];
}

export interface FormFieldResponse {
  id: string;
  formId: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  config: Record<string, unknown> | null;
}

export interface FormResponse {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  maxResponses: number | null;
  expiresAt: string | null;
  allowMultipleSubmissions: boolean;
  successMessage: string | null;
  createdAt: string;
  updatedAt: string;
  fields: FormFieldResponse[];
  _count: {
    submissions: number;
  };
}

export interface FormsListResponse {
  data: FormResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// TODO: Implementar chamadas reais de API
export class FormsService {
  /**
   * Cria um novo formulário
   * TODO: POST /forms
   */
  static async createForm(data: CreateFormDTO): Promise<FormResponse> {
    throw new Error("Not implemented - POST /forms");
  }

  /**
   * Lista formulários do usuário (paginado)
   * TODO: GET /forms?page={page}
   */
  static async listForms(page: number = 1): Promise<FormsListResponse> {
    throw new Error("Not implemented - GET /forms");
  }

  /**
   * Busca um formulário específico
   * TODO: GET /forms/:id
   */
  static async getForm(id: string): Promise<FormResponse> {
    throw new Error("Not implemented - GET /forms/:id");
  }

  /**
   * Atualiza um formulário existente
   * TODO: PUT /forms/:id
   */
  static async updateForm(
    id: string,
    data: UpdateFormDTO
  ): Promise<FormResponse> {
    throw new Error("Not implemented - PUT /forms/:id");
  }

  /**
   * Deleta um formulário
   * TODO: DELETE /forms/:id
   */
  static async deleteForm(id: string): Promise<void> {
    throw new Error("Not implemented - DELETE /forms/:id");
  }

  /**
   * Clona um formulário existente
   * TODO: POST /forms/:id/clone
   */
  static async cloneForm(id: string): Promise<FormResponse> {
    throw new Error("Not implemented - POST /forms/:id/clone");
  }

  /**
   * Converte campos do formato do backend para o formato do frontend
   */
  static mapFieldsToFrontend(
    fields: FormFieldResponse[] | undefined
  ): FormField[] {
    if (!fields || !Array.isArray(fields)) {
      return [];
    }
    return fields.map((field) => ({
      id: field.id,
      type: field.type as FormField["type"],
      label: field.label,
      placeholder: (field.config?.placeholder as string) || "",
      required: field.required,
      options: field.config?.options as string[] | undefined,
      fieldType: field.type,
    }));
  }

  /**
   * Converte campos do formato do frontend para o formato do backend
   */
  static mapFieldsToBackend(fields: FormField[]): CreateFormFieldDTO[] {
    return fields.map((field) => {
      const dto: CreateFormFieldDTO = {
        type: field.type,
        label: field.label,
        name: field.label.toLowerCase().replace(/\s+/g, "_"),
        required: field.required,
      };

      // Adicionar placeholder se existir
      if (field.placeholder) {
        dto.placeholder = field.placeholder;
      }

      // Adicionar config com options se existir
      if (field.options && field.options.length > 0) {
        dto.config = {
          options: field.options,
        };
      }

      return dto;
    });
  }
}
