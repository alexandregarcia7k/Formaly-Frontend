/**
 * Cliente HTTP para comunicação com o backend
 * Base URL: http://localhost:3333 (desenvolvimento)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp?: string;
  path?: string;
}

/**
 * Cliente HTTP com suporte a autenticação automática
 */
export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Adicionar headers customizados se existirem
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Adicionar token se existir e não for um endpoint público
    if (token && !endpoint.startsWith("/f/")) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Se resposta for 204 (No Content), retornar vazio
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          statusCode: response.status,
          message: data.message || "Erro desconhecido",
          error: data.error || "UNKNOWN_ERROR",
          timestamp: data.timestamp,
          path: data.path,
        } as ApiError;
      }

      return data;
    } catch (error) {
      // Se for um erro da API, propagar
      if ((error as ApiError).statusCode) {
        throw error;
      }

      // Erro de rede ou outro
      throw {
        statusCode: 0,
        message: "Erro de conexão com o servidor",
        error: "NETWORK_ERROR",
      } as ApiError;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Salva o token de autenticação
   */
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  /**
   * Remove o token de autenticação
   */
  static clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
}
