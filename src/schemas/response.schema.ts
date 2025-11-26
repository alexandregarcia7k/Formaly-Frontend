import { z } from "zod";
import { uuidSchema } from "./common.schema";

// ============================================================================
// SUBMISSION SCHEMAS - Validação de respostas de formulários
// ============================================================================

/**
 * Schema de valor de campo na resposta
 */
export const submissionValueSchema = z.object({
  fieldId: uuidSchema,
  type: z.string(),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

/**
 * Schema de resposta de formulário (submission)
 */
export const submissionSchema = z.object({
  id: uuidSchema,
  formId: uuidSchema,
  ipAddress: z.string(),
  userAgent: z.string(),
  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
  timeSpent: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  values: z.array(submissionValueSchema),
}).transform((data) => ({
  ...data,
  isCompleted: !!data.completedAt,
  startedAt: data.startedAt || data.createdAt,
}));

/**
 * Schema de query params para submissions
 * GET /api/forms/:id/submissions
 */
export const submissionQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

/**
 * Schema de resposta paginada de submissions
 */
export const paginatedSubmissionsSchema = z.object({
  data: z.array(submissionSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

import { FieldType } from "@/types/field-types";

/**
 * Schema dinâmico para validação de respostas baseado no tipo de campo
 */
export const createResponseSchema = (fields: Array<{ id: string; type: FieldType; required: boolean; label: string }>) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Email inválido");
        break;
      case "phone":
        fieldSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, "Telefone inválido");
        break;
      case "number":
        fieldSchema = z.coerce.number({ invalid_type_error: "Deve ser um número" });
        break;
      case "date":
        fieldSchema = z.string().min(1, "Data é obrigatória");
        break;
      case "checkbox":
        fieldSchema = z.array(z.string()).min(field.required ? 1 : 0, `Selecione pelo menos uma opção`);
        break;
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      if (field.type === "checkbox") {
        shape[field.id] = fieldSchema;
      } else if (field.type === "number") {
        shape[field.id] = fieldSchema;
      } else {
        shape[field.id] = (fieldSchema as z.ZodString).min(1, `${field.label} é obrigatório`);
      }
    } else {
      shape[field.id] = fieldSchema.nullable();
    }
  });

  return z.object(shape);
};

// ============================================================================
// TIPOS INFERIDOS
// ============================================================================

export type SubmissionValue = z.infer<typeof submissionValueSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
export type PaginatedSubmissions = z.infer<typeof paginatedSubmissionsSchema>;
export type FormResponseData = Record<string, string | number | string[] | null>;
