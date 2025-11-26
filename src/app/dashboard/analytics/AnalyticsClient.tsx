"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionCards } from "@/components/sectionCards/section-cards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TemporalChart } from "./components/TemporalChart";
import { DeviceChart } from "./components/DeviceChart";
import { BrowserChart } from "./components/BrowserChart";
import { ConversionFunnel } from "./components/ConversionFunnel";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { LocationTable } from "./components/LocationTable";
import { FieldPerformanceTable } from "./components/FieldPerformanceTable";
import { FormRankingTable } from "./components/FormRankingTable";
import {
  useAnalyticsKPIs,
  useTemporalData,
  useDeviceData,
  useBrowserData,
  useFunnelData,
  useHeatmapData,
  useLocationData,
  useFieldPerformance,
  useFormRanking,
} from "@/hooks/useAnalytics";
import type { Period } from "@/lib/services/analytics.service";

export function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState<Period>("30d");

  const { data: stats, isLoading: isLoadingKPIs, error: errorKPIs } = useAnalyticsKPIs(timeRange);
  const { data: temporalData, isLoading: isLoadingTemporal, error: errorTemporal } = useTemporalData(timeRange);
  const { data: deviceData, isLoading: isLoadingDevice, error: errorDevice } = useDeviceData(timeRange);
  const { data: browserData, isLoading: isLoadingBrowser, error: errorBrowser } = useBrowserData(timeRange);
  const { data: funnelData, isLoading: isLoadingFunnel, error: errorFunnel } = useFunnelData(timeRange);
  const { data: heatmapData, isLoading: isLoadingHeatmap, error: errorHeatmap } = useHeatmapData(timeRange);
  const { data: locationData, isLoading: isLoadingLocation, error: errorLocation } = useLocationData(timeRange);
  const { data: fieldData, isLoading: isLoadingField, error: errorField } = useFieldPerformance(timeRange);
  const { data: formRankingData, isLoading: isLoadingRanking, error: errorRanking } = useFormRanking(timeRange, 5);

  const isLoading = isLoadingKPIs || isLoadingTemporal || isLoadingDevice || isLoadingBrowser;
  const hasError = errorKPIs || errorTemporal || errorDevice || errorBrowser;

  if (hasError) {
    toast.error("Erro ao carregar dados de analytics");
  }

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
