"use client";

import { useState, useEffect, useCallback } from "react";
import { FormsService } from "@/lib/services/forms.service";
import type { FormListItem, FormListQuery, PaginatedForms } from "@/schemas/form.schema";

interface UseFormsReturn {
  forms: FormListItem[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginatedForms["pagination"] | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para listagem de formulários com paginação e filtros
 * @param query - Parâmetros de query (page, pageSize, search, etc)
 */
export function useForms(query?: FormListQuery): UseFormsReturn {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [pagination, setPagination] = useState<PaginatedForms["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await FormsService.getAll(query);
      setForms(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar formulários");
      setForms([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  return { forms, isLoading, error, pagination, refetch: fetchForms };
}
