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
  useFormRanking,
} from "@/hooks/useAnalytics";
import type { Period } from "@/lib/services/analytics.service";

export function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState<Period>("30d");

  const { data: kpisData, isLoading: isLoadingKPIs, error: errorKPIs } = useAnalyticsKPIs(timeRange);
  const { data: temporalData, isLoading: isLoadingTemporal, error: errorTemporal } = useTemporalData(timeRange);
  const { data: deviceData, isLoading: isLoadingDevice, error: errorDevice } = useDeviceData(timeRange);
  const { data: browserData, isLoading: isLoadingBrowser, error: errorBrowser } = useBrowserData(timeRange);
  const { data: funnelData, isLoading: isLoadingFunnel, error: errorFunnel } = useFunnelData(timeRange);
  const { data: heatmapData, isLoading: isLoadingHeatmap, error: errorHeatmap } = useHeatmapData(timeRange);
  const { data: locationData, isLoading: isLoadingLocation, error: errorLocation } = useLocationData(timeRange);
  const { data: formRankingData, isLoading: isLoadingRanking, error: errorRanking } = useFormRanking(timeRange);

  const isLoading = isLoadingKPIs || isLoadingTemporal || isLoadingDevice || isLoadingBrowser;



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
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as Period)}>
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
      {isLoadingKPIs ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : errorKPIs ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Erro ao carregar KPIs. Verifique o console para mais detalhes.
            </p>
          </CardContent>
        </Card>
      ) : kpisData ? (
        <SectionCards
          stats={[
            {
              title: "Crescimento",
              value: kpisData.growth.value,
              trend: kpisData.growth.trend !== undefined ? {
                value: `${kpisData.growth.trend > 0 ? '+' : ''}${kpisData.growth.trend}%`,
                isPositive: kpisData.growth.isPositive ?? true,
              } : undefined,
              description: kpisData.growth.description || "Total de respostas",
              footer: "vs período anterior",
            },
            {
              title: "Taxa de Conversão",
              value: `${kpisData.conversionRate.value}%`,
              trend: kpisData.conversionRate.trend !== undefined ? {
                value: `${kpisData.conversionRate.trend > 0 ? '+' : ''}${kpisData.conversionRate.trend}pp`,
                isPositive: kpisData.conversionRate.isPositive ?? true,
              } : undefined,
              description: kpisData.conversionRate.description || "Taxa de conclusão",
              footer: "vs período anterior",
            },
            {
              title: "Tempo Médio",
              value: kpisData.averageTime.value,
              trend: kpisData.averageTime.trend !== undefined ? {
                value: `${kpisData.averageTime.trend}s`,
                isPositive: kpisData.averageTime.isPositive ?? true,
              } : undefined,
              description: kpisData.averageTime.description || "Tempo de preenchimento",
              footer: "vs período anterior",
            },
            {
              title: "Engajamento",
              value: kpisData.engagement.value,
              trend: kpisData.engagement.trend !== undefined ? {
                value: `${kpisData.engagement.trend > 0 ? '+' : ''}${kpisData.engagement.trend}`,
                isPositive: kpisData.engagement.isPositive ?? true,
              } : undefined,
              description: kpisData.engagement.description || "Score de engajamento",
              footer: "Baseado em interações",
            },
          ]}
        />
      ) : null}

      {/* Temporal Chart */}
      <TemporalChart data={temporalData?.data || []} timeRange={timeRange} />

      {/* Device & Browser Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <DeviceChart data={deviceData?.data || []} />
        <BrowserChart data={browserData?.data || []} />
      </div>

      {/* Heatmap */}
      <ActivityHeatmap data={heatmapData?.data || []} />

      {/* Location Table */}
      <LocationTable data={locationData?.data || []} />

      {/* Conversion Funnel */}
      <ConversionFunnel data={funnelData?.data || []} />

      {/* Field Performance - Removido (endpoint não existe) */}

      {/* Form Ranking */}
      <FormRankingTable data={formRankingData?.data || []} />
    </div>
  );
}
