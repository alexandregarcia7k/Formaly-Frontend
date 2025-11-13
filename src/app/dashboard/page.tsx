import { SectionCards } from "@/components/sectionCards/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import data from "./data.json";

const dashboardStats = [
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
    title: "Formulários Ativos",
    value: 89,
    trend: { value: "+5%", isPositive: true },
    description: "Boa taxa de conversão",
    footer: "Engajamento alto",
  },
  {
    title: "Taxa de Conclusão",
    value: "87.5%",
    trend: { value: "+4.5%", isPositive: true },
    description: "Aumento constante",
    footer: "Meta alcançada",
  },
];

export default async function DashboardPage() {
  return (
    <div className="@container/main space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus formulários e respostas
        </p>
      </div>

      <SectionCards stats={dashboardStats} />

      <div className="grid gap-4 md:grid-cols-1">
        <ChartAreaInteractive />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Formulários Recentes</h2>
          <p className="text-muted-foreground">
            Gerencie e visualize seus formulários
          </p>
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
