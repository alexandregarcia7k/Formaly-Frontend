"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";

interface UseApiQueryOptions<T> {
  queryFn: () => Promise<T>;
  defaultValue: T;
  errorMessage?: string;
  pollingInterval?: number; // ms, undefined = sem polling
}

interface UseApiQueryReturn<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook genérico para queries de API com validação de erro padronizada
 * Elimina duplicação de código em todos os hooks de dashboard
 */
export function useApiQuery<T>({
  queryFn,
  defaultValue,
  errorMessage = "Erro ao carregar dados",
  pollingInterval,
}: UseApiQueryOptions<T>): UseApiQueryReturn<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : errorMessage;
      setError(message);
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, defaultValue, errorMessage]);

  useEffect(() => {
    fetchData();

    if (pollingInterval) {
      const interval = setInterval(fetchData, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, pollingInterval]);

  return { data, isLoading, error, refetch: fetchData };
}
