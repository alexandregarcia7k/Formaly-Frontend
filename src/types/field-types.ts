/**
 * Tipos de campos suportados pelo backend e frontend
 * FONTE ÚNICA DE VERDADE - Não duplicar em outros arquivos
 */
export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

/**
 * Verifica se um tipo é válido
 */
export function isValidFieldType(type: string): type is FieldType {
  return [
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
  ].includes(type);
}
