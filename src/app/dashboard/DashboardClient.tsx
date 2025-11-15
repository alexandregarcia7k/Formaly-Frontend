"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, BarChart3, CheckCircle2, FileCheck, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TableCell } from "@/components/ui/table";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { DataTable } from "@/components/datatable";

// TODO: Substituir por API real
const mockStats = [
  {
    title: "Total de Formulários",
    value: 124,
    trend: { value: "+12.5%", isPositive: true },
    description: "Crescimento este mês",
    footer: "Novos formulários criados",
  },
  {
    title: "Respostas Recebidas",
    value: "8,234",
    trend: { value: "+18%", isPositive: true },
    description: "Alta nos últimos 7 dias",
    footer: "Taxa de resposta aumentou",
  },
  {
    title: "Taxa de Conclusão",
    value: "87.5%",
    trend: { value: "+4.5%", isPositive: true },
    description: "Aumento constante",
    footer: "Meta alcançada",
  },
];

const mockActivities = [
  {
    id: "1",
    type: "new_responses" as const,
    message: "5 novas respostas em 'Pesquisa de Satisfação'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: MessageSquare,
  },
  {
    id: "2",
    type: "form_published" as const,
    message: "Formulário 'Feedback do Cliente' foi publicado",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: CheckCircle2,
  },
  {
    id: "3",
    type: "daily_responses" as const,
    message: "23 respostas recebidas hoje",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    icon: TrendingUp,
  },
  {
    id: "4",
    type: "new_responses" as const,
    message: "12 novas respostas em 'Cadastro de Eventos'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: MessageSquare,
  },
  {
    id: "5",
    type: "form_published" as const,
    message: "Formulário 'Avaliação de Produto' foi publicado",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    icon: FileCheck,
  },
];

const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  date: `${String(i + 1).padStart(2, "0")}/01`,
  desktop: Math.floor(Math.random() * 300) + 100,
  mobile: Math.floor(Math.random() * 200) + 50,
}));

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

const mockLatestResponses: LatestResponse[] = [
  {
    id: "resp-1",
    formId: "form-123",
    formName: "Pesquisa de Satisfação 2024",
    respondentName: "João Silva",
    respondentEmail: "joao@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "resp-2",
    formId: "form-456",
    formName: "Cadastro de Clientes",
    respondentEmail: "maria@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "resp-3",
    formId: "form-789",
    formName: "Feedback de Produto",
    respondentName: "Pedro Santos",
    status: "INCOMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "resp-4",
    formId: "form-123",
    formName: "Pesquisa de Satisfação 2024",
    respondentName: "Ana Costa",
    respondentEmail: "ana@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: "resp-5",
    formId: "form-456",
    formName: "Cadastro de Clientes",
    respondentEmail: "carlos@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "resp-6",
    formId: "form-789",
    formName: "Feedback de Produto",
    respondentName: "Lucia Mendes",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    id: "resp-7",
    formId: "form-123",
    formName: "Pesquisa de Satisfação 2024",
    respondentEmail: "roberto@email.com",
    status: "INCOMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "resp-8",
    formId: "form-456",
    formName: "Cadastro de Clientes",
    respondentName: "Fernanda Lima",
    respondentEmail: "fernanda@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
  },
  {
    id: "resp-9",
    formId: "form-789",
    formName: "Feedback de Produto",
    respondentName: "Ricardo Alves",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    id: "resp-10",
    formId: "form-123",
    formName: "Pesquisa de Satisfação 2024",
    respondentEmail: "juliana@email.com",
    status: "COMPLETE",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

export function DashboardClient() {
  const router = useRouter();
  
  // TODO: Substituir por dados reais do usuário autenticado
  const userName = "João";

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
        {mockStats.map((stat) => (
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
        <ActivityTimeline activities={mockActivities} />

        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle>Visualizações Desktop vs Mobile</CardTitle>
            <CardDescription>Últimos 30 dias de acesso aos formulários</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={mockChartData}>
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
        data={mockLatestResponses}
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
