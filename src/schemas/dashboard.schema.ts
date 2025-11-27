import { z } from "zod";
import { dateSchema } from "./common.schema";

// ============================================================================
// DASHBOARD SCHEMAS - Validação de estatísticas e analytics
// ============================================================================

/**
 * Schema de estatísticas do dashboard
 * GET /api/dashboard/stats
 */
export const dashboardStatsSchema = z.object({
  totalForms: z.number().int().min(0),
  totalResponses: z.number().int().min(0),
  totalViews: z.number().int().min(0),
  averageCompletionRate: z.number().min(0), // Backend pode retornar > 100
});

/**
 * Schema de resposta recente
 */
export const latestResponseItemSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  formTitle: z.string(),
  createdAt: z.string(),
  timeSpent: z.number().nullable().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
}).transform((data) => ({
  id: data.id,
  formId: data.formId,
  formName: data.formTitle,
  isCompleted: true,
  createdAt: new Date(data.createdAt),
  completedAt: new Date(data.createdAt),
}));

/**
 * Schema de últimas respostas (wrapper com data e total)
 * GET /api/dashboard/latest-responses
 */
export const latestResponsesSchema = z.object({
  data: z.array(latestResponseItemSchema),
  total: z.number().int().min(0),
});

/**
 * Schema de ponto de dados para gráfico
 */
export const dataPointSchema = z.object({
  date: z.string(), // ISO date string
  count: z.number().int().min(0),
});

/**
 * Schema de respostas ao longo do tempo
 * GET /api/dashboard/responses-over-time
 */
export const responsesOverTimeSchema = z.object({
  data: z.array(dataPointSchema),
});

/**
 * Schema de atividade
 */
export const activityItemSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["form_created", "form_updated", "response_received", "form_deleted"]),
  message: z.string(),
  createdAt: z.string(),
  formId: z.string().uuid(),
  form: z.object({
    name: z.string(),
  }).optional(),
}).transform((data) => ({
  id: data.id,
  type: data.type,
  description: data.message,
  timestamp: new Date(data.createdAt),
  metadata: {
    formId: data.formId,
    formName: data.form?.name,
  },
}));

/**
 * Schema de atividades (wrapper com data e total)
 * GET /api/dashboard/activities
 */
export const activitiesSchema = z.object({
  data: z.array(activityItemSchema),
  total: z.number().int().min(0),
});

/**
 * Schema de query params para período
 */
export const periodSchema = z.enum(["7d", "30d", "90d", "1y"]).default("30d");

/**
 * Schema de query params para limite
 */
export const limitSchema = z.number().int().min(1).max(100).default(10);

// ============================================================================
// TIPOS INFERIDOS
// ============================================================================

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type LatestResponseItem = z.infer<typeof latestResponseItemSchema>;
export type LatestResponsesWrapper = z.infer<typeof latestResponsesSchema>;
export type LatestResponses = LatestResponseItem[];
export type DataPoint = z.infer<typeof dataPointSchema>;
export type ResponsesOverTimeWrapper = z.infer<typeof responsesOverTimeSchema>;
export type ResponsesOverTime = DataPoint[];
export type ActivityItem = z.infer<typeof activityItemSchema>;
export type ActivitiesWrapper = z.infer<typeof activitiesSchema>;
export type Activities = ActivityItem[];
export type Period = z.infer<typeof periodSchema>;
