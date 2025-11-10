import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  // ⚠️ accessToken NÃO é mais retornado - agora usa cookies HTTP-only
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface SyncOAuthDTO {
  email: string;
  name: string;
  image?: string;
  provider: "google" | "github" | "facebook";
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

/**
 * Serviço de autenticação
 * ⚠️ MIGRADO PARA COOKIES HTTP-ONLY
 */
export class AuthService {
  /**
   * Registra novo usuário com email/senha
   * Cookie HTTP-only é salvo automaticamente pelo navegador
   */
  static async register(data: RegisterDTO): Promise<User> {
    const response = await api.post<AuthResponse>("/api/auth/register", data);
    // Cookie já foi salvo automaticamente ✅
    return response.data.user;
  }

  /**
   * Faz login com email/senha
   * Cookie HTTP-only é salvo automaticamente pelo navegador
   */
  static async login(data: LoginDTO): Promise<User> {
    const response = await api.post<AuthResponse>("/api/auth/login", data);
    // Cookie já foi salvo automaticamente ✅
    return response.data.user;
  }

  /**
   * Sincroniza usuário após OAuth (Google, GitHub, Facebook)
   * Cookie HTTP-only é salvo automaticamente pelo navegador
   */
  static async syncOAuth(data: SyncOAuthDTO): Promise<User> {
    const response = await api.post<AuthResponse>("/api/auth/sync", data);
    // Cookie já foi salvo automaticamente ✅
    return response.data.user;
  }

  /**
   * Faz logout
   * ⚠️ Chama backend para limpar cookie HTTP-only
   */
  static async logout(): Promise<void> {
    await api.post("/api/auth/logout");
    // Cookie foi removido pelo backend ✅
  }

  /**
   * Busca dados do usuário autenticado
   * Valida o cookie HTTP-only automaticamente
   * @throws {Error} Se o cookie for inválido ou expirado (401)
   */
  static async getMe(): Promise<User> {
    const response = await api.get<AuthResponse>("/api/auth/me");
    return response.data.user;
  }

  /**
   * Verifica se usuário está autenticado
   * ⚠️ Com cookies HTTP-only + NextAuth, a autenticação é gerenciada automaticamente
   * Use a sessão do NextAuth ou o contexto de autenticação
   */
  static isAuthenticated(): boolean {
    // Cookie HTTP-only não pode ser acessado via JavaScript
    // A autenticação é validada automaticamente pelo backend em cada requisição
    return true; // Assume autenticado, o backend validará
  }
}
