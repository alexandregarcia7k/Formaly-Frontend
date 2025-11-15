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

  // Mock forms - substituir por dados reais da API
  const mockForms = useMemo(() => [
    { id: "form-123", name: "Pesquisa de Satisfação 2024" },
    { id: "form-456", name: "Cadastro de Clientes" },
    { id: "form-789", name: "Feedback de Produto" },
  ], []);

  // Mock data - substituir por dados reais da API
  const mockResponses = useMemo<ResponseData[]>(() => [
    {
      id: "resp-1",
      formId: "form-123",
      formName: "Pesquisa de Satisfação 2024",
      respondentName: "João Silva",
      respondentEmail: "joao@email.com",
      status: "COMPLETE",
      submittedAt: new Date("2024-01-15T14:30:00"),
      updatedAt: new Date("2024-01-15T14:30:00"),
      data: {
        "field-1": "João Silva",
        "field-2": "joao@email.com",
        "field-3": "Muito satisfeito com o atendimento",
        "field-4": "5",
      },
      device: "desktop",
      userAgent: "Chrome 120.0.0 (Windows)",
    },
    {
      id: "resp-2",
      formId: "form-456",
      formName: "Cadastro de Clientes",
      respondentEmail: "maria@email.com",
      status: "COMPLETE",
      submittedAt: new Date("2024-01-14T10:15:00"),
      updatedAt: new Date("2024-01-14T10:20:00"),
      data: {
        "field-1": "Maria Santos",
        "field-2": "maria@email.com",
        "field-3": "(11) 98765-4321",
      },
      device: "mobile",
      userAgent: "Safari 17.0 (iOS)",
    },
    {
      id: "resp-3",
      formId: "form-123",
      formName: "Pesquisa de Satisfação 2024",
      respondentName: "Pedro Santos",
      status: "INCOMPLETE",
      submittedAt: new Date("2024-01-13T16:45:00"),
      updatedAt: new Date("2024-01-13T16:50:00"),
      data: {
        "field-1": "Pedro Santos",
        "field-2": "",
      },
      device: "desktop",
      userAgent: "Firefox 121.0 (Linux)",
    },
  ], []);

  // Mock form fields
  const mockFormFields = useMemo<FormField[]>(() => [
    { id: "field-1", type: "text", label: "Nome Completo", placeholder: "Digite seu nome", required: true },
    { id: "field-2", type: "email", label: "Email", placeholder: "seu@email.com", required: true },
    { id: "field-3", type: "textarea", label: "Comentários", placeholder: "Deixe seu comentário", required: false },
    { id: "field-4", type: "select", label: "Avaliação", placeholder: "Selecione", required: false, options: ["1", "2", "3", "4", "5"] },
  ], []);

  const stats = useMemo(() => [
    {
      title: "Total de Respostas",
      value: "1.247",
      trend: { value: "+12.5%", isPositive: true },
      description: "Total acumulado",
      footer: "Desde a criação do formulário",
    },
    {
      title: "Respostas Hoje",
      value: 42,
      trend: { value: "+8", isPositive: true },
      description: "Recebidas hoje",
      footer: "Últimas 24 horas",
    },
    {
      title: "Dispositivos Mobile",
      value: "68%",
      trend: { value: "+5%", isPositive: true },
      description: "Respostas via mobile",
      footer: "32% desktop",
    },
    {
      title: "Taxa de Abandono",
      value: "12.7%",
      trend: { value: "-3.1%", isPositive: true },
      description: "Formulários não concluídos",
      footer: "Iniciados mas não enviados",
    },
  ], []);

  // Função memoizada para abrir modal
  const openModal = useCallback((responseId: string) => {
    const response = mockResponses.find((r) => r.id === responseId);
    if (response) {
      setSelectedResponse(response);
      setIsDetailsOpen(true);
    }
  }, [mockResponses]);

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
    console.log("Salvando resposta:", data);
    toast.success("Resposta atualizada com sucesso");
  }, []);

  const handleDelete = useCallback((responseId: string) => {
    toast.success(`Resposta ${responseId} excluída`);
  }, []);

  // Filtrar e ordenar respostas
  const filteredAndSortedResponses = useMemo(() => {
    let filtered = mockResponses.filter((response) => {
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
  }, [mockResponses, search, statusFilter, formFilter, sortConfig]);

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
              ...mockForms.map((form) => ({
                value: form.id,
                label: form.name,
              })),
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
          <ResultsCount total={mockResponses.length} filtered={filteredAndSortedResponses.length} />
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
        formFields={mockFormFields}
        isOpen={isDetailsOpen}
        onClose={handleCloseModal}
        onSave={handleSaveResponse}
      />
    </div>
  );
}
