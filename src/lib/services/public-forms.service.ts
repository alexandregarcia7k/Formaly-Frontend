import { api } from "@/lib/api";

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
  password?: string;
  respondentEmail?: string;
  respondentName?: string;
  values: Record<string, unknown>;
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
    const response = await api.get<PublicFormResponse>(`/f/${formId}`);
    return response.data;
  }

  /**
   * Valida senha do formulário protegido
   */
  static async validatePassword(
    formId: string,
    password: string
  ): Promise<ValidatePasswordResponse> {
    const response = await api.post<ValidatePasswordResponse>(
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
    const response = await api.post<SubmitFormResponse>(
      `/f/${formId}/submit`,
      data
    );
    return response.data;
  }
}
