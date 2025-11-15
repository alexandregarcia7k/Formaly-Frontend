import { Suspense } from "react";
import { AnalyticsClient } from "./AnalyticsClient";
import { AnalyticsSkeleton } from "./AnalyticsSkeleton";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsClient />
    </Suspense>
  );
}
