"use client";

import { useState, useCallback } from "react";
import { DashboardService } from "@/lib/services/dashboard.service";
import { useApiQuery } from "./useApiQuery";
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
  const { data: stats, isLoading, error, refetch } = useApiQuery({
    queryFn: DashboardService.getStats,
    defaultValue: null,
    errorMessage: "Erro ao carregar estatísticas",
  });

  return { stats, isLoading, error, refetch };
}

/**
 * Hook para últimas respostas
 */
export function useLatestResponses(limit: number = 10): UseLatestResponsesReturn {
  const queryFn = useCallback(() => DashboardService.getLatestResponses(limit), [limit]);
  const { data: responses, isLoading, error, refetch } = useApiQuery({
    queryFn,
    defaultValue: [],
    errorMessage: "Erro ao carregar respostas",
  });

  return { responses, isLoading, error, refetch };
}

/**
 * Hook para respostas ao longo do tempo
 */
export function useResponsesOverTime(initialPeriod: Period = "30d"): UseResponsesOverTimeReturn {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const queryFn = useCallback(() => DashboardService.getResponsesOverTime(period), [period]);
  const { data, isLoading, error, refetch } = useApiQuery({
    queryFn,
    defaultValue: [],
    errorMessage: "Erro ao carregar dados do gráfico",
  });

  const changePeriod = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
  }, []);

  return { data, isLoading, error, changePeriod, refetch };
}

/**
 * Hook para atividades recentes
 */
export function useActivities(limit: number = 10): UseActivitiesReturn {
  const queryFn = useCallback(() => DashboardService.getActivities(limit), [limit]);
  const { data: activities, isLoading, error, refetch } = useApiQuery({
    queryFn,
    defaultValue: [],
    errorMessage: "Erro ao carregar atividades",
  });

  return { activities, isLoading, error, refetch };
}
