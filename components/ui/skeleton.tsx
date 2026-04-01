export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="skeleton-avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-text w-3/4" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="skeleton-text" />
        <Skeleton className="skeleton-text w-5/6" />
        <Skeleton className="skeleton-text w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="skeleton-avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="skeleton-text w-1/3" />
            <Skeleton className="skeleton-text w-2/3" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}
