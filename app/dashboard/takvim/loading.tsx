import { Skeleton } from "@/components/ui/skeleton";

export default function TakvimLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[160px]" />
          <Skeleton className="h-4 w-[260px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-[120px] rounded-lg" />
        </div>
      </div>

      {/* Calendar View */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
          {/* Calendar days */}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`aspect-square w-full rounded-lg ${i > 30 ? 'opacity-30' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="h-6 w-[180px] mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
