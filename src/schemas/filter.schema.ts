import { z } from "zod";

// Date range para filtros (client-side)
export const dateRangeSchema = z.object({
  from: z.date().min(new Date("1900-01-01"), "Data muito antiga"),
  to: z.date().optional(),
}).refine(
  (data) => !data.to || data.from <= data.to,
  { message: "Data inicial deve ser anterior à data final", path: ["to"] }
);

// Tipos inferidos
export type DateRange = z.infer<typeof dateRangeSchema>;
