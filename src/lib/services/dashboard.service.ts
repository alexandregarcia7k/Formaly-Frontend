import { apiClient } from "@/lib/api/client";
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
 * Helper para validar resposta Zod
 */
function validateResponse<T>(schema: any, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${context}: ${result.error.issues[0].message}`);
  }
  return result.data;
}

export async function getStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get("/api/dashboard/stats");
  return validateResponse(dashboardStatsSchema, data, "Estatísticas");
}

export async function getLatestResponses(limit: number = 10): Promise<LatestResponses> {
  const validLimit = validateResponse(limitSchema, limit, "Limite");
  const { data } = await apiClient.get("/api/dashboard/latest-responses", {
    params: { limit: validLimit },
  });
  return validateResponse(latestResponsesSchema, data.data, "Respostas");
}

export async function getResponsesOverTime(period: Period = "30d"): Promise<ResponsesOverTime> {
  const { data } = await apiClient.get("/api/dashboard/responses-over-time", {
    params: { period },
  });
  return validateResponse(responsesOverTimeSchema, data.data, "Gráfico");
}

export async function getActivities(limit: number = 10): Promise<Activities> {
  const validLimit = validateResponse(limitSchema, limit, "Limite");
  const { data } = await apiClient.get("/api/dashboard/activities", {
    params: { limit: validLimit },
  });
  return validateResponse(activitiesSchema, data.data, "Atividades");
}

export const DashboardService = {
  getStats,
  getLatestResponses,
  getResponsesOverTime,
  getActivities,
};
