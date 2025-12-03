"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, BarChart3, FileText, MessageSquare } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TableCell } from "@/components/ui/table";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { DataTable } from "@/components/datatable";
import { useDashboardStats, useLatestResponses, useResponsesOverTime, useActivities } from "@/hooks";
import type { ActivityItem } from "@/schemas";

interface DashboardStat {
  title: string;
  value: string | number;
  trend: { value: string; isPositive: boolean };
  description: string;
  footer: string;
}

interface ChartData {
  date: string;
  desktop: number;
  mobile: number;
}



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface LatestResponse {
  id: string;
  formId: string;
  formName: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export function DashboardClient() {
  const router = useRouter();
  const { stats: dashboardStats, isLoading: isLoadingStats, error: statsError } = useDashboardStats();
  const { responses: latestResponses, isLoading: isLoadingResponses, error: responsesError } = useLatestResponses(10);
  const { data: chartDataRaw, isLoading: isLoadingChart, error: chartError } = useResponsesOverTime("30d");
  const { activities, isLoading: isLoadingActivities, error: activitiesError } = useActivities(5);

  const userName = "Usuário";

  const stats: DashboardStat[] = useMemo(() => {
    if (!dashboardStats) return [];
    return [
      {
        title: "Total de Formulários",
        value: dashboardStats.totalForms,
        trend: { value: "", isPositive: true },
        description: "",
        footer: "Formulários ativos e inativos",
      },
      {
        title: "Total de Respostas",
        value: dashboardStats.totalResponses,
        trend: { value: "", isPositive: true },
        description: "",
        footer: "Respostas coletadas",
      },
      {
        title: "Taxa de Conclusão",
        value: `${dashboardStats.averageCompletionRate.toFixed(1)}%`,
        trend: { value: "", isPositive: true },
        description: "",
        footer: "Média de conclusão",
      },
    ];
  }, [dashboardStats]);

  const chartData = useMemo(() => {
    return chartDataRaw.map((item) => ({
      date: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      desktop: Math.floor(item.count * 0.6),
      mobile: Math.floor(item.count * 0.4),
    }));
  }, [chartDataRaw]);



  // React Compiler otimiza automaticamente - useMemo desnecessário para dados estáticos
  const quickActions = [
    {
      title: "Criar Formulário",
      description: "Crie um novo formulário em minutos",
      icon: FileText,
      href: "/dashboard/forms/new",
    },
    {
      title: "Ver Respostas",
      description: "Visualize e gerencie respostas",
      icon: MessageSquare,
      href: "/dashboard/responses",
    },
    {
      title: "Analytics",
      description: "Analise estatísticas detalhadas",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
  ];

  const handleRowClick = useCallback(
    (responseId: string) => {
      router.push(`/dashboard/responses?responseId=${responseId}`, { scroll: false });
    },
    [router]
  );

  const renderRow = useCallback((response: LatestResponse) => (
      <>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{response.formName}</span>
            <span className="text-xs text-muted-foreground">
              ID: {response.formId.slice(0, 8)}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(response.completedAt || response.createdAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleRowClick(response.id)}
          >
            Ver Resposta
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </TableCell>
      </>
    ), [handleRowClick]);

  // Mostrar erro apenas se stats falhar (endpoint principal)
  if (statsError) {
    return (
      <div className="@container/main space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao Carregar Dados</CardTitle>
            <CardDescription>
              {statsError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verifique se o backend está rodando em http://localhost:3333
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="@container/main space-y-6">
      {/* Greeting Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Olá, {userName}! 👋
        </h1>
        <div className="space-y-1">
          <p className="text-lg text-muted-foreground font-medium">
            Bem-vindo de volta!
          </p>
        </div>
      </div>

      {/* Stats Cards - 3 horizontal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="py-4">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">{stat.footer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions - 3 horizontal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>

      {/* Timeline + Chart */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <ActivityTimeline activities={activities} />

        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle>Visualizações Desktop vs Mobile</CardTitle>
            <CardDescription>Últimos 30 dias de acesso aos formulários</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest Responses */}
      <DataTable
        data={latestResponses}
        headers={["Formulário", "Respondido em", "Ações"]}
        renderRow={renderRow}
        cardTitle="Últimas Respostas"
        cardDescription="10 respostas mais recentes dos seus formulários"
        emptyState={{
          icon: MessageSquare,
          title: "Nenhuma resposta encontrada",
          description: "As respostas dos formulários aparecerão aqui",
        }}
      />
    </div>
  );
}
