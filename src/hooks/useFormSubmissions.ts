"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { FormsService } from "@/lib/services/forms.service";
import type { PaginatedSubmissions, SubmissionQuery } from "@/schemas/response.schema";

interface UseFormSubmissionsReturn {
  submissions: PaginatedSubmissions["data"];
  isLoading: boolean;
  error: string | null;
  pagination: PaginatedSubmissions["pagination"] | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para listar respostas de um formulário com paginação
 * @param formId - UUID do formulário
 * @param query - Parâmetros de query (page, pageSize, sortBy, sortOrder)
 */
export function useFormSubmissions(
  formId: string,
  query?: SubmissionQuery
): UseFormSubmissionsReturn {
  const [submissions, setSubmissions] = useState<PaginatedSubmissions["data"]>([]);
  const [pagination, setPagination] = useState<PaginatedSubmissions["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await FormsService.getSubmissions(formId, query);
      setSubmissions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar respostas");
      setSubmissions([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [formId, query]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const memoizedReturn = useMemo<UseFormSubmissionsReturn>(
    () => ({
      submissions,
      isLoading,
      error,
      pagination,
      refetch: fetchSubmissions,
    }),
    [submissions, isLoading, error, pagination, fetchSubmissions]
  );

  return memoizedReturn;
}
