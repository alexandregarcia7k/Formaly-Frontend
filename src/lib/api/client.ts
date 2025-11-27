import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { tokenManager } from "../token-manager";

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
 * - Adiciona token JWT do backend em todas as requests
 * - Usa Token Manager com cache para evitar múltiplas chamadas
 * @see https://axios-http.com/docs/interceptors
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Apenas no cliente (não no SSR)
    if (typeof window !== "undefined") {
      const token = await tokenManager.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
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

    // 401 - Não autenticado
    // Documentação Axios: SEMPRE propagar erro
    // Proxy lida com redirecionamento automaticamente
    if (statusCode === 401) {
      // Não mostra toast, mas DEVE propagar erro
      return Promise.reject(error);
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
