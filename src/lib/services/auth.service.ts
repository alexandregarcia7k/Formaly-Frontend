import { apiClient } from "@/lib/api/client";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  syncOAuthSchema,
  authResponseSchema,
  type RegisterDto,
  type LoginDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
  type SyncOAuthDto,
  type User,
} from "@/schemas";

/**
 * Service de autenticação
 * Gerencia todas as operações de auth com validação Zod
 * JWT em cookies httpOnly (withCredentials: true)
 */
export class AuthService {
  /**
   * Registra novo usuário
   * POST /api/auth/register
   */
  static async register(data: RegisterDto): Promise<User> {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.post<{ user: User }>("/api/auth/register", validated.data);
    const parsed = authResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data.user;
  }

  /**
   * Faz login
   * POST /api/auth/login
   */
  static async login(data: LoginDto): Promise<User> {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.post<{ user: User }>("/api/auth/login", validated.data);
    const parsed = authResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data.user;
  }

  /**
   * Faz logout
   * POST /api/auth/logout
   */
  static async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  }

  /**
   * Busca dados do usuário autenticado
   * GET /api/auth/me
   */
  static async getMe(): Promise<User> {
    const response = await apiClient.get<{ user: User }>("/api/auth/me");
    const parsed = authResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data.user;
  }

  /**
   * Sincroniza usuário OAuth
   * POST /api/auth/sync
   */
  static async syncOAuth(data: SyncOAuthDto): Promise<User> {
    const validated = syncOAuthSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    const response = await apiClient.post<{ user: User }>("/api/auth/sync", validated.data);
    const parsed = authResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      throw new Error("Resposta inválida do servidor");
    }

    return parsed.data.user;
  }

  /**
   * Solicita recuperação de senha
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(email: string): Promise<void> {
    const validated = forgotPasswordSchema.safeParse({ email });
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    await apiClient.post("/api/auth/forgot-password", validated.data);
  }

  /**
   * Redefine senha com token
   * POST /api/auth/reset-password
   */
  static async resetPassword(data: ResetPasswordDto): Promise<void> {
    const validated = resetPasswordSchema.safeParse(data);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    await apiClient.post("/api/auth/reset-password", validated.data);
  }
}
