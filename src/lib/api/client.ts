import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

/**
 * Tipo de erro padronizado da API
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

/**
 * Cliente HTTP Axios configurado
 * - baseURL do ambiente
 * - withCredentials para cookies httpOnly
 * - Interceptors para request/response
 * - Error handling global
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * - Log de requests (dev only)
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 * - Log de responses (dev only)
 * - Error handling global
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {

    const statusCode = error.response?.status;
    const errorData = error.response?.data;

    // 401 - Não autenticado (apenas para rotas protegidas)
    if (statusCode === 401) {
      const isPublicRoute = typeof window !== "undefined" && 
        (window.location.pathname.startsWith("/f/") || 
         window.location.pathname.startsWith("/publicform/") ||
         window.location.pathname === "/" ||
         window.location.pathname === "/login");
      
      if (typeof window !== "undefined" && !isPublicRoute && !window.location.pathname.includes("/login")) {
        toast.error("Sessão expirada. Faça login novamente.");
        window.location.href = "/login";
      }
    }

    // 429 - Rate limit
    if (statusCode === 429) {
      toast.error("Muitas requisições. Aguarde um momento.");
    }

    // 500 - Erro interno
    if (statusCode && statusCode >= 500) {
      toast.error("Erro no servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  }
);

export { apiClient };
