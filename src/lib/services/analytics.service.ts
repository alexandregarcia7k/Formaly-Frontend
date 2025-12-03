import { apiClient } from "@/lib/api/client";
import {
  periodSchema,
  temporalDataResponseSchema,
  type TemporalDataResponse,
  deviceDataResponseSchema,
  type DeviceDataResponse,
  browserDataResponseSchema,
  type BrowserDataResponse,
  funnelDataResponseSchema,
  type FunnelDataResponse,
  heatmapDataResponseSchema,
  type HeatmapDataResponse,
  locationDataResponseSchema,
  type LocationDataResponse,
  kpisResponseSchema,
  type KPIsResponse,
  formRankingResponseSchema,
  type FormRankingResponse,
  type Period,
} from "@/schemas/analytics.schema";

export type { Period };

/**
 * Valida período com safeParse
 * @param period - Período a validar
 * @returns Período validado ou lança erro
 */
function validatePeriod(period: Period): Period {
  const result = periodSchema.safeParse(period);
  if (!result.success) {
    throw new Error(`Período inválido: ${result.error.issues[0].message}`);
  }
  return result.data;
}

/**
 * Service para analytics do backend
 * Base URL: /api/analytics
 * Todos os métodos validam input e output com Zod
 */
export class AnalyticsService {
  /**
   * GET /api/analytics/temporal
   * Visualizações e respostas ao longo do tempo
   */
  static async getTemporalData(
    period: Period = "30d",
    formId?: string
  ): Promise<TemporalDataResponse> {
    const response = await apiClient.get("/api/analytics/temporal", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = temporalDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/devices
   * Percentual de acessos por tipo de dispositivo
   */
  static async getDeviceData(
    period: Period = "30d",
    formId?: string
  ): Promise<DeviceDataResponse> {
    const response = await apiClient.get("/api/analytics/devices", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = deviceDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/browsers
   * Percentual de acessos por navegador
   */
  static async getBrowserData(
    period: Period = "30d",
    formId?: string
  ): Promise<BrowserDataResponse> {
    const response = await apiClient.get("/api/analytics/browsers", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = browserDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/funnel
   * Análise do funil de conversão em 3 etapas
   */
  static async getFunnelData(
    period: Period = "30d",
    formId?: string
  ): Promise<FunnelDataResponse> {
    const response = await apiClient.get("/api/analytics/funnel", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = funnelDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/heatmap
   * Atividade por dia da semana e hora do dia
   */
  static async getHeatmapData(
    period: Period = "30d",
    formId?: string
  ): Promise<HeatmapDataResponse> {
    const response = await apiClient.get("/api/analytics/heatmap", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = heatmapDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/location
   * Top 10 estados/países por número de respostas
   */
  static async getLocationData(
    period: Period = "30d",
    formId?: string
  ): Promise<LocationDataResponse> {
    const response = await apiClient.get("/api/analytics/location", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = locationDataResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/kpis
   * 4 indicadores principais com tendências
   */
  static async getKPIs(
    period: Period = "30d",
    formId?: string
  ): Promise<KPIsResponse> {
    const response = await apiClient.get("/api/analytics/kpis", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    const result = kpisResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }

  /**
   * GET /api/analytics/ranking
   * Top 10 formulários ordenados por taxa de conversão
   */
  static async getFormRanking(period: Period = "30d"): Promise<FormRankingResponse> {
    const response = await apiClient.get("/api/analytics/ranking", {
      params: { period: validatePeriod(period) },
    });
    const result = formRankingResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
    }
    return result.data;
  }
}
