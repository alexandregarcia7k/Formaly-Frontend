import { z } from "zod";

/**
 * Schema para usuário
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});

/**
 * Schema para resposta de autenticação
 */
export const authResponseSchema = z.object({
  user: userSchema,
});

/**
 * Schema para login
 * Transformações ANTES de validações (consistente com registerSchema)
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

/**
 * Schema para registro (alinhado com backend)
 * Transformações ANTES de validações (Zod best practice)
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string({ required_error: "Email é obrigatório" })
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  confirmPassword: z.string({ required_error: "Confirmação de senha é obrigatória" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

/**
 * Schema para recuperação de senha
 * Transformações ANTES de validações (consistente com loginSchema)
 */
export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
});

/**
 * Schema para redefinição de senha (alinhado com backend)
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
});

/**
 * Schema para sincronização OAuth
 */
export const syncOAuthSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  provider: z.enum(["google", "github"]),
  providerId: z.string(),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = Omit<z.infer<typeof registerSchema>, "confirmPassword">;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type SyncOAuthDto = z.infer<typeof syncOAuthSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
