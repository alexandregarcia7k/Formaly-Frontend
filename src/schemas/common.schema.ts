import { z } from "zod";

// UUID
export const uuidSchema = z.string().uuid();

// Status do formulário
export const formStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

// Datas
export const dateSchema = z.coerce.date();

// Paginação
export const paginationSchema = z.object({
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalItems: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
});

// Tipos inferidos
export type FormStatus = z.infer<typeof formStatusSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
