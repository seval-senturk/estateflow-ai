export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-6 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
