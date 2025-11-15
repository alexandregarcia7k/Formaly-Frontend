import { Suspense } from "react";
import { ResponsesClient } from "./ResponsesClient";

interface ResponsesPageProps {
  searchParams: Promise<{ responseId?: string }>;
}

function ResponsesPageSkeleton() {
  return (
    <div className="@container/main space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

export default function ResponsesPage({ searchParams }: ResponsesPageProps) {
  return (
    <Suspense fallback={<ResponsesPageSkeleton />}>
      <ResponsesClient searchParams={searchParams} />
    </Suspense>
  );
}
