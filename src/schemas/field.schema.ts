import { z } from "zod";
import { uuidSchema } from "./common.schema";

// Tipos de campo (conforme API backend)
export const fieldTypeSchema = z.enum([
  "text",
  "email",
  "phone",
  "textarea",
  "number",
  "date",
  "select",
  "radio",
  "checkbox",
  "file",
]);

// Config do campo
export const fieldConfigSchema = z.object({
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().max(200).optional(),
}).optional();

// Campo para criação (request)
export const fieldSchema = z.object({
  type: fieldTypeSchema,
  label: z.string().min(1, "Label é obrigatório").max(200, "Label muito longo"),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  placeholder: z.string().max(200, "Placeholder muito longo").optional(),
  required: z.boolean().default(false),
  config: fieldConfigSchema,
});

// Campo completo (response com id)
export const fieldResponseSchema = fieldSchema.extend({
  id: uuidSchema,
});

// Tipos inferidos
export type FieldType = z.infer<typeof fieldTypeSchema>;
export type FieldConfig = z.infer<typeof fieldConfigSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type FieldResponse = z.infer<typeof fieldResponseSchema>;
