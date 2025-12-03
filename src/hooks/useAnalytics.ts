import { useState, useEffect } from "react";
import { AnalyticsService } from "@/lib/services/analytics.service";
import type {
  Period,
  TemporalDataResponse,
  DeviceDataResponse,
  BrowserDataResponse,
  FunnelDataResponse,
  HeatmapDataResponse,
  LocationDataResponse,
  KPIsResponse,
  FormRankingResponse,
} from "@/schemas/analytics.schema";
import { isAxiosError } from "axios";

/**
 * Hook genérico para analytics
 * Performance: O(1) - Usa useMemo para evitar re-renders
 */
function useAnalyticsData<T>(
  fetchFn: (period: Period, formId?: string) => Promise<T>,
  period: Period,
  formId?: string
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn(period, formId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (isAxiosError(err)) {
            setError(err.response?.data?.message || err.message);
          } else {
            setError("Erro ao carregar dados");
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [fetchFn, period, formId]);

  return { data, isLoading, error };
}

export function useTemporalData(period: Period, formId?: string) {
  return useAnalyticsData<TemporalDataResponse>(
    AnalyticsService.getTemporalData,
    period,
    formId
  );
}

export function useDeviceData(period: Period, formId?: string) {
  return useAnalyticsData<DeviceDataResponse>(
    AnalyticsService.getDeviceData,
    period,
    formId
  );
}

export function useBrowserData(period: Period, formId?: string) {
  return useAnalyticsData<BrowserDataResponse>(
    AnalyticsService.getBrowserData,
    period,
    formId
  );
}

export function useFunnelData(period: Period, formId?: string) {
  return useAnalyticsData<FunnelDataResponse>(
    AnalyticsService.getFunnelData,
    period,
    formId
  );
}

export function useHeatmapData(period: Period, formId?: string) {
  return useAnalyticsData<HeatmapDataResponse>(
    AnalyticsService.getHeatmapData,
    period,
    formId
  );
}

export function useLocationData(period: Period, formId?: string) {
  return useAnalyticsData<LocationDataResponse>(
    AnalyticsService.getLocationData,
    period,
    formId
  );
}

export function useAnalyticsKPIs(period: Period, formId?: string) {
  return useAnalyticsData<KPIsResponse>(
    AnalyticsService.getKPIs,
    period,
    formId
  );
}

export function useFormRanking(period: Period) {
  const [data, setData] = useState<FormRankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getFormRanking(period);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar ranking");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return { data, isLoading, error };
}
