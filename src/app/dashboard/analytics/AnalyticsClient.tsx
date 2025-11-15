"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionCards } from "@/components/sectionCards/section-cards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Eye, CheckCircle2, Clock, Target } from "lucide-react";
import { TemporalChart } from "./components/TemporalChart";
import { DeviceChart } from "./components/DeviceChart";
import { BrowserChart } from "./components/BrowserChart";
import { ConversionFunnel } from "./components/ConversionFunnel";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { LocationTable } from "./components/LocationTable";
import { FieldPerformanceTable } from "./components/FieldPerformanceTable";
import { FormRankingTable } from "./components/FormRankingTable";

export function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock KPIs
  const stats = useMemo(() => [
    {
      title: "Crescimento",
      value: "+23.5%",
      trend: { value: "+156 acessos", isPositive: true },
      description: "vs período anterior",
      footer: "Últimos 30 dias",
    },
    {
      title: "Taxa de Conversão",
      value: "68.4%",
      trend: { value: "+5.2pp", isPositive: true },
      description: "Submits / Acessos",
      footer: "Média do período",
    },
    {
      title: "Tempo Médio",
      value: "2m 34s",
      trend: { value: "-18s", isPositive: true },
      description: "Tempo de preenchimento",
      footer: "Por formulário",
    },
    {
      title: "Engajamento",
      value: "8.2/10",
      trend: { value: "+0.8", isPositive: true },
      description: "Score de qualidade",
      footer: "Completude + Tempo",
    },
  ], []);

  // Mock temporal data
  const temporalData = useMemo(() => [
    { date: "2024-01-01", acessos: 186, respostas: 127 },
    { date: "2024-01-02", acessos: 305, respostas: 208 },
    { date: "2024-01-03", acessos: 237, respostas: 162 },
    { date: "2024-01-04", acessos: 273, respostas: 186 },
    { date: "2024-01-05", acessos: 209, respostas: 143 },
    { date: "2024-01-06", acessos: 314, respostas: 214 },
    { date: "2024-01-07", acessos: 189, respostas: 129 },
  ], []);

  // Mock device data
  const deviceData = useMemo(() => [
    { name: "Mobile", value: 54, color: "var(--primary)" },
    { name: "Desktop", value: 38, color: "hsl(var(--chart-2))" },
    { name: "Tablet", value: 8, color: "hsl(var(--chart-3))" },
  ], []);

  // Mock browser data
  const browserData = useMemo(() => [
    { name: "Chrome", value: 68, color: "var(--primary)" },
    { name: "Safari", value: 18, color: "hsl(var(--chart-2))" },
    { name: "Firefox", value: 9, color: "hsl(var(--chart-3))" },
    { name: "Edge", value: 5, color: "hsl(var(--chart-4))" },
  ], []);

  // Mock funnel data
  const funnelData = useMemo(() => [
    { stage: "Visualizaram Link", count: 12543, percentage: 100, dropoff: 0 },
    { stage: "Abriram Formulário", count: 9783, percentage: 78, dropoff: 22 },
    { stage: "Completaram Campos", count: 8315, percentage: 66, dropoff: 15 },
    { stage: "Enviaram Resposta", count: 7650, percentage: 61, dropoff: 8 },
  ], []);

  // Mock heatmap data
  const heatmapData = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return days.map((day, dayIndex) => ({
      day,
      data: hours.map((hour) => ({
        hour,
        value: dayIndex === 0 || dayIndex === 6 
          ? Math.floor(Math.random() * 30) 
          : hour >= 8 && hour <= 18 
            ? Math.floor(Math.random() * 100) + 50 
            : Math.floor(Math.random() * 20),
      })),
    }));
  }, []);

  // Mock location data
  const locationData = useMemo(() => [
    { estado: "São Paulo", acessos: 3421, respostas: 2341, taxa: 68.4 },
    { estado: "Rio de Janeiro", acessos: 2876, respostas: 1987, taxa: 69.1 },
    { estado: "Minas Gerais", acessos: 2543, respostas: 1654, taxa: 65.0 },
    { estado: "Paraná", acessos: 1987, respostas: 1432, taxa: 72.1 },
    { estado: "Bahia", acessos: 1654, respostas: 1098, taxa: 66.4 },
    { estado: "Outros", acessos: 2319, respostas: 1488, taxa: 64.2 },
  ], []);

  // Mock field performance data
  const fieldData = useMemo(() => [
    { tipo: "Email", quantidade: 45, taxaPreenchimento: 98, tempoMedio: "12s", taxaErro: 2 },
    { tipo: "Telefone", quantidade: 38, taxaPreenchimento: 95, tempoMedio: "18s", taxaErro: 8 },
    { tipo: "Text", quantidade: 67, taxaPreenchimento: 99, tempoMedio: "8s", taxaErro: 0.5 },
    { tipo: "Textarea", quantidade: 23, taxaPreenchimento: 65, tempoMedio: "2m 30s", taxaErro: 5 },
    { tipo: "Date", quantidade: 12, taxaPreenchimento: 89, tempoMedio: "15s", taxaErro: 3 },
    { tipo: "Select", quantidade: 34, taxaPreenchimento: 92, tempoMedio: "10s", taxaErro: 1 },
    { tipo: "Checkbox", quantidade: 28, taxaPreenchimento: 87, tempoMedio: "5s", taxaErro: 2 },
    { tipo: "Radio", quantidade: 19, taxaPreenchimento: 91, tempoMedio: "8s", taxaErro: 1 },
  ], []);

  // Mock form ranking data
  const formRankingData = useMemo(() => [
    { rank: 1, nome: "Formulário de Contato", acessos: 3200, respostas: 2304, conversao: 72, tempo: "2m 15s", score: 5 },
    { rank: 2, nome: "Feedback de Produto", acessos: 2800, respostas: 2268, conversao: 81, tempo: "1m 30s", score: 5 },
    { rank: 3, nome: "Pesquisa de NPS", acessos: 2100, respostas: 1428, conversao: 68, tempo: "3m 40s", score: 4 },
    { rank: 4, nome: "Cadastro de Cliente", acessos: 1500, respostas: 675, conversao: 45, tempo: "5m 20s", score: 3 },
    { rank: 5, nome: "Inscrição em Evento", acessos: 987, respostas: 654, conversao: 66, tempo: "2m 45s", score: 4 },
  ], []);

  return (
    <div className="@container/main space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Análise completa de desempenho dos seus formulários
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <SectionCards stats={stats} />

      {/* Temporal Chart */}
      <TemporalChart data={temporalData} timeRange={timeRange} />

      {/* Device & Browser Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <DeviceChart data={deviceData} />
        <BrowserChart data={browserData} />
      </div>

      {/* Heatmap */}
      <ActivityHeatmap data={heatmapData} />

      {/* Location Table */}
      <LocationTable data={locationData} />

      {/* Conversion Funnel */}
      <ConversionFunnel data={funnelData} />

      {/* Field Performance */}
      <FieldPerformanceTable data={fieldData} />

      {/* Form Ranking */}
      <FormRankingTable data={formRankingData} />
    </div>
  );
}
