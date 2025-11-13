import { z } from "zod";
import { formStatusSchema, uuidSchema, dateSchema } from "./common.schema";
import { formFieldSchema } from "./field.schema";

// Settings do formulário (client-side validation)
export const formSettingsSchema = z.object({
  hasPassword: z.boolean().default(false),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres").max(8, "Senha deve ter no máximo 8 caracteres").nullable(),
  successMessage: z.string().max(500, "Mensagem muito longa").nullable(),
  allowMultipleSubmissions: z.boolean().default(true),
}).refine(
  (data) => !data.hasPassword || data.password,
  { message: "Senha é obrigatória quando formulário é protegido", path: ["password"] }
);

// Formulário completo (para validação de dados recebidos)
export const formSchema = z.object({
  id: uuidSchema,
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").nullable(),
  status: formStatusSchema,
  fields: z.array(formFieldSchema).min(1, "Formulário deve ter pelo menos 1 campo"),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Schema para criação (client-side)
export const createFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").nullable(),
  fields: z.array(formFieldSchema).min(1, "Formulário deve ter pelo menos 1 campo"),
  settings: formSettingsSchema.nullable(),
});

// Schema para atualização (tudo opcional exceto settings que já é nullable)
export const updateFormSchema = createFormSchema.partial();

// Tipos inferidos
export type FormSettings = z.infer<typeof formSettingsSchema>;
export type Form = z.infer<typeof formSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
