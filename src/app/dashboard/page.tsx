import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import data from "./data.json";

export default async function DashboardPage() {
  return (
    <div className="@container/main space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus formulários e respostas
        </p>
      </div>

      <SectionCards />

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
