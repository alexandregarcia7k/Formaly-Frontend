import { z } from "zod";

// Schema dinâmico para validação de respostas baseado no tipo de campo
export const createResponseSchema = (fields: Array<{ id: string; type: string; required: boolean; label: string }>) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Email inválido");
        break;
      case "url":
        fieldSchema = z.string().url("URL inválida");
        break;
      case "number":
        fieldSchema = z.coerce.number({ invalid_type_error: "Deve ser um número" });
        break;
      case "tel":
        fieldSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, "Telefone inválido");
        break;
      case "date":
      case "time":
      case "datetime":
        fieldSchema = z.string().min(1, "Data/hora é obrigatória");
        break;
      case "checkbox":
        fieldSchema = z.array(z.string()).min(field.required ? 1 : 0, `Selecione pelo menos uma opção`);
        break;
      default:
        fieldSchema = z.string();
    }

    // Aplicar required
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

// Tipo inferido
export type FormResponse = Record<string, string | number | string[] | null>;
