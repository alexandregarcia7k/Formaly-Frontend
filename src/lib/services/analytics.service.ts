import { apiClient } from "@/lib/api/client";

export type Period = "7d" | "30d" | "90d" | "1y";

export interface KPI {
  title: string;
  value: number | string;
  trend: { value: string; isPositive: boolean };
  description: string;
  footer: string;
}

export interface TemporalDataPoint {
  date: string;
  views: number;
  submissions: number;
  completions: number;
}

export interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserData {
  browser: string;
  count: number;
  percentage: number;
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

export interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

export interface LocationData {
  country: string;
  city: string;
  count: number;
  percentage: number;
}

export interface FieldPerformance {
  fieldName: string;
  fieldType: string;
  completionRate: number;
  avgTimeSeconds: number;
  errorRate: number;
}

export interface FormRanking {
  formId: string;
  formName: string;
  views: number;
  submissions: number;
  conversionRate: number;
}

export class AnalyticsService {
  static async getKPIs(period: Period = "30d"): Promise<KPI[]> {
    const response = await apiClient.get(`/api/analytics/kpis`, {
      params: { period },
    });
    return response.data;
  }

  static async getTemporalData(period: Period = "30d"): Promise<TemporalDataPoint[]> {
    const response = await apiClient.get(`/api/analytics/temporal`, {
      params: { period },
    });
    return response.data;
  }

  static async getDeviceData(period: Period = "30d"): Promise<DeviceData[]> {
    const response = await apiClient.get(`/api/analytics/devices`, {
      params: { period },
    });
    return response.data;
  }

  static async getBrowserData(period: Period = "30d"): Promise<BrowserData[]> {
    const response = await apiClient.get(`/api/analytics/browsers`, {
      params: { period },
    });
    return response.data;
  }

  static async getFunnelData(period: Period = "30d"): Promise<FunnelStep[]> {
    const response = await apiClient.get(`/api/analytics/funnel`, {
      params: { period },
    });
    return response.data;
  }

  static async getHeatmapData(period: Period = "30d"): Promise<HeatmapData[]> {
    const response = await apiClient.get(`/api/analytics/heatmap`, {
      params: { period },
    });
    return response.data;
  }

  static async getLocationData(period: Period = "30d"): Promise<LocationData[]> {
    const response = await apiClient.get(`/api/analytics/locations`, {
      params: { period },
    });
    return response.data;
  }

  static async getFieldPerformance(period: Period = "30d"): Promise<FieldPerformance[]> {
    const response = await apiClient.get(`/api/analytics/field-performance`, {
      params: { period },
    });
    return response.data;
  }

  static async getFormRanking(period: Period = "30d", limit: number = 5): Promise<FormRanking[]> {
    const response = await apiClient.get(`/api/analytics/form-ranking`, {
      params: { period, limit },
    });
    return response.data;
  }
}
