"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { FormsService } from "@/lib/services/forms.service";
import type { FormResponse, UpdateFormDto } from "@/schemas/form.schema";
import { toast } from "sonner";

interface UseFormReturn {
  form: FormResponse | null;
  isLoading: boolean;
  error: string | null;
  update: (data: UpdateFormDto) => Promise<void>;
  deleteForm: () => Promise<void>;
  clone: () => Promise<FormResponse | null>;
  refetch: () => Promise<void>;
}

/**
 * Hook para gerenciar um formulário específico
 * @param id - UUID do formulário
 */
export function useForm(id: string): UseFormReturn {
  const [form, setForm] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForm = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await FormsService.getById(id);
      setForm(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar formulário");
      setForm(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const update = useCallback(
    async (data: UpdateFormDto) => {
      try {
        const updated = await FormsService.update(id, data);
        setForm(updated);
        toast.success("Formulário atualizado com sucesso");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao atualizar formulário";
        toast.error(message);
        throw err;
      }
    },
    [id]
  );

  const deleteForm = useCallback(async () => {
    try {
      await FormsService.delete(id);
      toast.success("Formulário excluído com sucesso");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir formulário";
      toast.error(message);
      throw err;
    }
  }, [id]);

  const clone = useCallback(async () => {
    try {
      const cloned = await FormsService.clone(id);
      toast.success("Formulário duplicado com sucesso");
      return cloned;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao duplicar formulário";
      toast.error(message);
      return null;
    }
  }, [id]);

  const memoizedReturn = useMemo<UseFormReturn>(
    () => ({
      form,
      isLoading,
      error,
      update,
      deleteForm,
      clone,
      refetch: fetchForm,
    }),
    [form, isLoading, error, update, deleteForm, clone, fetchForm]
  );

  return memoizedReturn;
}
