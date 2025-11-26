"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { isAxiosError } from "axios";
import { DashboardService } from "@/lib/services/dashboard.service";
import type {
  DashboardStats,
  LatestResponses,
  ResponsesOverTime,
  Activities,
  Period,
} from "@/schemas";

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseLatestResponsesReturn {
  responses: LatestResponses;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseResponsesOverTimeReturn {
  data: ResponsesOverTime;
  isLoading: boolean;
  error: string | null;
  changePeriod: (period: Period) => void;
  refetch: () => Promise<void>;
}

interface UseActivitiesReturn {
  activities: Activities;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para estatísticas do dashboard
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const result = await DashboardService.getStats();
      setStats(result);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar estatísticas");
      }
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

/**
 * Hook para últimas respostas
 */
export function useLatestResponses(limit: number = 10): UseLatestResponsesReturn {
  const [responses, setResponses] = useState<LatestResponses>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    try {
      setError(null);
      const result = await DashboardService.getLatestResponses(limit);
      setResponses(result);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar respostas");
      }
      setResponses([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  return { responses, isLoading, error, refetch: fetchResponses };
}

/**
 * Hook para respostas ao longo do tempo
 */
export function useResponsesOverTime(initialPeriod: Period = "30d"): UseResponsesOverTimeReturn {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [data, setData] = useState<ResponsesOverTime>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await DashboardService.getResponsesOverTime(period);
      setData(result);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar dados do gráfico");
      }
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changePeriod = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
  }, []);

  return { data, isLoading, error, changePeriod, refetch: fetchData };
}

/**
 * Hook para atividades recentes
 */
export function useActivities(limit: number = 10): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activities>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setError(null);
      const result = await DashboardService.getActivities(limit);
      setActivities(result);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar atividades");
      }
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30 * 1000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  return { activities, isLoading, error, refetch: fetchActivities };
}
