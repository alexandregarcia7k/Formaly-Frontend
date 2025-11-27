/**
 * Token Manager
 * Gerencia o token JWT do backend com cache
 * Evita múltiplas chamadas para /api/auth/session
 */

class TokenManager {
  private token: string | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtém o token do backend (com cache)
   */
  async getToken(forceRefresh = false): Promise<string | null> {
    const now = Date.now();

    // Se tem cache válido e não é refresh forçado, retorna
    if (!forceRefresh && this.token && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.token;
    }

    // Busca nova sessão
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store", // Força buscar sessão atualizada
      });
      if (!response.ok) {
        this.clearToken();
        return null;
      }

      const session = await response.json();
      this.token = session?.backendToken || null;
      this.lastFetch = now;

      return this.token;
    } catch {
      this.clearToken();
      return null;
    }
  }

  /**
   * Limpa o cache do token
   */
  clearToken(): void {
    this.token = null;
    this.lastFetch = 0;
  }

  /**
   * Define o token manualmente (após login)
   */
  setToken(token: string): void {
    this.token = token;
    this.lastFetch = Date.now();
  }
}

// Singleton
export const tokenManager = new TokenManager();
