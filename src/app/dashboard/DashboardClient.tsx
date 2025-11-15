"use client";

import { useCallback } from "react";
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

interface DashboardStat {
  title: string;
  value: string | number;
  trend: { value: string; isPositive: boolean };
  description: string;
  footer: string;
}

interface Activity {
  id: string;
  type: "new_responses" | "form_published" | "daily_responses";
  message: string;
  timestamp: Date;
  icon: any;
}

interface ChartData {
  date: string;
  desktop: number;
  mobile: number;
}

// TODO: Buscar da API GET /dashboard/stats
const stats: DashboardStat[] = [];

// TODO: Buscar da API GET /dashboard/activities?limit=5
const activities: Activity[] = [];

// TODO: Buscar da API GET /dashboard/responses-over-time?period=30d
const chartData: ChartData[] = [];

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
  respondentName?: string;
  respondentEmail?: string;
  status: "COMPLETE" | "INCOMPLETE";
  submittedAt: Date;
}

// TODO: Buscar da API GET /dashboard/latest-responses?limit=10
const latestResponses: LatestResponse[] = [];

export function DashboardClient() {
  const router = useRouter();
  
  // TODO: Buscar da API GET /auth/me
  const userName = "Usuário";

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

  // React Compiler otimiza automaticamente
  const renderRow = (response: LatestResponse) => (
      <>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{response.formName}</span>
            <span className="text-xs text-muted-foreground">
              ID: {response.formId}
            </span>
          </div>
        </TableCell>
        <TableCell>
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
        <TableCell>
          <Badge
            variant={response.status === "COMPLETE" ? "default" : "secondary"}
            className={response.status === "COMPLETE" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {response.status === "COMPLETE" ? "Completa" : "Incompleta"}
          </Badge>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(response.submittedAt, {
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
    );

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
            <CardContent className="space-y-1 pt-0">
              <div className="flex items-center gap-2 text-sm">
                <span className={stat.trend.isPositive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {stat.trend.value}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
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
        headers={["Formulário", "Respondente", "Status", "Respondido em", "Ações"]}
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
