"use client";

import { useState, useEffect, useRef, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SortConfig } from "@/components/datatable/types";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Power,
  PowerOff,
  Loader2,
  Link2,
  Check,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/datatable";
import { SectionCards } from "@/components/sectionCards/section-cards";
import { FilterBar, SearchInput, FilterSelect, ClearFiltersButton, ResultsCount, ActiveFilters, DateRangeFilter, FORM_STATUS, FORM_RESPONSES_FILTER, type ActiveFilter, type FormStatus, type FormResponsesFilter } from "@/components/filters";
import { useDebounce } from "@/hooks/useDebounce";
import { FormPreview } from "@/components/form-builder/FormPreview";
import { FormsService, type FormResponse } from "@/lib/services/forms.service";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Omit<FormResponse, 'fields'>[]>([]);
  const [optimisticForms, setOptimisticDelete] = useOptimistic(
    forms,
    (state, deletedId: string) => state.filter((f) => f.id !== deletedId)
  );
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<FormResponse | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<FormStatus>(FORM_STATUS.ALL);
  const [responsesFilter, setResponsesFilter] = useState<FormResponsesFilter>(FORM_RESPONSES_FILTER.ALL);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });

  // Detectar sistema operacional (client-side only)
  useEffect(() => {
    setIsMac(navigator.platform.includes('Mac'));
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Focar no campo de busca
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Esc: Limpar filtros (se houver filtros ativos)
      if (e.key === 'Escape') {
        const hasActiveFilters = search || statusFilter !== FORM_STATUS.ALL || responsesFilter !== FORM_RESPONSES_FILTER.ALL || dateRange.from;
        if (hasActiveFilters) {
          setSearch("");
          setStatusFilter(FORM_STATUS.ALL);
          setResponsesFilter(FORM_RESPONSES_FILTER.ALL);
          setDateRange({});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Carregar formulários da API
  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadForms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await FormsService.listForms(currentPage);
      setForms(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      const errorMessage =
        "Não foi possível carregar os formulários. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPreview = async (formId: string) => {
    setPreviewFormId(formId);
    setIsLoadingPreview(true);
    try {
      const form = await FormsService.getForm(formId);
      setPreviewForm(form);
    } catch (error) {
      toast.error("Erro ao carregar preview do formulário");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewFormId(null);
    setPreviewForm(null);
  };

  const toggleFormStatus = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    const newStatus = form.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await FormsService.updateForm(formId, {
        status: newStatus,
      });

      // Atualizar estado local
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === formId ? { ...f, status: newStatus } : f
        )
      );

      toast.success(
        `Formulário ${
          newStatus === "ACTIVE" ? "ativado" : "desativado"
        } com sucesso`
      );
    } catch (error) {
      toast.error("Erro ao alterar status do formulário");
    }
  };

  const handleCloneForm = async (formId: string) => {
    try {
      await FormsService.cloneForm(formId);

      // Recarregar lista
      await loadForms();

      toast.success("Formulário duplicado com sucesso");
    } catch (error) {
      toast.error("Erro ao duplicar formulário");
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteFormId) return;

    const formToDelete = deleteFormId;
    setDeleteFormId(null);

    startTransition(async () => {
      setOptimisticDelete(formToDelete);
      
      try {
        await FormsService.deleteForm(formToDelete);
        setForms((prevForms) => prevForms.filter((f) => f.id !== formToDelete));
        toast.success("Formulário deletado com sucesso");
      } catch (error) {
        toast.error("Erro ao deletar formulário");
      }
    });
  };

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(formId);
    setTimeout(() => setCopiedSlug(null), 2000);
    toast.success("Link copiado para área de transferência");
  };

  // Filtrar e ordenar formulários
  // React 19 Compiler otimiza automaticamente - useMemo não necessário
  const getFilteredAndSortedForms = () => {
    let filtered = optimisticForms.filter((form) => {
      const matchSearch = 
        form.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (form.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false);
      
      const matchStatus = 
        statusFilter === FORM_STATUS.ALL || 
        form.status === statusFilter;
      
      const matchResponses = 
        responsesFilter === FORM_RESPONSES_FILTER.ALL ||
        (responsesFilter === FORM_RESPONSES_FILTER.WITH && form.totalResponses > 0) ||
        (responsesFilter === FORM_RESPONSES_FILTER.WITHOUT && form.totalResponses === 0);
      
      const matchDate = 
        !dateRange.from ||
        (() => {
          const formDate = new Date(form.createdAt);
          formDate.setHours(0, 0, 0, 0);
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          const toDate = dateRange.to ? new Date(dateRange.to) : null;
          if (toDate) toDate.setHours(23, 59, 59, 999);
          
          return formDate >= fromDate && (!toDate || formDate <= toDate);
        })();
      
      return matchSearch && matchStatus && matchResponses && matchDate;
    });

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | Date | number;
        let bValue: string | Date | number;

        switch (sortConfig.key) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "responses":
            aValue = a.totalResponses;
            bValue = b.totalResponses;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "updatedAt":
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };
  
  const filteredAndSortedForms = getFilteredAndSortedForms();

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        if (current.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  // Calcular estatísticas
  // React 19 Compiler otimiza automaticamente - useMemo não necessário
  const getStats = () => {
    const totalForms = filteredAndSortedForms.length;
    const activeForms = filteredAndSortedForms.filter((f) => f.status === "ACTIVE").length;
    const totalResponses = filteredAndSortedForms.reduce(
      (acc, f) => acc + f.totalResponses,
      0
    );
    const avgResponses =
      totalForms > 0 ? Math.round(totalResponses / totalForms) : 0;
    const formsWithResponses = filteredAndSortedForms.filter(
      (f) => f.totalResponses > 0
    ).length;
    const conversionRate =
      totalForms > 0 ? Math.round((formsWithResponses / totalForms) * 100) : 0;

    return [
      {
        title: "Total de Formulários",
        value: totalForms,
        trend: { value: "", isPositive: true },
        description: `${activeForms} ativos`,
        footer: `${totalForms - activeForms} inativos`,
      },
      {
        title: "Total de Respostas",
        value: totalResponses,
        trend: { value: "", isPositive: true },
        description: `Média de ${avgResponses} por formulário`,
        footer: "Respostas coletadas",
      },
      {
        title: "Formulário Mais Popular",
        value: filteredAndSortedForms.length > 0 ? Math.max(...filteredAndSortedForms.map((f) => f.totalResponses), 0) : 0,
        trend: { value: "", isPositive: true },
        description:
          filteredAndSortedForms.length > 0
            ? [...filteredAndSortedForms].sort((a, b) => b.totalResponses - a.totalResponses)[0]
                ?.name || "N/A"
            : "N/A",
        footer: "Maior número de respostas",
      },
      {
        title: "Taxa de Conversão",
        value: `${conversionRate}%`,
        trend: { value: "", isPositive: true },
        description: `${formsWithResponses} com respostas`,
        footer: "Formulários respondidos",
      },
    ];
  };
  
  const stats = getStats();

  return (
    <div className="@container/main space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Formulários
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie e acompanhe seus formulários
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/forms/new")}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Formulário
        </Button>
      </div>

      {!isLoading && !error && forms.length > 0 && (
        <SectionCards stats={stats} />
      )}

      {!isLoading && !error && (
        <>
          <div className="bg-card border rounded-lg p-4">
            <FilterBar>
              <span className="sr-only" id="filter-instructions">
                Use os filtros abaixo para refinar a lista de formulários. Pressione Cmd+K para focar na busca ou Esc para limpar todos os filtros.
              </span>
              <SearchInput
                label="Buscar"
                placeholder={`Nome do formulário... (${isMac ? '⌘' : 'Ctrl+'}K)`}
                value={search}
                onChange={setSearch}
                inputRef={searchInputRef}
                aria-label="Buscar formulários por nome ou descrição"
                aria-describedby="filter-instructions"
              />
              <FilterSelect
                label="Status"
                options={[
                  { value: FORM_STATUS.ALL, label: "Todos" },
                  { value: FORM_STATUS.ACTIVE, label: "Ativos" },
                  { value: FORM_STATUS.INACTIVE, label: "Inativos" },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as FormStatus)}
                hasActiveFilter={statusFilter !== FORM_STATUS.ALL}
              />
              <FilterSelect
                label="Respostas"
                options={[
                  { value: FORM_RESPONSES_FILTER.ALL, label: "Todos" },
                  { value: FORM_RESPONSES_FILTER.WITH, label: "Com respostas" },
                  { value: FORM_RESPONSES_FILTER.WITHOUT, label: "Sem respostas" },
                ]}
                value={responsesFilter}
                onChange={(value) => setResponsesFilter(value as FormResponsesFilter)}
                hasActiveFilter={responsesFilter !== FORM_RESPONSES_FILTER.ALL}
              />
              <DateRangeFilter
                value={dateRange}
                onChange={(value) => setDateRange(value || {})}
              />
              <ClearFiltersButton
                onClear={() => {
                  setSearch("");
                  setStatusFilter(FORM_STATUS.ALL);
                  setResponsesFilter(FORM_RESPONSES_FILTER.ALL);
                  setDateRange({});
                }}
                disabled={search === "" && statusFilter === FORM_STATUS.ALL && responsesFilter === FORM_RESPONSES_FILTER.ALL && !dateRange.from}
                aria-label="Limpar todos os filtros ativos"
              />
              <ResultsCount total={forms.length} filtered={filteredAndSortedForms.length} />
            </FilterBar>
          </div>

          <ActiveFilters
            filters={[
              search && { key: "search", label: "Busca", value: search },
              statusFilter !== FORM_STATUS.ALL && { key: "status", label: "Status", value: statusFilter === FORM_STATUS.ACTIVE ? "Ativos" : "Inativos" },
              responsesFilter !== FORM_RESPONSES_FILTER.ALL && { key: "responses", label: "Respostas", value: responsesFilter === FORM_RESPONSES_FILTER.WITH ? "Com respostas" : "Sem respostas" },
              dateRange.from && { key: "date", label: "Data", value: dateRange.to ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` : dateRange.from.toLocaleDateString() },
            ].filter(Boolean) as ActiveFilter[]}
            onRemove={(key) => {
              if (key === "search") setSearch("");
              if (key === "status") setStatusFilter(FORM_STATUS.ALL);
              if (key === "responses") setResponsesFilter(FORM_RESPONSES_FILTER.ALL);
              if (key === "date") setDateRange({});
            }}
          />
          

        </>
      )}

      <DataTable
        data={filteredAndSortedForms}
        headers={[
          { label: "Formulário", sortKey: "name" },
          { label: "Status", sortKey: "status" },
          { label: "Link" },
          { label: "Respostas", sortKey: "responses" },
          { label: "Criado em", sortKey: "createdAt" },
          { label: "Atualizado em", sortKey: "updatedAt" },
          { label: "Ações" },
        ]}
        sortConfig={sortConfig}
        onSort={handleSort}
        renderRow={(form) => (
          <>
            <TableCell
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/forms/${form.id}/edit`)}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{form.name}</span>
                {form.description && (
                  <span className="text-xs text-muted-foreground">
                    {form.description}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.status === "ACTIVE"}
                  onCheckedChange={() => toggleFormStatus(form.id)}
                  className="data-[state=checked]:bg-primary"
                />
                {form.status === "ACTIVE" ? (
                  <Power className="h-4 w-4 text-primary" />
                ) : (
                  <PowerOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2"
                onClick={() => handleCopyLink(form.id)}
              >
                {copiedSlug === form.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    <span className="text-xs">/f/{form.id}</span>
                  </>
                )}
              </Button>
            </TableCell>
            <TableCell>
              <span className="font-medium">{form.totalResponses}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDate(new Date(form.createdAt))}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDateTime(new Date(form.updatedAt))}
              </span>
            </TableCell>
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/forms/${form.id}/edit`)
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenPreview(form.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCloneForm(form.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteFormId(form.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </>
        )}
        isLoading={isLoading}
        error={error}
        emptyState={{
          icon: FileQuestion,
          title: "Nenhum formulário encontrado",
          description: "Comece criando seu primeiro formulário",
          action: (
            <Button onClick={() => router.push("/dashboard/forms/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Formulário
            </Button>
          ),
        }}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        cardTitle="Seus Formulários"
        cardDescription="Lista completa de todos os formulários criados"
      />

      {/* Modal de Preview */}
      <Dialog
        open={!!previewFormId}
        onOpenChange={(open) => !open && handleClosePreview()}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Formulário</DialogTitle>
          </DialogHeader>
          {isLoadingPreview ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : previewForm ? (
            <FormPreview
              formName={previewForm.name}
              formDescription={previewForm.description || ""}
              fields={FormsService.mapFieldsToFrontend(previewForm.fields)}
              hasPassword={false}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={!!deleteFormId}
        onOpenChange={(open: boolean) => !open && setDeleteFormId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja deletar este formulário? Esta ação não pode
            ser desfeita.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteFormId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteForm}
        disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
