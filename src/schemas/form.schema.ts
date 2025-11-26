import { z } from "zod";
import { formStatusSchema, uuidSchema, dateSchema } from "./common.schema";
import { fieldSchema, fieldResponseSchema } from "./field.schema";

// ============================================================================
// FORM SCHEMAS - Validação de formulários
// ============================================================================

/**
 * Schema de criação de formulário
 * POST /api/forms
 */
export const createFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres").max(50, "Senha muito longa").optional(),
  maxResponses: z.number().int().positive("Máximo de respostas deve ser positivo").optional(),
  expiresAt: z.coerce.date().optional(),
  allowMultipleSubmissions: z.boolean().default(true),
  fields: z.array(fieldSchema).min(1, "Formulário deve ter pelo menos 1 campo"),
});

/**
 * Schema de atualização de formulário
 * PUT /api/forms/:id
 */
export const updateFormSchema = createFormSchema.partial().extend({
  status: formStatusSchema.optional(),
});

/**
 * Schema de resposta de formulário (response da API)
 */
export const formResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  description: z.string().nullable(),
  status: formStatusSchema,
  isPublic: z.boolean(),
  hasPassword: z.boolean(),
  totalResponses: z.number().int(),
  totalViews: z.number().int(),
  lastResponseAt: z.coerce.date().nullable(),
  maxResponses: z.number().int().nullable(),
  expiresAt: z.coerce.date().nullable(),
  allowMultipleSubmissions: z.boolean(),
  fields: z.array(fieldResponseSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Schema de listagem de formulários (sem fields)
 */
export const formListItemSchema = formResponseSchema.omit({ fields: true });

/**
 * Schema de query params para listagem
 * GET /api/forms
 */
export const formListQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(15),
  search: z.string().optional(),
  searchIn: z.enum(["form", "responses", "all"]).optional().default("form"),
  status: z.enum(["active", "inactive", "all"]).optional().default("all"),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "totalResponses"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
}).optional().default({});

/**
 * Schema de resposta paginada
 */
export const paginatedFormsSchema = z.object({
  data: z.array(formListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// ============================================================================
// TIPOS INFERIDOS
// ============================================================================

export type CreateFormDto = z.infer<typeof createFormSchema>;
export type UpdateFormDto = z.infer<typeof updateFormSchema>;
export type FormResponse = z.infer<typeof formResponseSchema>;
export type FormListItem = z.infer<typeof formListItemSchema>;
export type FormListQuery = z.infer<typeof formListQuerySchema>;
export type PaginatedForms = z.infer<typeof paginatedFormsSchema>;
