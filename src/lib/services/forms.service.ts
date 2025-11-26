import { apiClient } from "@/lib/api/client";
import {
  createFormSchema,
  updateFormSchema,
  formResponseSchema,
  paginatedFormsSchema,
  formListQuerySchema,
  paginatedSubmissionsSchema,
  submissionQuerySchema,
  uuidSchema,
  type CreateFormDto,
  type UpdateFormDto,
  type FormResponse,
  type PaginatedForms,
  type FormListQuery,
  type PaginatedSubmissions,
  type SubmissionQuery,
} from "@/schemas";

// Re-export types for compatibility
export type { FormResponse, CreateFormDto, UpdateFormDto };

/**
 * Service de formulários
 * Gerencia CRUD de formulários com validação Zod
 */
export class FormsService {
  /**
   * Cria novo formulário
   * POST /api/forms
   */
  static async create(data: CreateFormDto): Promise<FormResponse> {
    const validated = createFormSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.post<FormResponse>("/api/forms", validated.data);
    const parsed = formResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data;
  }

  /**
   * Lista formulários
   * GET /api/forms
   */
  static async getAll(query?: FormListQuery): Promise<PaginatedForms> {
    const validated = formListQuerySchema.safeParse(query || {});
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.get<PaginatedForms>("/api/forms", { params: validated.data });
    const parsed = paginatedFormsSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data;
  }

  /**
   * Busca formulário por ID
   * GET /api/forms/:id
   */
  static async getById(id: string): Promise<FormResponse> {
    const validated = uuidSchema.safeParse(id);
    if (!validated.success) {
      throw new Error("ID inválido");
    }

    const response = await apiClient.get<FormResponse>(`/api/forms/${validated.data}`);
    const parsed = formResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data;
  }

  /**
   * Atualiza formulário
   * PUT /api/forms/:id
   */
  static async update(id: string, data: UpdateFormDto): Promise<FormResponse> {
    const validatedId = uuidSchema.safeParse(id);
    if (!validatedId.success) {
      throw new Error("ID inválido");
    }

    const validated = updateFormSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.put<FormResponse>(`/api/forms/${validatedId.data}`, validated.data);
    const parsed = formResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data;
  }

  /**
   * Deleta formulário
   * DELETE /api/forms/:id
   */
  static async delete(id: string): Promise<void> {
    const validated = uuidSchema.safeParse(id);
    if (!validated.success) {
      throw new Error("ID inválido");
    }

    await apiClient.delete(`/api/forms/${validated.data}`);
  }

  /**
   * Clona formulário
   * POST /api/forms/:id/clone
   */
  static async clone(id: string): Promise<FormResponse> {
    const validated = uuidSchema.safeParse(id);
    if (!validated.success) {
      throw new Error("ID inválido");
    }

    const response = await apiClient.post<FormResponse>(`/api/forms/${validated.data}/clone`);
    const parsed = formResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data;
  }

  /**
   * Busca respostas do formulário
   * GET /api/forms/:id/submissions
   */
  static async getSubmissions(id: string, query?: SubmissionQuery): Promise<PaginatedSubmissions> {
    const validatedId = uuidSchema.safeParse(id);
    if (!validatedId.success) {
      throw new Error("ID inválido");
    }

    const validated = submissionQuerySchema.safeParse(query || {});
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.get<PaginatedSubmissions>(`/api/forms/${validatedId.data}/submissions`, { params: validated.data });
    
    const parsed = paginatedSubmissionsSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error(`Erro de validação: ${parsed.error.errors[0].message}`);
    }

    return parsed.data;
  }

  // ============================================================================
  // Métodos de compatibilidade (legacy)
  // ============================================================================

  /** @deprecated Use create() */
  static async createForm(data: CreateFormDto): Promise<FormResponse> {
    return this.create(data);
  }

  /** @deprecated Use getAll() */
  static async listForms(page: number = 1): Promise<PaginatedForms> {
    return this.getAll({ page, pageSize: 15, searchIn: "form", status: "all", sortBy: "createdAt", sortOrder: "desc" });
  }

  /** @deprecated Use getById() */
  static async getForm(id: string): Promise<FormResponse> {
    return this.getById(id);
  }

  /** @deprecated Use update() */
  static async updateForm(id: string, data: UpdateFormDto): Promise<FormResponse> {
    return this.update(id, data);
  }

  /** @deprecated Use delete() */
  static async deleteForm(id: string): Promise<void> {
    return this.delete(id);
  }

  /** @deprecated Use clone() */
  static async cloneForm(id: string): Promise<FormResponse> {
    return this.clone(id);
  }

  /**
   * @deprecated Mapper não mais necessário - schemas já retornam tipos corretos
   * Mantido para compatibilidade com código existente
   */
  static mapFieldsToFrontend<T extends { id: string; type: string; label: string; required: boolean }>(fields: T[]): T[] {
    return fields;
  }

  /**
   * @deprecated Mapper não mais necessário - schemas já validam tipos corretos
   * Mantido para compatibilidade com código existente
   */
  static mapFieldsToBackend<T extends { type: string; label: string; required: boolean }>(fields: T[]): T[] {
    return fields;
  }
}
