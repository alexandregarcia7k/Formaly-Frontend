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
 * Helper para validar resposta com schema Zod
 */
function validateResponse<T>(schema: any, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Erro ao validar resposta: ${result.error.issues[0].message}`);
  }
  return result.data;
}

/**
 * Service para analytics do backend
 * Base URL: /api/analytics
 */
export class AnalyticsService {
  static async getTemporalData(period: Period = "30d", formId?: string): Promise<TemporalDataResponse> {
    const { data } = await apiClient.get("/api/analytics/temporal", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(temporalDataResponseSchema, data);
  }

  static async getDeviceData(period: Period = "30d", formId?: string): Promise<DeviceDataResponse> {
    const { data } = await apiClient.get("/api/analytics/devices", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(deviceDataResponseSchema, data);
  }

  static async getBrowserData(period: Period = "30d", formId?: string): Promise<BrowserDataResponse> {
    const { data } = await apiClient.get("/api/analytics/browsers", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(browserDataResponseSchema, data);
  }

  static async getFunnelData(period: Period = "30d", formId?: string): Promise<FunnelDataResponse> {
    const { data } = await apiClient.get("/api/analytics/funnel", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(funnelDataResponseSchema, data);
  }

  static async getHeatmapData(period: Period = "30d", formId?: string): Promise<HeatmapDataResponse> {
    const { data } = await apiClient.get("/api/analytics/heatmap", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(heatmapDataResponseSchema, data);
  }

  static async getLocationData(period: Period = "30d", formId?: string): Promise<LocationDataResponse> {
    const { data } = await apiClient.get("/api/analytics/location", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(locationDataResponseSchema, data);
  }

  static async getKPIs(period: Period = "30d", formId?: string): Promise<KPIsResponse> {
    const { data } = await apiClient.get("/api/analytics/kpis", {
      params: { period: validatePeriod(period), ...(formId && { formId }) },
    });
    return validateResponse(kpisResponseSchema, data);
  }

  static async getFormRanking(period: Period = "30d"): Promise<FormRankingResponse> {
    const { data } = await apiClient.get("/api/analytics/ranking", {
      params: { period: validatePeriod(period) },
    });
    return validateResponse(formRankingResponseSchema, data);
  }
}
