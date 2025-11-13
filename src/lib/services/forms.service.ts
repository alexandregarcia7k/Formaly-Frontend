// Mock Forms Service - Substitui todas as chamadas de API por dados mockados
import { MOCK_FORMS, MOCK_USER, mockDelay } from "@/lib/mock-data";
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

// ===== MOCK SERVICE =====

// Estado local mutável para simular persistência durante a sessão
const mockForms = [...MOCK_FORMS];
export class FormsService {
  /**
   * Cria um novo formulário (MOCK)
   */
  static async createForm(data: CreateFormDTO): Promise<FormResponse> {
    await mockDelay(500);

    const newForm: FormResponse = {
      id: `form-${Date.now()}`,
      userId: MOCK_USER.id,
      name: data.name,
      description: data.description || null,
      status: "ACTIVE",
      maxResponses: data.maxResponses || null,
      expiresAt: data.expiresAt?.toISOString() || null,
      allowMultipleSubmissions: data.allowMultipleSubmissions ?? false,
      successMessage: data.successMessage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: data.fields.map((field, index) => ({
        id: `field-${Date.now()}-${index}`,
        formId: `form-${Date.now()}`,
        type: field.type,
        label: field.label,
        name: field.name,
        required: field.required,
        config: field.config || null,
      })),
      _count: {
        submissions: 0,
      },
    };

    mockForms.unshift(newForm); // Adicionar no início (mais recente)
    return newForm;
  }

  /**
   * Lista formulários do usuário (paginado) (MOCK)
   */
  static async listForms(page: number = 1): Promise<FormsListResponse> {
    await mockDelay(400);

    const limit = 10;
    const total = mockForms.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: mockForms.slice(start, end),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Busca um formulário específico (MOCK)
   */
  static async getForm(id: string): Promise<FormResponse> {
    await mockDelay(300);

    const form = mockForms.find((f) => f.id === id);
    if (!form) {
      throw new Error("Formulário não encontrado");
    }
    return form;
  }

  /**
   * Atualiza um formulário existente (MOCK)
   */
  static async updateForm(
    id: string,
    data: UpdateFormDTO
  ): Promise<FormResponse> {
    await mockDelay(400);

    const formIndex = mockForms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Formulário não encontrado");
    }

    const updatedForm = {
      ...mockForms[formIndex],
      name: data.name ?? mockForms[formIndex].name,
      description: data.description ?? mockForms[formIndex].description,
      status: data.status ?? mockForms[formIndex].status,
      maxResponses: data.maxResponses ?? mockForms[formIndex].maxResponses,
      expiresAt: data.expiresAt
        ? data.expiresAt.toISOString()
        : mockForms[formIndex].expiresAt,
      allowMultipleSubmissions:
        data.allowMultipleSubmissions ??
        mockForms[formIndex].allowMultipleSubmissions,
      successMessage: data.successMessage ?? mockForms[formIndex].successMessage,
      updatedAt: new Date().toISOString(),
      fields:
        data.fields?.map((field, index) => ({
          id: `field-${Date.now()}-${index}`,
          formId: id,
          type: field.type,
          label: field.label,
          name: field.name,
          required: field.required,
          config: field.config || null,
        })) || mockForms[formIndex].fields,
    };

    mockForms[formIndex] = updatedForm;
    return updatedForm;
  }

  /**
   * Deleta um formulário (MOCK)
   */
  static async deleteForm(id: string): Promise<void> {
    await mockDelay(300);

    const formIndex = mockForms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error("Formulário não encontrado");
    }

    mockForms.splice(formIndex, 1);
  }

  /**
   * Clona um formulário existente (MOCK)
   */
  static async cloneForm(id: string): Promise<FormResponse> {
    await mockDelay(500);

    const original = mockForms.find((f) => f.id === id);
    if (!original) {
      throw new Error("Formulário não encontrado");
    }

    const clonedForm: FormResponse = {
      ...original,
      id: `form-${Date.now()}`,
      name: `${original.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: original.fields.map((field, index) => ({
        ...field,
        id: `field-${Date.now()}-${index}`,
        formId: `form-${Date.now()}`,
      })),
      _count: {
        submissions: 0,
      },
    };

    mockForms.unshift(clonedForm);
    return clonedForm;
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
