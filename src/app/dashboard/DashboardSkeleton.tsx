export function DashboardSkeleton() {
  return (
    <div className="@container/main space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      </div>

      {/* Stats Cards - 3 horizontal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      {/* Quick Actions - 3 horizontal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      {/* Timeline + Chart */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      </div>

      {/* Latest Responses Table */}
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
