import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ⚠️ OBRIGATÓRIO para cookies HTTP-only
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado ou inválido - retornar erro para ser tratado no componente
    return Promise.reject(error);
  }
);
