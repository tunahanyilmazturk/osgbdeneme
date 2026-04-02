import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  count?: number;
  columns?: number;
}

export function CardSkeleton({ count = 1, columns = 1 }: CardSkeletonProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-[60px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  const widths = ["w-[25%]", "w-[30%]", "w-[20%]", "w-[25%]]"];
  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <Skeleton className="h-6 w-[150px]" />
      <div className="space-y-2">
        {/* Header */}
        <div className="flex gap-4 py-2 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[20%]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-2">
            <Skeleton className="h-3 w-[80px]" />
            <Skeleton className="h-5 w-[150px]" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl border p-6 space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
