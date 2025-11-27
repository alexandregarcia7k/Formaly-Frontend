import { apiClient } from "@/lib/api/client";
import {
  authResponseSchema,
  type RegisterDto,
  type ResetPasswordDto,
  type User,
} from "@/schemas";

/**
 * Service de autenticação
 * Apenas register e password reset (login/logout via Auth.js)
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
