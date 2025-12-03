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
   * Backend retorna: { user: User, accessToken: string }
   */
  static async register(data: RegisterDto): Promise<User> {
    const response = await apiClient.post<{ user: User; accessToken: string }>(
      "/api/auth/register",
      data
    );
    
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
    const response = await apiClient.post<{ user: User }>("/api/auth/login", data);
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
    const response = await apiClient.post<{ user: User }>("/api/auth/sync", data);
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
    await apiClient.post("/api/auth/forgot-password", { email });
  }

  /**
   * Redefine senha com token
   * POST /api/auth/reset-password
   */
  static async resetPassword(data: ResetPasswordDto): Promise<void> {
    await apiClient.post("/api/auth/reset-password", data);
  }
}
