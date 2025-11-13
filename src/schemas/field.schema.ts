import { z } from "zod";

// Tipos de campo
export const fieldTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
  "time",
  "datetime",
  "url",
  "tel",
]);

// Campo base (client-side validation)
export const formFieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string().min(1, "Label é obrigatório").max(100, "Label muito longo"),
  placeholder: z.string().max(200, "Placeholder muito longo").optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  fieldType: z.string().optional(), // Tipo pré-definido do backend
});

// Tipos inferidos
export type FieldType = z.infer<typeof fieldTypeSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
