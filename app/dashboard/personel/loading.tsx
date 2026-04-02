import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons";

export default function PersonelLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-4 w-[280px]" />
        </div>
        <Skeleton className="h-10 w-[160px] rounded-lg" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card">
        <Skeleton className="h-10 w-full sm:w-[280px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[130px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* Table */}
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
