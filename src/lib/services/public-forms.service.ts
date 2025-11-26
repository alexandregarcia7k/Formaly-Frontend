import { apiClient } from "@/lib/api/client";

export interface PublicFormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  config: {
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    options?: string[];
    [key: string]: unknown;
  };
}

export interface PublicFormResponse {
  id: string;
  name: string;
  description: string | null;
  successMessage: string | null;
  requiresPassword: boolean;
  fields: PublicFormField[];
}

export interface ValidatePasswordRequest {
  password: string;
}

export interface ValidatePasswordResponse {
  valid: boolean;
}

export interface SubmitFormRequest {
  values: Record<string, unknown>;
  password?: string;
  metadata?: {
    startedAt?: string;
    completedAt?: string;
    timeSpent?: number;
  };
}

export interface SubmitFormResponse {
  id: string;
  message: string;
}

/**
 * Serviço para formulários públicos (sem autenticação)
 */
export class PublicFormsService {
  /**
   * Visualiza formulário público
   */
  static async getPublicForm(formId: string): Promise<PublicFormResponse> {
    const response = await apiClient.get<PublicFormResponse>(`/f/${formId}`);
    return response.data;
  }

  /**
   * Valida senha do formulário protegido
   */
  static async validatePassword(
    formId: string,
    password: string
  ): Promise<ValidatePasswordResponse> {
    const response = await apiClient.post<ValidatePasswordResponse>(
      `/f/${formId}/validate-password`,
      { password }
    );
    return response.data;
  }

  /**
   * Envia resposta do formulário
   */
  static async submitForm(
    formId: string,
    data: SubmitFormRequest
  ): Promise<SubmitFormResponse> {
    const response = await apiClient.post<SubmitFormResponse>(
      `/f/${formId}/submit`,
      data
    );
    return response.data;
  }
}
