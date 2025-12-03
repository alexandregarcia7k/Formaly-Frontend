import { z } from "zod";

// Period enum
export const periodSchema = z.enum(["7d", "30d", "90d", "1y"]);
export type Period = z.infer<typeof periodSchema>;

// Temporal Data
export const temporalDataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  acessos: z.number().int().nonnegative(),
  respostas: z.number().int().nonnegative(),
}).strict();

export const temporalDataResponseSchema = z.object({
  data: z.array(temporalDataPointSchema),
}).strict();

export type TemporalDataPoint = z.infer<typeof temporalDataPointSchema>;
export type TemporalDataResponse = z.infer<typeof temporalDataResponseSchema>;

// Device Data
export const deviceDataItemSchema = z.object({
  name: z.string().min(1),
  value: z.number().min(0).max(100),
  count: z.number().int().nonnegative(),
}).strict();

export const deviceDataResponseSchema = z.object({
  data: z.array(deviceDataItemSchema),
  topDevice: z.string().min(1),
}).strict();

export type DeviceDataItem = z.infer<typeof deviceDataItemSchema>;
export type DeviceDataResponse = z.infer<typeof deviceDataResponseSchema>;

// Browser Data
export const browserDataItemSchema = z.object({
  name: z.string().min(1),
  value: z.number().min(0).max(100),
  count: z.number().int().nonnegative(),
}).strict();

export const browserDataResponseSchema = z.object({
  data: z.array(browserDataItemSchema),
  topBrowser: z.string().min(1),
}).strict();

export type BrowserDataItem = z.infer<typeof browserDataItemSchema>;
export type BrowserDataResponse = z.infer<typeof browserDataResponseSchema>;

// Funnel Data
export const funnelStepSchema = z.object({
  stage: z.string().min(1),
  count: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
  dropoff: z.number().min(0).max(100),
}).strict();

export const funnelDataResponseSchema = z.object({
  data: z.array(funnelStepSchema),
  totalViews: z.number().int().nonnegative(),
  totalSubmissions: z.number().int().nonnegative(),
  overallConversion: z.number().min(0).max(100),
  criticalPoints: z.array(z.string()),
}).strict();

export type FunnelStep = z.infer<typeof funnelStepSchema>;
export type FunnelDataResponse = z.infer<typeof funnelDataResponseSchema>;

// Heatmap Data
export const heatmapHourSchema = z.object({
  hour: z.number().int().min(0).max(23),
  count: z.number().int().nonnegative(),
}).strict();

export const heatmapDaySchema = z.object({
  day: z.string().min(1),
  hours: z.array(heatmapHourSchema),
}).strict();

export const heatmapDataResponseSchema = z.object({
  data: z.array(heatmapDaySchema),
  peakDay: z.string().min(1),
  peakHour: z.number().int().min(0).max(23),
}).strict();

export type HeatmapHour = z.infer<typeof heatmapHourSchema>;
export type HeatmapDay = z.infer<typeof heatmapDaySchema>;
export type HeatmapDataResponse = z.infer<typeof heatmapDataResponseSchema>;

// Location Data
export const locationDataItemSchema = z.object({
  state: z.string().min(1),
  acessos: z.number().int().nonnegative(),
  respostas: z.number().int().nonnegative(),
  taxa: z.number().min(0).max(100),
}).strict();

export const locationDataResponseSchema = z.object({
  data: z.array(locationDataItemSchema),
  bestConversion: z.string().min(1),
}).strict();

export type LocationDataItem = z.infer<typeof locationDataItemSchema>;
export type LocationDataResponse = z.infer<typeof locationDataResponseSchema>;

// KPIs
export const kpiMetricSchema = z.object({
  value: z.union([z.number(), z.string().min(1)]),
  trend: z.number().optional(),
  isPositive: z.boolean().optional(),
  description: z.string().optional(),
});

export const kpisResponseSchema = z.object({
  growth: kpiMetricSchema,
  conversionRate: kpiMetricSchema,
  averageTime: kpiMetricSchema,
  engagement: kpiMetricSchema,
});

export type KPIMetric = z.infer<typeof kpiMetricSchema>;
export type KPIsResponse = z.infer<typeof kpisResponseSchema>;

// Form Ranking
export const formRankingItemSchema = z.object({
  rank: z.number().int().positive(),
  formId: z.string().uuid(),
  nome: z.string().min(1),
  acessos: z.number().int().nonnegative(),
  respostas: z.number().int().nonnegative(),
  conversao: z.number().min(0).max(100),
  tempo: z.string().min(1),
  score: z.number().int().min(1).max(5),
}).strict();

export const formRankingResponseSchema = z.object({
  data: z.array(formRankingItemSchema),
  averageConversion: z.number().min(0).max(100),
  problematicForms: z.array(z.string()),
}).strict();

export type FormRankingItem = z.infer<typeof formRankingItemSchema>;
export type FormRankingResponse = z.infer<typeof formRankingResponseSchema>;
