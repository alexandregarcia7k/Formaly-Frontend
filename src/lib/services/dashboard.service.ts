import { apiClient } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/i18n/errors";
import { z, type SafeParseReturnType } from "zod";
import {
  dashboardStatsSchema,
  latestResponsesSchema,
  responsesOverTimeSchema,
  activitiesSchema,
  limitSchema,
  type DashboardStats,
  type LatestResponses,
  type ResponsesOverTime,
  type Activities,
  type Period,
} from "@/schemas";

/**
 * Helper para validar resposta Zod e lançar erro formatado
 */
function validateResponse<T>(result: SafeParseReturnType<unknown, T>, context: string): T {
  if (!result.success) {
    const flattened = result.error.flatten();
    const errors = [...flattened.formErrors, ...Object.values(flattened.fieldErrors).flat()];
    const errorMessage = `${context}: ${errors.join(', ')}`;
    
    // Log error for monitoring (Sentry, etc)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service (Sentry, LogRocket, etc)
      // Example: Sentry.captureException(new Error(errorMessage));
    }
    
    throw new Error(errorMessage);
  }
  return result.data;
}

/**
 * Busca estatísticas gerais do dashboard
 */
export async function getStats(): Promise<DashboardStats> {
  const response = await apiClient.get("/api/dashboard/stats");
  return validateResponse(dashboardStatsSchema.safeParse(response.data), getErrorMessage('stats'));
}

/**
 * Busca últimas respostas recebidas
 */
export async function getLatestResponses(limit: number = 10): Promise<LatestResponses> {
  const limitResult = limitSchema.safeParse(limit);
  if (!limitResult.success) {
    throw new Error(`Limite inválido: ${limit}`);
  }
  
  const response = await apiClient.get("/api/dashboard/latest-responses", {
    params: { limit: limitResult.data },
  });
  
  const validated = validateResponse(latestResponsesSchema.safeParse(response.data), getErrorMessage('responses'));
  return validated.data;
}

/**
 * Busca dados de respostas ao longo do tempo
 */
export async function getResponsesOverTime(period: Period = "30d"): Promise<ResponsesOverTime> {
  const response = await apiClient.get("/api/dashboard/responses-over-time", {
    params: { period },
  });
  
  const validated = validateResponse(responsesOverTimeSchema.safeParse(response.data), getErrorMessage('chart'));
  return validated.data;
}

/**
 * Busca atividades recentes
 */
export async function getActivities(limit: number = 10): Promise<Activities> {
  const limitResult = limitSchema.safeParse(limit);
  if (!limitResult.success) {
    throw new Error(`Limite inválido: ${limit}`);
  }
  
  const response = await apiClient.get("/api/dashboard/activities", {
    params: { limit: limitResult.data },
  });
  
  const validated = validateResponse(activitiesSchema.safeParse(response.data), getErrorMessage('activities'));
  return validated.data;
}

/**
 * @deprecated Use named exports instead
 * Mantido para compatibilidade com código existente
 */
export const DashboardService = {
  getStats,
  getLatestResponses,
  getResponsesOverTime,
  getActivities,
};
