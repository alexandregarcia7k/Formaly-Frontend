"use client";

import { use, useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, MoreVertical, MessageSquareText, FileSpreadsheet, FileType } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import type { SortConfig } from "@/components/datatable/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionCards } from "@/components/sectionCards/section-cards";
import { FilterBar, SearchInput, FilterSelect, ClearFiltersButton, ResultsCount, DateRangeFilter } from "@/components/filters";
import { DataTable } from "@/components/datatable";
import { formatDateTime } from "@/lib/utils";
import { ResponseDetailsDialog } from "@/components/responses";
import { FormField } from "@/components/form-builder/FormFieldEditor";

interface ResponseData {
  id: string;
  formId: string;
  formName: string;
  respondentName?: string;
  respondentEmail?: string;
  status: "COMPLETE" | "INCOMPLETE";
  submittedAt: Date;
  updatedAt: Date;
  data: Record<string, unknown>;
  device?: "mobile" | "desktop";
  userAgent?: string;
}

interface ResponsesClientProps {
  searchParams: Promise<{ responseId?: string }>;
}

export function ResponsesClient({ searchParams }: ResponsesClientProps) {
  // use() deve ser o primeiro hook (React 19 best practice)
  const params = use(searchParams);
  const initialResponseId = params.responseId || null;
  
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formFilter, setFormFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [selectedResponse, setSelectedResponse] = useState<ResponseData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [forms, setForms] = useState<Array<{ id: string; name: string }>>([]);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  // Buscar formulários para filtro
  useEffect(() => {
    async function loadForms() {
      try {
        const { FormsService } = await import('@/lib/services/forms.service');
        const response = await FormsService.getAll({ 
          status: 'all',
          page: 1, 
          pageSize: 100,
          searchIn: 'all',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        setForms(response.data.map(f => ({ id: f.id, name: f.name })));
      } catch {
        // Silently fail - not critical
      }
    }
    loadForms();
  }, []);

  // Buscar respostas
  useEffect(() => {
    async function loadResponses() {
      try {
        const { FormsService } = await import('@/lib/services/forms.service');
        const allResponses: ResponseData[] = [];
        
        for (const form of forms) {
          const submissions = await FormsService.getSubmissions(form.id, { page: 1, pageSize: 100 });
          submissions.data.forEach(sub => {
            allResponses.push({
              id: sub.id,
              formId: sub.formId,
              formName: form.name,
              status: sub.isCompleted ? 'COMPLETE' : 'INCOMPLETE',
              submittedAt: new Date(sub.createdAt),
              updatedAt: new Date(sub.completedAt || sub.createdAt),
              data: sub.values.reduce((acc, v) => ({ ...acc, [v.fieldId]: v.value }), {}),
            });
          });
        }
        
        setResponses(allResponses);
      } catch {
        // Silently fail - not critical
      }
    }
    
    if (forms.length > 0) {
      loadResponses();
    }
  }, [forms]);

  // Função memoizada para abrir modal
  const openModal = useCallback(async (responseId: string) => {
    const response = responses.find((r) => r.id === responseId);
    if (response) {
      setSelectedResponse(response);
      setIsDetailsOpen(true);
      
      // Buscar campos do formulário
      try {
        const { FormsService } = await import('@/lib/services/forms.service');
        const form = await FormsService.getById(response.formId);
        setFormFields(form.fields.map(f => ({
          id: f.id,
          type: f.type as any,
          label: f.label,
          name: f.name,
          required: f.required,
          placeholder: '',
          options: f.config?.options as string[] | undefined,
          fieldType: f.type,
        })));
      } catch {
        // Silently fail - not critical
      }
    }
  }, [responses]);

  const handleViewDetails = useCallback((responseId: string) => {
    openModal(responseId);
    router.push(`/dashboard/responses?responseId=${responseId}`, { scroll: false });
  }, [openModal, router]);

  const handleCloseModal = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedResponse(null);
    router.push('/dashboard/responses', { scroll: false });
  }, [router]);

  // Abrir modal automaticamente se houver responseId inicial (apenas uma vez)
  useEffect(() => {
    if (initialResponseId && !hasInitialized) {
      openModal(initialResponseId);
      setHasInitialized(true);
    }
  }, [initialResponseId, hasInitialized, openModal]);

  const handleSaveResponse = useCallback((data: Record<string, unknown>) => {
    toast.success("Resposta atualizada com sucesso");
  }, []);

  const handleDelete = useCallback((responseId: string) => {
    toast.success(`Resposta ${responseId} excluída`);
  }, []);

  // Filtrar e ordenar respostas
  const filteredAndSortedResponses = useMemo(() => {
    let filtered = responses.filter((response) => {
      const matchSearch = 
        response.formName.toLowerCase().includes(search.toLowerCase()) ||
        response.respondentName?.toLowerCase().includes(search.toLowerCase()) ||
        response.respondentEmail?.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = 
        statusFilter === "all" || 
        (statusFilter === "complete" && response.status === "COMPLETE") ||
        (statusFilter === "incomplete" && response.status === "INCOMPLETE");
      
      const matchForm = 
        formFilter === "all" || 
        response.formId === formFilter;
      
      return matchSearch && matchStatus && matchForm;
    });

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | Date | number;
        let bValue: string | Date | number;

        switch (sortConfig.key) {
          case "formName":
            aValue = a.formName;
            bValue = b.formName;
            break;
          case "respondent":
            aValue = a.respondentName || a.respondentEmail || "";
            bValue = b.respondentName || b.respondentEmail || "";
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "submittedAt":
            aValue = a.submittedAt.getTime();
            bValue = b.submittedAt.getTime();
            break;
          case "updatedAt":
            aValue = a.updatedAt.getTime();
            bValue = b.updatedAt.getTime();
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
  }, [responses, search, statusFilter, formFilter, sortConfig]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (current.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        if (current.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  }, []);

  return (
    <div className="@container/main space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Respostas
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Visualize e gerencie as respostas dos formulários
          </p>
        </div>
      </div>

      <SectionCards stats={stats} />

      <div className="bg-card border rounded-lg p-4">
        <FilterBar>
          <SearchInput
            label="Buscar"
            placeholder="Buscar respostas..."
            value={search}
            onChange={setSearch}
          />
          <FilterSelect
            label="Formulário"
            options={[
              { value: "all", label: "Todos os formulários" },
              ...forms.map((form) => ({
                value: form.id,
                label: form.name,
              }))
            ]}
            value={formFilter}
            onChange={setFormFilter}
            hasActiveFilter={formFilter !== "all"}
          />
          <FilterSelect
            label="Status"
            options={[
              { value: "all", label: "Todos" },
              { value: "complete", label: "Completas" },
              { value: "incomplete", label: "Incompletas" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            hasActiveFilter={statusFilter !== "all"}
          />
          <DateRangeFilter
            value={dateRange}
            onChange={(value) => setDateRange(value || {})}
          />
          <ClearFiltersButton
            onClear={() => {
              setSearch("");
              setFormFilter("all");
              setStatusFilter("all");
              setDateRange({});
            }}
            disabled={search === "" && formFilter === "all" && statusFilter === "all" && !dateRange.from}
          />
          <ResultsCount total={responses.length} filtered={filteredAndSortedResponses.length} />
        </FilterBar>
      </div>

      <DataTable
        data={filteredAndSortedResponses}
        headers={[
          { label: "Formulário", sortKey: "formName" },
          { label: "Respondente", sortKey: "respondent" },
          { label: "Status", sortKey: "status" },
          { label: "Respondido em", sortKey: "submittedAt" },
          { label: "Atualizado em", sortKey: "updatedAt" },
          { label: "Ações" },
        ]}
        sortConfig={sortConfig}
        onSort={handleSort}
        renderRow={(response) => (
          <>
            <TableCell onClick={() => handleViewDetails(response.id)} className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{response.formName}</span>
                <span className="text-xs text-muted-foreground">
                  ID: {response.formId}
                </span>
              </div>
            </TableCell>

            <TableCell onClick={() => handleViewDetails(response.id)} className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {response.respondentName || response.respondentEmail || "Anônimo"}
                </span>
                {response.respondentName && response.respondentEmail && (
                  <span className="text-xs text-muted-foreground">
                    {response.respondentEmail}
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell onClick={() => handleViewDetails(response.id)} className="cursor-pointer">
              <Badge
                variant={response.status === "COMPLETE" ? "default" : "secondary"}
                className={response.status === "COMPLETE" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {response.status === "COMPLETE" ? "Completa" : "Incompleta"}
              </Badge>
            </TableCell>

            <TableCell onClick={() => handleViewDetails(response.id)} className="cursor-pointer">
              <span className="text-sm text-muted-foreground">
                {formatDateTime(response.submittedAt)}
              </span>
            </TableCell>

            <TableCell onClick={() => handleViewDetails(response.id)} className="cursor-pointer">
              <span className="text-sm text-muted-foreground">
                {formatDateTime(response.updatedAt)}
              </span>
            </TableCell>

            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(response.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Exportar CSV")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Exportar Excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Exportar PDF")}>
                    <FileType className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(response.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </>
        )}
        isLoading={isLoading}
        emptyState={{
          icon: MessageSquareText,
          title: "Nenhuma resposta encontrada",
          description: "As respostas dos formulários aparecerão aqui",
        }}
        cardTitle="Respostas Recebidas"
        cardDescription="Lista completa de todas as respostas dos formulários"
      />

      <ResponseDetailsDialog
        response={selectedResponse}
        formFields={formFields}
        isOpen={isDetailsOpen}
        onClose={handleCloseModal}
        onSave={handleSaveResponse}
      />
    </div>
  );
}
