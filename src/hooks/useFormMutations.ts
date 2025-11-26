"use client";

import { useState, useCallback, useMemo } from "react";
import { FormsService } from "@/lib/services/forms.service";
import type { CreateFormDto, UpdateFormDto, FormResponse } from "@/schemas/form.schema";
import { toast } from "sonner";

interface MutationState {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isCloning: boolean;
}

interface UseFormMutationsReturn extends MutationState {
  create: (data: CreateFormDto) => Promise<FormResponse | null>;
  update: (id: string, data: UpdateFormDto) => Promise<FormResponse | null>;
  deleteForm: (id: string) => Promise<boolean>;
  clone: (id: string) => Promise<FormResponse | null>;
}

/**
 * Hook para mutações de formulários (create, update, delete, clone)
 * Gerencia loading states individuais e notificações
 */
export function useFormMutations(): UseFormMutationsReturn {
  const [state, setState] = useState<MutationState>({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isCloning: false,
  });

  const create = useCallback(async (data: CreateFormDto) => {
    try {
      setState((prev) => ({ ...prev, isCreating: true }));
      const result = await FormsService.create(data);
      toast.success("Formulário criado com sucesso");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar formulário";
      toast.error(message);
      return null;
    } finally {
      setState((prev) => ({ ...prev, isCreating: false }));
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateFormDto) => {
    try {
      setState((prev) => ({ ...prev, isUpdating: true }));
      const result = await FormsService.update(id, data);
      toast.success("Formulário atualizado com sucesso");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar formulário";
      toast.error(message);
      return null;
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  }, []);

  const deleteForm = useCallback(async (id: string) => {
    try {
      setState((prev) => ({ ...prev, isDeleting: true }));
      await FormsService.delete(id);
      toast.success("Formulário excluído com sucesso");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir formulário";
      toast.error(message);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  }, []);

  const clone = useCallback(async (id: string) => {
    try {
      setState((prev) => ({ ...prev, isCloning: true }));
      const result = await FormsService.clone(id);
      toast.success("Formulário duplicado com sucesso");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao duplicar formulário";
      toast.error(message);
      return null;
    } finally {
      setState((prev) => ({ ...prev, isCloning: false }));
    }
  }, []);

  const memoizedReturn = useMemo<UseFormMutationsReturn>(
    () => ({
      ...state,
      create,
      update,
      deleteForm,
      clone,
    }),
    [state, create, update, deleteForm, clone]
  );

  return memoizedReturn;
}
