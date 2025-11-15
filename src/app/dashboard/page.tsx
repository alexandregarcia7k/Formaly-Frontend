import { Suspense } from "react";
import { DashboardClient } from "./DashboardClient";
import { DashboardSkeleton } from "./DashboardSkeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}
