"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionCards } from "@/components/sectionCards/section-cards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // TODO: Buscar da API GET /analytics/kpis?period={timeRange}
  const stats: any[] = [];

  // TODO: Buscar da API GET /analytics/temporal?period={timeRange}
  const temporalData: any[] = [];

  // TODO: Buscar da API GET /analytics/devices?period={timeRange}
  const deviceData: any[] = [];

  // TODO: Buscar da API GET /analytics/browsers?period={timeRange}
  const browserData: any[] = [];

  // TODO: Buscar da API GET /analytics/funnel?period={timeRange}
  const funnelData: any[] = [];

  // TODO: Buscar da API GET /analytics/heatmap?period={timeRange}
  const heatmapData: any[] = [];

  // TODO: Buscar da API GET /analytics/locations?period={timeRange}
  const locationData: any[] = [];

  // TODO: Buscar da API GET /analytics/field-performance?period={timeRange}
  const fieldData: any[] = [];

  // TODO: Buscar da API GET /analytics/form-ranking?period={timeRange}&limit=5
  const formRankingData: any[] = [];

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
